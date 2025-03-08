'use client';

import { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import anime from 'animejs';
import './AboutSection.css';

const AboutSection = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const portraitSequenceRef = useRef<any>(null);
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
    // Detect if on mobile
    const isMobile = window.innerWidth <= 768;
    
    // Group lines by feature for sequential animation
    const portraitSequence = anime.timeline({
      easing: 'easeInOutSine',
      autoplay: false
    });
    
    // Store sequence in ref so we can access it from onClick
    portraitSequenceRef.current = portraitSequence;
    
    // Speed up animations slightly on mobile
    const durationMultiplier = isMobile ? 0.8 : 1;
    
    // Face outline first
    portraitSequence.add({
      targets: '.portrait-line:nth-child(2)', // The face outline
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 1200 * durationMultiplier,
      easing: 'easeInOutQuad'
    });
    
    // Then eyes and facial features
    portraitSequence.add({
      targets: '.portrait-line:nth-child(n+3):nth-child(-n+12)', // Eyes, brows, nose, mouth
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 1000 * durationMultiplier,
      delay: anime.stagger(isMobile ? 50 : 100),
      easing: 'easeOutQuad'
    }, '-=400'); // Overlap with previous animation
    
    // Then hair
    portraitSequence.add({
      targets: '.portrait-line:nth-child(n+13):nth-child(-n+17)', // Hair lines
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 800 * durationMultiplier,
      delay: anime.stagger(isMobile ? 30 : 50),
      easing: 'easeOutQuad'
    }, '-=300');
    
    // Then body parts
    portraitSequence.add({
      targets: '.portrait-line:nth-child(n+18)', // Body, limbs, clothing
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 1200 * durationMultiplier,
      delay: anime.stagger(isMobile ? 40 : 70),
      easing: 'easeInOutQuad'
    }, '-=200');
    
    // Finally fade in fills
    portraitSequence.add({
      targets: '.portrait-fill',
      opacity: [0, 0.8],
      easing: 'easeOutQuad',
      duration: 800 * durationMultiplier,
      delay: anime.stagger(isMobile ? 80 : 150)
    }, '-=400');
    
    // Add subtle continuous animation to make portrait feel alive
    // Only add liveness animation on non-mobile devices to save resources
    const livenessAnimation = !isMobile ? anime({
      targets: '.portrait-line',
      strokeWidth: (el: SVGElement) => {
        const currentWidth = parseFloat(el.getAttribute('stroke-width') || '2');
        return [currentWidth, currentWidth * 1.2, currentWidth];
      },
      opacity: [1, 0.8, 1],
      easing: 'easeInOutSine',
      duration: 3000,
      delay: anime.stagger(100, {start: 2000}),
      direction: 'alternate',
      loop: true,
      autoplay: false
    }) : null;
    
    const handleMouseEnter = () => {
      if (!isMobile) {
        portraitSequence.restart();
        setTimeout(() => {
          if (livenessAnimation) livenessAnimation.restart();
        }, 3000);
      }
    };
    
    const portraitEl = imageRef.current;
    if (portraitEl) {
      // Only add mouse enter event on non-mobile
      if (!isMobile) {
        portraitEl.addEventListener('mouseenter', handleMouseEnter);
      }
      
      // Auto-play on first view
      setTimeout(() => {
        portraitSequence.play();
        if (!isMobile && livenessAnimation) {
          setTimeout(() => {
            livenessAnimation.play();
          }, 3500);
        }
      }, 500);
    }
    
    return () => {
      if (portraitEl && !isMobile) {
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
        <div 
          className="about-portrait" 
          ref={imageRef}
          onClick={() => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile && portraitSequenceRef.current) {
              // Call animation from the ref
              portraitSequenceRef.current.restart();
            }
          }}
        >
          {/* Artist portrait as SVG for animation */}
          <svg width="100%" height="100%" viewBox="0 0 300 400" className="portrait-svg" preserveAspectRatio="xMidYMid meet">
            <rect width="100%" height="100%" fill="#f5f5f5" />
            
            {/* Enhanced artist portrait sketch */}
            {/* Face outline */}
            <ellipse cx="150" cy="120" rx="80" ry="90" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            
            {/* More detailed facial features */}
            {/* Eyes */}
            <ellipse cx="125" cy="100" rx="15" ry="10" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            <ellipse cx="175" cy="100" rx="15" ry="10" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            <circle cx="125" cy="100" r="5" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            <circle cx="175" cy="100" r="5" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            
            {/* Eyebrows */}
            <path d="M 110 85 Q 125 80, 140 85" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            <path d="M 160 85 Q 175 80, 190 85" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            
            {/* Nose */}
            <path d="M 150 110 Q 145 130, 150 140" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            <path d="M 150 140 Q 155 142, 160 140" className="portrait-line" fill="none" stroke="#333" strokeWidth="1" />
            
            {/* Mouth - more expressive smile */}
            <path d="M 120 160 Q 150 180, 180 160" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M 130 160 Q 150 170, 170 160" className="portrait-line" fill="none" stroke="#333" strokeWidth="1" />
            
            {/* Hair */}
            <path d="M 90 100 Q 80 80, 95 60 Q 120 40, 150 35 Q 180 40, 205 60 Q 220 80, 210 100" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M 90 100 Q 100 90, 120 85" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            <path d="M 210 100 Q 200 90, 180 85" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            <path d="M 120 40 Q 140 60, 150 40" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            <path d="M 150 40 Q 160 60, 180 40" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            
            {/* Neck */}
            <path d="M 130 210 Q 150 220, 170 210 L 170 235 Q 150 245, 130 235 Z" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            
            {/* Body - improved proportions */}
            <path d="M 150 245 L 150 320" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            
            {/* Improved shoulders and arms */}
            <path d="M 150 250 Q 120 255, 95 280" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M 150 250 Q 180 255, 205 280" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            
            {/* Hands */}
            <path d="M 95 280 Q 90 285, 85 280 Q 80 275, 85 270 Q 90 265, 95 270 Q 100 275, 95 280" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            <path d="M 205 280 Q 210 285, 215 280 Q 220 275, 215 270 Q 210 265, 205 270 Q 200 275, 205 280" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            
            {/* Legs with better proportions */}
            <path d="M 150 320 Q 140 330, 130 350 Q 125 360, 120 370" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            <path d="M 150 320 Q 160 330, 170 350 Q 175 360, 180 370" className="portrait-line" fill="none" stroke="#333" strokeWidth="2" />
            
            {/* Feet */}
            <path d="M 120 370 Q 115 375, 105 375 Q 100 375, 100 370" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            <path d="M 180 370 Q 185 375, 195 375 Q 200 375, 200 370" className="portrait-line" fill="none" stroke="#333" strokeWidth="1.5" />
            
            {/* Clothing details - simple shirt */}
            <path d="M 130 265 Q 150 275, 170 265" className="portrait-line" fill="none" stroke="#333" strokeWidth="1" />
            <path d="M 130 285 Q 150 295, 170 285" className="portrait-line" fill="none" stroke="#333" strokeWidth="1" />
            <path d="M 130 305 Q 150 315, 170 305" className="portrait-line" fill="none" stroke="#333" strokeWidth="1" />
            
            {/* Fill elements with better colors */}
            <ellipse cx="150" cy="120" rx="80" ry="90" className="portrait-fill" fill="#f0ead6" opacity="0" />
            <circle cx="125" cy="100" r="4" className="portrait-fill" fill="#333" opacity="0" />
            <circle cx="175" cy="100" r="4" className="portrait-fill" fill="#333" opacity="0" />
          </svg>
          
          <div className="portrait-frame"></div>
          
          {/* Mobile tap hint that only shows on small screens */}
          <div className="mobile-tap-hint">Tap to animate</div>
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