'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';
import './AdvancedDrawing.css';

const AdvancedDrawing = () => {
  const animationRef = useRef<any>(null);

  useEffect(() => {
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
        targets: '.frame-path',
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 2000,
        delay: (el, i) => i * 200,
        easing: 'easeInOutSine'
      })
      // Draw the sketch elements
      .add({
        targets: '.sketch-element',
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 3000,
        delay: (el, i) => i * 150,
        easing: 'easeInOutSine'
      }, '-=1500')
      // Fill in the colors with opacity animation
      .add({
        targets: '.fill-element',
        opacity: [0, 1],
        duration: 1500,
        delay: (el, i) => i * 100,
        easing: 'easeOutQuad'
      }, '-=2000')
      // Add the details
      .add({
        targets: '.detail-element',
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 1000,
        delay: (el, i) => i * 100,
        easing: 'easeOutQuad'
      }, '-=1000');

    animationRef.current = timeline;

    // Cleanup on component unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, []);

  const handleReplay = () => {
    if (animationRef.current) {
      animationRef.current.restart();
    }
  };

  return (
    <div className="advanced-drawing-container">
      <div className="drawing-canvas">
        <svg width="400" height="400" viewBox="0 0 400 400">
          {/* Frame */}
          <rect 
            className="frame-path" 
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
            className="sketch-element" 
            d="M 50 250 L 120 180 L 160 220 L 220 150 L 280 220 L 350 160 L 350 350 L 50 350 Z" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          {/* Sun */}
          <circle 
            className="sketch-element" 
            cx="280" 
            cy="120" 
            r="30" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          {/* Sun rays */}
          <line className="detail-element" x1="280" y1="80" x2="280" y2="70" stroke="#333" strokeWidth="2" />
          <line className="detail-element" x1="280" y1="170" x2="280" y2="160" stroke="#333" strokeWidth="2" />
          <line className="detail-element" x1="240" y1="120" x2="230" y2="120" stroke="#333" strokeWidth="2" />
          <line className="detail-element" x1="330" y1="120" x2="320" y2="120" stroke="#333" strokeWidth="2" />
          <line className="detail-element" x1="255" y1="95" x2="245" y2="85" stroke="#333" strokeWidth="2" />
          <line className="detail-element" x1="305" y1="145" x2="315" y2="155" stroke="#333" strokeWidth="2" />
          <line className="detail-element" x1="255" y1="145" x2="245" y2="155" stroke="#333" strokeWidth="2" />
          <line className="detail-element" x1="305" y1="95" x2="315" y2="85" stroke="#333" strokeWidth="2" />
          
          {/* Trees */}
          <path 
            className="sketch-element" 
            d="M 80 350 L 80 280 M 80 320 L 60 300 M 80 300 L 70 280 M 80 280 L 95 260" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          <path 
            className="sketch-element" 
            d="M 300 350 L 300 300 M 300 330 L 320 310 M 300 310 L 280 290" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          {/* Color fills that will animate in */}
          <path 
            className="fill-element" 
            d="M 50 250 L 120 180 L 160 220 L 220 150 L 280 220 L 350 160 L 350 350 L 50 350 Z" 
            fill="#aed6f1" 
            opacity="0"
          />
          
          <circle 
            className="fill-element" 
            cx="280" 
            cy="120" 
            r="30" 
            fill="#f4d03f" 
            opacity="0"
          />
          
          {/* Clouds */}
          <path 
            className="sketch-element" 
            d="M 100 120 C 110 110, 130 110, 140 120 S 170 130, 180 120" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          <path 
            className="sketch-element" 
            d="M 150 100 C 160 90, 180 90, 190 100 S 220 110, 230 100" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
          />
          
          <path 
            className="fill-element" 
            d="M 100 120 C 110 110, 130 110, 140 120 S 170 130, 180 120" 
            fill="#ffffff" 
            opacity="0"
          />
          
          <path 
            className="fill-element" 
            d="M 150 100 C 160 90, 180 90, 190 100 S 220 110, 230 100" 
            fill="#ffffff" 
            opacity="0"
          />
        </svg>
      </div>
      
      <div className="animation-controls">
        <button onClick={handleReplay} className="replay-btn">
          Replay Animation
        </button>
      </div>
    </div>
  );
};

export default AdvancedDrawing; 