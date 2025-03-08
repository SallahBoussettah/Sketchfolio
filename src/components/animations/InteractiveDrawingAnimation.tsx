'use client';

import { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import DrawingCanvas from '../interactive/DrawingCanvas';
import './InteractiveDrawingAnimation.css';

const InteractiveDrawingAnimation = () => {
  const [activeTab, setActiveTab] = useState<'animation' | 'drawing'>('animation');
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<anime.AnimeInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize paths with the animation properties but don't play yet
    animationRef.current = anime({
      targets: '.interactive-path-draw',
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
      targets: '.interactive-path-draw',
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
    
    // Clean up animation when component unmounts
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

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

  const handleReset = () => {
    if (animationRef.current) {
      animationRef.current.pause();
      setIsAnimating(false);
      // Reset the stroke dash offset to original value
      anime.set('.interactive-path-draw', {
        strokeDashoffset: anime.setDashoffset
      });
    }
  };
  
  const handleTabChange = (tab: 'animation' | 'drawing') => {
    setActiveTab(tab);
    
    if (tab === 'animation') {
      // Fade out the drawing canvas and fade in the animation
      anime({
        targets: '.drawing-section',
        opacity: [1, 0],
        easing: 'easeOutQuad',
        duration: 300,
        complete: () => {
          anime({
            targets: '.animation-section',
            opacity: [0, 1],
            easing: 'easeInQuad',
            duration: 300
          });
        }
      });
    } else {
      // Fade out the animation and fade in the drawing canvas
      anime({
        targets: '.animation-section',
        opacity: [1, 0],
        easing: 'easeOutQuad',
        duration: 300,
        complete: () => {
          anime({
            targets: '.drawing-section',
            opacity: [0, 1],
            easing: 'easeInQuad',
            duration: 300
          });
        }
      });
    }
  };

  // Calculate container width for drawing canvas
  const getContainerWidth = () => {
    if (!containerRef.current) return 800;
    return containerRef.current.clientWidth;
  };

  return (
    <div className="interactive-drawing-animation" ref={containerRef}>
      <div className="animation-tabs">
        <button 
          className={`tab-button ${activeTab === 'animation' ? 'active' : ''}`}
          onClick={() => handleTabChange('animation')}
        >
          View Animation
        </button>
        <button 
          className={`tab-button ${activeTab === 'drawing' ? 'active' : ''}`}
          onClick={() => handleTabChange('drawing')}
        >
          Draw Your Own
        </button>
      </div>
      
      <div className="animation-content">
        {/* Animation Section */}
        <div className={`animation-section ${activeTab === 'animation' ? 'active' : ''}`}>
          <div className="drawing-canvas-animation">
            <svg width="800" height="500" viewBox="0 0 800 500">
              <path 
                className="interactive-path-draw" 
                d="M 100 100 C 200 50, 300 50, 400 100 S 600 150, 700 100" 
                fill="none" 
                stroke="#333" 
                strokeWidth="3"
              />
              <path 
                className="interactive-path-draw" 
                d="M 100 200 C 200 150, 300 150, 400 200 S 600 250, 700 200" 
                fill="none" 
                stroke="#333" 
                strokeWidth="3"
              />
              <path 
                className="interactive-path-draw" 
                d="M 100 300 C 200 250, 300 250, 400 300 S 600 350, 700 300" 
                fill="none" 
                stroke="#333" 
                strokeWidth="3"
              />
            </svg>
          </div>
          
          <div className="animation-controls">
            <button 
              onClick={handleAnimate}
              className="animate-btn"
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
        
        {/* Drawing Section */}
        <div className={`drawing-section ${activeTab === 'drawing' ? 'active' : ''}`}>
          <DrawingCanvas 
            width={getContainerWidth() > 800 ? 800 : getContainerWidth() - 40}
            height={500}
            backgroundColor="#f9f7f1"
            strokeColor="#333333"
            strokeWidth={3}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveDrawingAnimation; 