'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import anime from 'animejs';
import './NavBar.css';

const NavBar = () => {
  const [activePage, setActivePage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId: string) => {
    setActivePage(sectionId);
    
    // Close mobile menu if open
    if (menuOpen) {
      setMenuOpen(false);
    }
    
    // Get the element to scroll to
    const element = document.getElementById(sectionId);
    
    // If element exists, scroll to it
    if (element) {
      // Add a small delay to ensure any state changes have completed
      setTimeout(() => {
        // Use a smaller navbar height value to match our CSS changes
        const navbarHeight = window.innerWidth <= 480 ? 50 : 60; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    } else if (sectionId === 'home') {
      // For home, scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  useEffect(() => {
    // Initialize the navbar animation for SVG lines only
    anime({
      targets: '.nav-line',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: function(el, i) { return i * 250 },
      direction: 'normal',
    });
  }, []); // Empty dependency array for initial animation
  
  // Separate useEffect for scroll handling
  useEffect(() => {
    // Function to determine which section is currently in view
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Add offset for navbar height
      
      // Get all section elements
      const sections = [
        { id: 'home', element: document.getElementById('home') },
        { id: 'about', element: document.getElementById('about') },
        { id: 'gallery', element: document.getElementById('gallery') },
        { id: 'animations', element: document.getElementById('animations') },
        { id: 'interactive', element: document.getElementById('interactive') },
      ].filter(section => section.element !== null); // Filter out sections that don't exist
      
      // Find the current section
      let currentSection = 'home';
      
      for (const section of sections) {
        const element = section.element;
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (
            scrollPosition >= offsetTop && 
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentSection = section.id;
            break;
          }
        }
      }
      
      if (currentSection !== activePage) {
        setActivePage(currentSection);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check on mount
    handleScroll();
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array as we're handling activePage state internally
  
  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', menuOpen);
    setMenuOpen(!menuOpen);
  };
  
  // Add console logging when the menu state changes
  useEffect(() => {
    console.log('Menu state changed to:', menuOpen);
  }, [menuOpen]);
  
  // Framer Motion variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    closed: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.2
      }
    },
    open: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <nav className={`navbar ${menuOpen ? 'menu-open' : ''}`}>
      <div className="nav-drawing">
        <svg width="100%" height="100%" viewBox="0 0 800 100" preserveAspectRatio="none">
          <path 
            className="nav-line" 
            d="M 0 80 C 100 100, 300 50, 400 80 S 700 20, 800 50" 
            fill="none" 
            stroke="#333" 
            strokeWidth="1"
          />
          <path 
            className="nav-line" 
            d="M 0 70 C 200 20, 400 120, 600 70 S 700 90, 800 60" 
            fill="none" 
            stroke="#333" 
            strokeWidth="1"
          />
        </svg>
      </div>
      
      <div className="nav-content">
        <Link href="/" className="logo" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
          <h1 className="logo-text">Sketchfolio</h1>
        </Link>
        
        <div className="nav-links">
          <Link href="#home" 
            className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
          >
            Home
          </Link>
          <Link href="#about" 
            className={`nav-item ${activePage === 'about' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
          >
            About
          </Link>
          <Link href="#gallery" 
            className={`nav-item ${activePage === 'gallery' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}
          >
            Gallery
          </Link>
          <Link href="#animations" 
            className={`nav-item ${activePage === 'animations' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('animations'); }}
          >
            Animations
          </Link>
          <Link href="#interactive" 
            className={`nav-item ${activePage === 'interactive' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('interactive'); }}
          >
            Interactive
          </Link>
        </div>
        
        <button 
          className="mobile-menu-toggle" 
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }} 
          aria-label="Toggle menu"
        >
          <div className={`menu-icon ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
      
      {/* Mobile menu */}
      <motion.div 
        className="mobile-nav"
        initial="closed"
        animate={menuOpen ? "open" : "closed"}
        variants={menuVariants}
        style={{
          visibility: menuOpen ? "visible" : "hidden",
          pointerEvents: menuOpen ? "auto" : "none"
        }}
      >
        <motion.div className="mobile-nav-items">
          <motion.div variants={itemVariants}>
            <Link href="#home" 
              className={`mobile-nav-item ${activePage === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
            >
              Home
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link href="#about" 
              className={`mobile-nav-item ${activePage === 'about' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
            >
              About
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link href="#gallery" 
              className={`mobile-nav-item ${activePage === 'gallery' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}
            >
              Gallery
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link href="#animations" 
              className={`mobile-nav-item ${activePage === 'animations' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('animations'); }}
            >
              Animations
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link href="#interactive" 
              className={`mobile-nav-item ${activePage === 'interactive' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('interactive'); }}
            >
              Interactive
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </nav>
  );
};

export default NavBar; 