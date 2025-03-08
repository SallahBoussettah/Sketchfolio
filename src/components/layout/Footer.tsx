'use client';

import { useEffect } from 'react';
import anime from 'animejs';
import { useInView } from 'react-intersection-observer';
import './Footer.css';

const Footer = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  useEffect(() => {
    if (inView) {
      // Animate footer lines
      anime({
        targets: '.footer-line',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        delay: (el, i) => i * 250,
        direction: 'normal',
        loop: false
      });
      
      // Animate content
      anime({
        targets: '.footer-content',
        opacity: [0, 1],
        translateY: [20, 0],
        easing: 'easeOutExpo',
        duration: 1200,
        delay: 500
      });
      
      // Animate socials
      anime({
        targets: '.social-item',
        scale: [0, 1],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .6)',
        duration: 1200,
        delay: anime.stagger(100, {start: 800})
      });
    }
  }, [inView]);

  return (
    <footer ref={ref} className="footer">
      <div className="footer-drawing">
        <svg width="100%" height="100%" viewBox="0 0 800 150" preserveAspectRatio="none">
          <path 
            className="footer-line" 
            d="M 0,50 Q 100,45 200,50 T 400,45 T 600,55 T 800,50" 
            fill="none" 
            stroke="#333" 
            strokeWidth="1"
          />
          <path 
            className="footer-line" 
            d="M 0,70 Q 120,75 240,65 T 480,75 T 800,70" 
            fill="none" 
            stroke="#333" 
            strokeWidth="1"
          />
          <path 
            className="footer-line" 
            d="M 0,90 Q 200,95 400,85 T 800,90" 
            fill="none" 
            stroke="#333" 
            strokeWidth="1"
          />
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="footer-logo">
          <span className="footer-logo-text">Hand-Drawn Portfolio</span>
        </div>
        
        <div className="footer-text">
          <p>A showcase of hand-drawn art and animations</p>
          <p className="copyright">© {new Date().getFullYear()} Hand-Drawn Portfolio</p>
        </div>
        
        <div className="footer-socials">
          <a href="#" className="social-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a href="#" className="social-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href="#" className="social-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
            </svg>
          </a>
          <a href="#" className="social-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>
      </div>
      
      <div className="footer-notes">
        <div className="note note-1">
          <svg width="50" height="50" viewBox="0 0 50 50">
            <path d="M10,10 Q20,5 30,15 T40,10" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>
        <div className="note note-2">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="5" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M10,10 L30,30 M10,30 L30,10" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>
        <div className="note note-3">
          <svg width="60" height="30" viewBox="0 0 60 30">
            <path d="M5,15 Q15,5 30,15 T55,15" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 