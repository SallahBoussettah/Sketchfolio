'use client';

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import './InteractivePathDrawing.css';

const InteractivePathDrawing = () => {
  const [activeTab, setActiveTab] = useState<'animation' | 'drawing'>('animation');
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<anime.AnimeInstance | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  
  // Initialize animation
  useEffect(() => {
    if (activeTab === 'animation') {
      // Initialize paths with the animation properties but don't play yet
      animationRef.current = anime({
        targets: '.basic-path-draw',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        delay: (el, i) => i * 500,
        direction: 'alternate',
        loop: false,
        autoplay: false
      });

      // Add slight wiggle effect to the paths to simulate hand drawing
      anime({
        targets: '.basic-path-draw',
        translateX: () => [
          anime.random(-2, 2),
          anime.random(-2, 2),
          anime.random(-2, 2)
        ],
        translateY: () => [
          anime.random(-1, 1),
          anime.random(-1, 1),
          anime.random(-1, 1)
        ],
        easing: 'easeInOutSine',
        duration: 5000,
        loop: true,
        direction: 'alternate'
      });
    }

    // Clean up animation when component unmounts
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [activeTab]);

  // Initialize drawing canvas
  useEffect(() => {
    if (activeTab === 'drawing' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas size to match container width
        const containerWidth = containerRef.current?.clientWidth || 800;
        // Calculate appropriate canvas size based on screen width
        let canvasWidth, canvasHeight;
        
        if (window.innerWidth <= 480) {
          canvasWidth = Math.min(containerWidth - 20, 400);
          canvasHeight = 220;
        } else if (window.innerWidth <= 576) {
          canvasWidth = Math.min(containerWidth - 30, 500);
          canvasHeight = 260;
        } else if (window.innerWidth <= 768) {
          canvasWidth = Math.min(containerWidth - 40, 600);
          canvasHeight = 300;
        } else if (window.innerWidth <= 992) {
          canvasWidth = Math.min(containerWidth - 40, 700);
          canvasHeight = 350;
        } else {
          canvasWidth = Math.min(containerWidth - 40, 800);
          canvasHeight = 400;
        }
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        
        // Set background color
        ctx.fillStyle = '#f9f7f1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add paper texture effect
        addPaperTexture(ctx, canvas.width, canvas.height);
      }
    }
  }, [activeTab]);

  // Handle window resize for responsive canvas
  useEffect(() => {
    const handleResize = () => {
      if (activeTab === 'drawing' && canvasRef.current && containerRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Save the current drawing
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Calculate appropriate canvas size based on screen width
          const containerWidth = containerRef.current.clientWidth;
          let canvasWidth, canvasHeight;
          
          if (window.innerWidth <= 480) {
            canvasWidth = Math.min(containerWidth - 20, 400);
            canvasHeight = 220;
          } else if (window.innerWidth <= 576) {
            canvasWidth = Math.min(containerWidth - 30, 500);
            canvasHeight = 260;
          } else if (window.innerWidth <= 768) {
            canvasWidth = Math.min(containerWidth - 40, 600);
            canvasHeight = 300;
          } else if (window.innerWidth <= 992) {
            canvasWidth = Math.min(containerWidth - 40, 700);
            canvasHeight = 350;
          } else {
            canvasWidth = Math.min(containerWidth - 40, 800);
            canvasHeight = 400;
          }
          
          // Resize canvas
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          canvas.style.width = `${canvasWidth}px`;
          canvas.style.height = `${canvasHeight}px`;
          
          // Set background color
          ctx.fillStyle = '#f9f7f1';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add paper texture
          addPaperTexture(ctx, canvas.width, canvas.height);
          
          // Try to restore the drawing, scaling if necessary
          try {
            // For a small resize, try to preserve the drawing
            if (Math.abs(imageData.width - canvasWidth) < 100) {
              ctx.putImageData(imageData, 0, 0);
            } else {
              // For larger resizes, use drawImage for scaling
              const tempCanvas = document.createElement('canvas');
              tempCanvas.width = imageData.width;
              tempCanvas.height = imageData.height;
              const tempCtx = tempCanvas.getContext('2d');
              if (tempCtx) {
                tempCtx.putImageData(imageData, 0, 0);
                ctx.drawImage(tempCanvas, 0, 0, imageData.width, imageData.height, 0, 0, canvasWidth, canvasHeight);
              }
            }
          } catch (e) {
            console.log('Could not restore drawing after resize');
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial resize to set proper size
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTab]);

  // Add paper texture to canvas
  const addPaperTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create subtle noise
    for (let x = 0; x < width; x += 4) {
      for (let y = 0; y < height; y += 4) {
        const value = Math.floor(Math.random() * 15);
        ctx.fillStyle = `rgba(0, 0, 0, 0.0${value})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    // Add some subtle lines for paper texture
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const length = Math.random() * 20 + 5;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(angle) * length, 
        y + Math.sin(angle) * length
      );
      ctx.stroke();
    }
  };

  // Handle animation
  const handleAnimate = () => {
    if (animationRef.current) {
      animationRef.current.restart();
      setIsAnimating(true);
      
      // Reset the state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 4500); // 1500ms duration * 3 paths with delays
    }
  };

  // Handle animation reset
  const handleReset = () => {
    if (activeTab === 'animation') {
      // Reset animation
      if (animationRef.current) {
        animationRef.current.pause();
        setIsAnimating(false);
        // Reset the stroke dash offset to original value
        anime.set('.basic-path-draw', {
          strokeDashoffset: anime.setDashoffset
        });
      }
    } else {
      // Clear drawing canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Clear canvas and re-add background and texture
          ctx.fillStyle = '#f9f7f1';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          addPaperTexture(ctx, canvas.width, canvas.height);
        }
      }
    }
  };

  // Handle tab change
  const handleTabChange = (tab: 'animation' | 'drawing') => {
    setActiveTab(tab);
    
    if (tab === 'animation') {
      // Fade out the drawing canvas and fade in the animation
      anime({
        targets: '.interactive-drawing-area',
        opacity: [1, 0],
        easing: 'easeOutQuad',
        duration: 300,
        complete: () => {
          anime({
            targets: '.interactive-animation-area',
            opacity: [0, 1],
            easing: 'easeInQuad',
            duration: 300
          });
        }
      });
    } else {
      // Fade out the animation and fade in the drawing canvas
      anime({
        targets: '.interactive-animation-area',
        opacity: [1, 0],
        easing: 'easeOutQuad',
        duration: 300,
        complete: () => {
          anime({
            targets: '.interactive-drawing-area',
            opacity: [0, 1],
            easing: 'easeInQuad',
            duration: 300
          });
        }
      });
    }
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const coords = getEventCoordinates(e);
    setLastX(coords.x);
    setLastY(coords.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const coords = getEventCoordinates(e);
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Update last coordinates
    setLastX(coords.x);
    setLastY(coords.y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getEventCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in event) {
      // Touch event
      const touch = event.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
  };

  return (
    <div className="interactive-path-drawing" ref={containerRef}>
      <div className="path-drawing-tabs">
        <button 
          className={`path-tab-button ${activeTab === 'animation' ? 'active' : ''}`}
          onClick={() => handleTabChange('animation')}
        >
          View Animation
        </button>
        <button 
          className={`path-tab-button ${activeTab === 'drawing' ? 'active' : ''}`}
          onClick={() => handleTabChange('drawing')}
        >
          Draw Your Own
        </button>
      </div>
      
      <div className="path-drawing-content">
        {/* Animation Section */}
        <div className={`interactive-animation-area ${activeTab === 'animation' ? 'active' : ''}`}>
          <div className="path-drawing-canvas">
            <svg width="800" height="400" viewBox="0 0 800 400">
              <path 
                className="basic-path-draw" 
                d="M 100 100 C 200 50, 300 50, 400 100 S 600 150, 700 100" 
                fill="none" 
                stroke="black" 
                strokeWidth="3"
              />
              <path 
                className="basic-path-draw" 
                d="M 100 200 C 200 150, 300 150, 400 200 S 600 250, 700 200" 
                fill="none" 
                stroke="black" 
                strokeWidth="3"
              />
              <path 
                className="basic-path-draw" 
                d="M 100 300 C 200 250, 300 250, 400 300 S 600 350, 700 300" 
                fill="none" 
                stroke="black" 
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
        
        {/* Drawing Section */}
        <div className={`interactive-drawing-area ${activeTab === 'drawing' ? 'active' : ''}`}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="drawing-canvas"
          />
        </div>
      </div>
      
      <div className="path-animation-controls">
        <button 
          onClick={handleAnimate}
          className={`animate-btn ${activeTab === 'drawing' ? 'hidden' : ''}`}
          disabled={isAnimating}
        >
          Animate Drawing
        </button>
        <button 
          onClick={handleReset}
          className="reset-btn"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default InteractivePathDrawing; 