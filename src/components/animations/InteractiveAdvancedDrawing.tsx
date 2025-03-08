'use client';

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import DrawingCanvas from '../interactive/DrawingCanvas';
import './InteractiveAdvancedDrawing.css';

const InteractiveAdvancedDrawing = () => {
  const [activeTab, setActiveTab] = useState<'animation' | 'drawing'>('animation');
  const animationRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'animation') {
      // Initialize the timeline
      const timeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 2000,
        autoplay: true
      });

      // Add animations to the timeline
      timeline
        // Draw the outer frame
        .add({
          targets: '.interactive-frame-path',
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: 2000,
          delay: (el, i) => i * 200,
          easing: 'easeInOutSine'
        })
        // Draw the sketch elements
        .add({
          targets: '.interactive-sketch-element',
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: 3000,
          delay: (el, i) => i * 150,
          easing: 'easeInOutSine'
        }, '-=1500')
        // Fill in the colors with opacity animation
        .add({
          targets: '.interactive-fill-element',
          opacity: [0, 1],
          duration: 1500,
          delay: (el, i) => i * 100,
          easing: 'easeOutQuad'
        }, '-=2000')
        // Add the details
        .add({
          targets: '.interactive-detail-element',
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: 1000,
          delay: (el, i) => i * 100,
          easing: 'easeOutQuad'
        }, '-=1000')
        // Add subtle movement to elements to simulate hand-drawn effect
        .add({
          targets: ['.interactive-sketch-element', '.interactive-detail-element'],
          translateX: () => anime.random(-2, 2),
          translateY: () => anime.random(-1, 1),
          rotate: () => anime.random(-0.5, 0.5),
          easing: 'easeInOutSine',
          duration: 8000,
          delay: anime.stagger(50),
          loop: true,
          direction: 'alternate'
        });

      animationRef.current = timeline;
    }

    // Add hover effects to elements
    const sketch = document.querySelectorAll('.interactive-sketch-element');
    sketch.forEach(el => {
      el.addEventListener('mouseenter', () => {
        anime({
          targets: el,
          scale: 1.02,
          duration: 300,
          easing: 'easeOutElastic(1, .6)'
        });
      });
      
      el.addEventListener('mouseleave', () => {
        anime({
          targets: el,
          scale: 1,
          duration: 300,
          easing: 'easeOutElastic(1, .6)'
        });
      });
    });

    // Cleanup on component unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
      
      sketch.forEach(el => {
        el.removeEventListener('mouseenter', () => {});
        el.removeEventListener('mouseleave', () => {});
      });
    };
  }, [activeTab]);

  const handleReplay = () => {
    if (animationRef.current) {
      // Reset everything
      anime.set(['.interactive-fill-element'], { opacity: 0 });
      anime.set(['.interactive-frame-path', '.interactive-sketch-element', '.interactive-detail-element'], { 
        strokeDashoffset: anime.setDashoffset 
      });
      
      // Restart the timeline
      animationRef.current.restart();
    }
  };
  
  const handleTabChange = (tab: 'animation' | 'drawing') => {
    setActiveTab(tab);
    
    if (tab === 'animation') {
      // Fade out the drawing canvas and fade in the animation
      anime({
        targets: '.interactive-drawing-section',
        opacity: [1, 0],
        easing: 'easeOutQuad',
        duration: 300,
        complete: () => {
          anime({
            targets: '.interactive-animation-section',
            opacity: [0, 1],
            easing: 'easeInQuad',
            duration: 300
          });
        }
      });
    } else {
      // Fade out the animation and fade in the drawing canvas
      anime({
        targets: '.interactive-animation-section',
        opacity: [1, 0],
        easing: 'easeOutQuad',
        duration: 300,
        complete: () => {
          anime({
            targets: '.interactive-drawing-section',
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
    if (!containerRef.current) return 400;
    return containerRef.current.clientWidth;
  };

  return (
    <div className="interactive-advanced-drawing" ref={containerRef}>
      <div className="advanced-animation-tabs">
        <button 
          className={`advanced-tab-button ${activeTab === 'animation' ? 'active' : ''}`}
          onClick={() => handleTabChange('animation')}
        >
          View Animation
        </button>
        <button 
          className={`advanced-tab-button ${activeTab === 'drawing' ? 'active' : ''}`}
          onClick={() => handleTabChange('drawing')}
        >
          Draw Your Own
        </button>
      </div>
      
      <div className="advanced-animation-content">
        {/* Animation Section */}
        <div className={`interactive-animation-section ${activeTab === 'animation' ? 'active' : ''}`}>
          <div className="advanced-drawing-canvas">
            <svg width="400" height="400" viewBox="0 0 400 400">
              {/* Frame */}
              <rect 
                className="interactive-frame-path" 
                x="50" 
                y="50" 
                width="300" 
                height="300" 
                rx="10" 
                fill="none" 
                stroke="#333" 
                strokeWidth="3"
              />
              
              {/* Landscape sketch - mountains */}
              <path 
                className="interactive-sketch-element" 
                d="M 50 250 L 120 180 L 160 220 L 220 150 L 280 220 L 350 160 L 350 350 L 50 350 Z" 
                fill="none" 
                stroke="#333" 
                strokeWidth="2"
              />
              
              {/* Sun */}
              <circle 
                className="interactive-sketch-element" 
                cx="280" 
                cy="120" 
                r="30" 
                fill="none" 
                stroke="#333" 
                strokeWidth="2"
              />
              
              {/* Sun rays */}
              <line className="interactive-detail-element" x1="280" y1="80" x2="280" y2="70" stroke="#333" strokeWidth="2" />
              <line className="interactive-detail-element" x1="280" y1="170" x2="280" y2="160" stroke="#333" strokeWidth="2" />
              <line className="interactive-detail-element" x1="240" y1="120" x2="230" y2="120" stroke="#333" strokeWidth="2" />
              <line className="interactive-detail-element" x1="330" y1="120" x2="320" y2="120" stroke="#333" strokeWidth="2" />
              <line className="interactive-detail-element" x1="255" y1="95" x2="245" y2="85" stroke="#333" strokeWidth="2" />
              <line className="interactive-detail-element" x1="305" y1="145" x2="315" y2="155" stroke="#333" strokeWidth="2" />
              <line className="interactive-detail-element" x1="255" y1="145" x2="245" y2="155" stroke="#333" strokeWidth="2" />
              <line className="interactive-detail-element" x1="305" y1="95" x2="315" y2="85" stroke="#333" strokeWidth="2" />
              
              {/* Trees */}
              <path 
                className="interactive-sketch-element" 
                d="M 80 350 L 80 280 M 80 320 L 60 300 M 80 300 L 70 280 M 80 280 L 95 260" 
                fill="none" 
                stroke="#333" 
                strokeWidth="2"
              />
              
              <path 
                className="interactive-sketch-element" 
                d="M 300 350 L 300 300 M 300 330 L 320 310 M 300 310 L 280 290" 
                fill="none" 
                stroke="#333" 
                strokeWidth="2"
              />
              
              {/* Color fills that will animate in */}
              <path 
                className="interactive-fill-element" 
                d="M 50 250 L 120 180 L 160 220 L 220 150 L 280 220 L 350 160 L 350 350 L 50 350 Z" 
                fill="#aed6f1" 
                opacity="0"
              />
              
              <circle 
                className="interactive-fill-element" 
                cx="280" 
                cy="120" 
                r="30" 
                fill="#f9ca24" 
                opacity="0"
              />
              
              {/* Clouds */}
              <path 
                className="interactive-sketch-element" 
                d="M 100 120 C 110 110, 130 110, 140 120 S 170 130, 180 120" 
                fill="none" 
                stroke="#333" 
                strokeWidth="2"
              />
              
              <path 
                className="interactive-sketch-element" 
                d="M 150 100 C 160 90, 180 90, 190 100 S 220 110, 230 100" 
                fill="none" 
                stroke="#333" 
                strokeWidth="2"
              />
              
              <path 
                className="interactive-fill-element" 
                d="M 100 120 C 110 110, 130 110, 140 120 S 170 130, 180 120" 
                fill="#ffffff" 
                opacity="0"
              />
              
              <path 
                className="interactive-fill-element" 
                d="M 150 100 C 160 90, 180 90, 190 100 S 220 110, 230 100" 
                fill="#ffffff" 
                opacity="0"
              />
            </svg>
          </div>
          
          <div className="advanced-animation-controls">
            <button onClick={handleReplay} className="replay-btn">
              Replay Animation
            </button>
          </div>
        </div>
        
        {/* Drawing Section */}
        <div className={`interactive-drawing-section ${activeTab === 'drawing' ? 'active' : ''}`}>
          <DrawingCanvas 
            width={getContainerWidth() > 400 ? 400 : getContainerWidth() - 40}
            height={400}
            backgroundColor="#f9f7f1"
            strokeColor="#333333"
            strokeWidth={2}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveAdvancedDrawing; 