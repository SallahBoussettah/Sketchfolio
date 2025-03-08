'use client';

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import './DrawingAnimation.css';

const DrawingAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    // Initialize paths with the animation properties but don't play yet
    animationRef.current = anime({
      targets: '.path-draw',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: (el, i) => i * 500,
      direction: 'alternate',
      loop: false,
      autoplay: false
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
    }
  };

  const handleReset = () => {
    if (animationRef.current) {
      animationRef.current.pause();
      setIsAnimating(false);
      // Reset the stroke dash offset to original value
      anime.set('.path-draw', {
        strokeDashoffset: anime.setDashoffset
      });
    }
  };

  return (
    <div className="animation-container">
      <div className="drawing-canvas">
        <svg width="800" height="500" viewBox="0 0 800 500">
          <path 
            className="path-draw" 
            d="M 100 100 C 200 50, 300 50, 400 100 S 600 150, 700 100" 
            fill="none" 
            stroke="black" 
            strokeWidth="3"
          />
          <path 
            className="path-draw" 
            d="M 100 200 C 200 150, 300 150, 400 200 S 600 250, 700 200" 
            fill="none" 
            stroke="black" 
            strokeWidth="3"
          />
          <path 
            className="path-draw" 
            d="M 100 300 C 200 250, 300 250, 400 300 S 600 350, 700 300" 
            fill="none" 
            stroke="black" 
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
  );
};

export default DrawingAnimation; 