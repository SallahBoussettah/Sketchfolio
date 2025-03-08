'use client';

import { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import anime from 'animejs';
import './AboutSection.css';

const AboutSection = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [contentRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      // Animate content elements
      anime({
        targets: '.about-text > *',
        translateY: [20, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1000,
        delay: anime.stagger(200)
      });
      
      // Animate skills
      anime({
        targets: '.skill-item',
        translateY: [30, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 800,
        delay: anime.stagger(100, {start: 400})
      });
      
      // Draw the decorative elements
      anime({
        targets: '.about-decoration path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        delay: anime.stagger(300),
        direction: 'normal',
        loop: false
      });
    }
  }, [inView]);

  // Drawing animation on the portrait
  useEffect(() => {
    const portraitLines = anime({
      targets: '.portrait-line',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 2000,
      delay: (el, i) => i * 150,
      direction: 'normal',
      loop: false,
      autoplay: false
    });
    
    const portraitFill = anime({
      targets: '.portrait-fill',
      opacity: [0, 0.7],
      easing: 'easeOutQuad',
      duration: 1000,
      delay: 1500,
      autoplay: false
    });
    
    const handleMouseEnter = () => {
      portraitLines.restart();
      portraitFill.restart();
    };
    
    const portraitEl = imageRef.current;
    if (portraitEl) {
      portraitEl.addEventListener('mouseenter', handleMouseEnter);
    }
    
    return () => {
      if (portraitEl) {
        portraitEl.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, []);

  return (
    <div className="about-section" id="about" ref={contentRef}>
      <h2 className="section-title">About the Artist</h2>
      
      <div className="about-decoration">
        <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <path d="M 50,50 Q 200,25 400,50 T 800,60" 
            stroke="#333" 
            strokeWidth="1" 
            fill="none" 
            strokeDasharray="5,5"
          />
          <path d="M 900,100 Q 850,250 900,400 T 850,550" 
            stroke="#333" 
            strokeWidth="1" 
            fill="none" 
            strokeDasharray="5,5"
          />
          <path d="M 100,550 Q 250,520 400,550 T 700,530" 
            stroke="#333" 
            strokeWidth="1" 
            fill="none" 
            strokeDasharray="5,5"
          />
        </svg>
      </div>
      
      <div className="about-content">
        <div className="about-portrait" ref={imageRef}>
          {/* Artist portrait as SVG for animation */}
          <svg width="300" height="400" viewBox="0 0 300 400" className="portrait-svg">
            <rect width="100%" height="100%" fill="#f5f5f5" />
            
            {/* Artist portrait sketch */}
            <ellipse cx="150" cy="120" rx="80" ry="90" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M 110 180 C 130 200, 170 200, 190 180" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <circle cx="120" cy="100" r="10" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <circle cx="180" cy="100" r="10" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M 120 100 Q 150 120, 180 100" className="portrait-line" fill="none" stroke="#333" strokeWidth="1" />
            <path d="M 90 160 Q 150 190, 210 160" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            
            <path d="M 150 230 L 150 300" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M 150 250 L 100 280" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M 150 250 L 200 280" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M 150 300 L 120 350" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M 150 300 L 180 350" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            
            {/* Fill elements that will fade in */}
            <ellipse cx="150" cy="120" rx="80" ry="90" className="portrait-fill" fill="#f0ead6" opacity="0" />
            <circle cx="120" cy="100" r="8" className="portrait-fill" fill="#333" opacity="0" />
            <circle cx="180" cy="100" r="8" className="portrait-fill" fill="#333" opacity="0" />
          </svg>
          
          <div className="portrait-frame"></div>
        </div>
        
        <div className="about-text">
          <h3>Hello, I'm Salah Eddine</h3>
          <p>I'm a professional illustrator and artist specialized in hand-drawn art with over 10 years of experience creating unique illustrations and artwork for clients worldwide.</p>
          <p>My work combines traditional drawing techniques with digital enhancements, maintaining the authentic feel of hand-drawn art while leveraging technology to create engaging interactive experiences.</p>
          <p>With a background in fine arts and a passion for digital innovation, I create artwork that bridges traditional and contemporary approaches. Each piece in my portfolio represents my dedication to craftsmanship and artistic expression.</p>
          
          <div className="about-skills">
            <h4>Skills & Techniques</h4>
            <div className="skills-container">
              <div className="skill-item">Pencil Drawing</div>
              <div className="skill-item">Ink Illustration</div>
              <div className="skill-item">Watercolor</div>
              <div className="skill-item">Digital Art</div>
              <div className="skill-item">Character Design</div>
              <div className="skill-item">Concept Art</div>
              <div className="skill-item">Animation</div>
              <div className="skill-item">Storyboarding</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection; 