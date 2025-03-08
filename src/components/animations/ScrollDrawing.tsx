'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import anime from 'animejs';
import './ScrollDrawing.css';

const ScrollDrawing = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const animationTriggered = useRef(false);

  useEffect(() => {
    if (inView && !animationTriggered.current) {
      animationTriggered.current = true;
      
      // Create staggered animation for the paths
      anime({
        targets: '.scroll-path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 2000,
        delay: anime.stagger(200),
        direction: 'normal',
        loop: false
      });
      
      // Animate the fills after the paths are drawn
      anime({
        targets: '.scroll-fill',
        opacity: [0, 1],
        easing: 'easeInOutQuad',
        duration: 800,
        delay: anime.stagger(200, {start: 1500}),
      });
      
      // Add some paper movement effect
      anime({
        targets: '.scroll-drawing-container',
        scale: [0.98, 1],
        translateY: ['10px', '0px'],
        opacity: [0.8, 1],
        easing: 'easeOutExpo',
        duration: 1200
      });
    }
  }, [inView]);

  return (
    <div ref={ref} className="scroll-drawing-container">
      <h3 className="scroll-title">Scroll-Activated Drawing</h3>
      <p className="scroll-description">This artwork is revealed as you scroll down the page.</p>
      
      <div className="scroll-canvas">
        <svg width="600" height="300" viewBox="0 0 600 300">
          {/* Background frame */}
          <rect 
            className="scroll-path" 
            x="50" 
            y="50" 
            width="500" 
            height="200" 
            rx="10" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          {/* Trees */}
          <path 
            className="scroll-path" 
            d="M 100 250 L 100 180 M 100 230 L 80 210 M 100 210 L 120 190" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          <path 
            className="scroll-path" 
            d="M 150 250 L 150 160 M 150 230 L 130 210 M 150 200 L 170 180 M 150 180 L 140 160" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          {/* Mountains */}
          <path 
            className="scroll-path" 
            d="M 50 250 L 150 150 L 250 250" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          <path 
            className="scroll-path" 
            d="M 200 250 L 300 120 L 400 250" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          <path 
            className="scroll-path" 
            d="M 350 250 L 450 180 L 550 250" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          {/* Sun */}
          <circle 
            className="scroll-path" 
            cx="500" 
            cy="100" 
            r="30" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          {/* Sun rays */}
          <line className="scroll-path" x1="500" y1="60" x2="500" y2="50" stroke="#333" strokeWidth="2" />
          <line className="scroll-path" x1="500" y1="150" x2="500" y2="140" stroke="#333" strokeWidth="2" />
          <line className="scroll-path" x1="460" y1="100" x2="450" y2="100" stroke="#333" strokeWidth="2" />
          <line className="scroll-path" x1="550" y1="100" x2="540" y2="100" stroke="#333" strokeWidth="2" />
          <line className="scroll-path" x1="475" y1="75" x2="465" y2="65" stroke="#333" strokeWidth="2" />
          <line className="scroll-path" x1="525" y1="125" x2="535" y2="135" stroke="#333" strokeWidth="2" />
          <line className="scroll-path" x1="475" y1="125" x2="465" y2="135" stroke="#333" strokeWidth="2" />
          <line className="scroll-path" x1="525" y1="75" x2="535" y2="65" stroke="#333" strokeWidth="2" />
          
          {/* Clouds */}
          <path 
            className="scroll-path" 
            d="M 200 100 C 210 90, 230 90, 240 100 S 270 110, 280 100" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          <path 
            className="scroll-path" 
            d="M 350 80 C 360 70, 380 70, 390 80 S 420 90, 430 80" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          {/* Ground */}
          <line 
            className="scroll-path" 
            x1="50" 
            y1="250" 
            x2="550" 
            y2="250" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          {/* Color fills */}
          <path 
            className="scroll-fill" 
            d="M 50 250 L 150 150 L 250 250 Z" 
            fill="#a1c084" 
            opacity="0"
          />
          
          <path 
            className="scroll-fill" 
            d="M 200 250 L 300 120 L 400 250 Z" 
            fill="#749a5b" 
            opacity="0"
          />
          
          <path 
            className="scroll-fill" 
            d="M 350 250 L 450 180 L 550 250 Z" 
            fill="#8fb175" 
            opacity="0"
          />
          
          <circle 
            className="scroll-fill" 
            cx="500" 
            cy="100" 
            r="30" 
            fill="#f9ca24" 
            opacity="0"
          />
          
          <path 
            className="scroll-fill" 
            d="M 200 100 C 210 90, 230 90, 240 100 S 270 110, 280 100" 
            fill="#ffffff" 
            opacity="0"
          />
          
          <path 
            className="scroll-fill" 
            d="M 350 80 C 360 70, 380 70, 390 80 S 420 90, 430 80" 
            fill="#ffffff" 
            opacity="0"
          />
        </svg>
      </div>
      
      <div className="scroll-info">
        <p>Keep scrolling to see more animations!</p>
      </div>
    </div>
  );
};

export default ScrollDrawing; 