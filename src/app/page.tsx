'use client';

import { useEffect } from 'react';
import anime from 'animejs';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import AboutSection from '../components/layout/AboutSection';
import DrawingAnimation from '../components/animations/DrawingAnimation';
import AdvancedDrawing from '../components/animations/AdvancedDrawing';
import ScrollDrawing from '../components/animations/ScrollDrawing';
import PaperPhysics from '../components/interactive/PaperPhysics';
import ArtworkGallery from '../components/gallery/ArtworkGallery';
import PortfolioProjects from '../components/gallery/PortfolioProjects';
import InteractivePathDrawing from '../components/animations/InteractivePathDrawing';
import './page.css';

export default function Home() {
  useEffect(() => {
    // Add initial page load animation
    anime({
      targets: 'main',
      opacity: [0.5, 1],
      translateY: [10, 0],
      easing: 'easeOutExpo',
      duration: 1000,
      delay: 100
    });
    
    // Add section animations with smaller transforms
    anime({
      targets: '.section-title',
      opacity: [0.7, 1],
      translateY: [5, 0],
      easing: 'easeOutExpo',
      duration: 1000,
      delay: anime.stagger(100, {start: 300})
    });
  }, []);
  
  return (
    <div className="app-container">
      <NavBar />
      
      <main className="main-content">
        <section className="hero-section" id="home">
          <div className="hero-text">
            <h1 className="section-title main-title">Sketchfolio</h1>
            <p className="hero-description">An immersive interactive experience showcasing creative hand-drawn artwork through animations and interactive effects.</p>
          </div>
        </section>
        
        <AboutSection />
        
        <section id="gallery">
          <ArtworkGallery />
        </section>
        
        <PortfolioProjects />
        
        <section className="animation-section" id="animations">
          <h2 className="section-title">Animation Showcase</h2>
          <p className="section-description">Various animation techniques that demonstrate the art of bringing illustrations to life.</p>
          
          <div className="animation-grid">
            <div className="animation-item">
              <h3 className="animation-title">Basic Path Animation</h3>
              <p className="animation-description">Interactive drawing animations using SVG paths. Try drawing your own!</p>
              <InteractivePathDrawing />
            </div>
            
            <div className="animation-item">
              <h3 className="animation-title">Advanced Drawing Animation</h3>
              <p className="animation-description">Complex multi-stage animations with layered reveals.</p>
              <AdvancedDrawing />
            </div>
            
            <div className="animation-item">
              <h3 className="animation-title">Scroll-Based Animation</h3>
              <p className="animation-description">Artwork that reveals itself as you scroll down the page.</p>
              <ScrollDrawing />
            </div>
          </div>
        </section>
        
        <section className="interactive-section" id="interactive">
          <h2 className="section-title">Interactive Experiences</h2>
          <p className="section-description">These components allow you to interact with the artwork in engaging ways.</p>
          
          <PaperPhysics />
        </section>
        
        <section className="contact-section" id="contact">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Let's Work Together</h3>
              <p>If you're interested in commissioning artwork or have questions about my portfolio, I'd love to hear from you.</p>
              
              <ul className="contact-details">
                <li>
                  <span className="contact-icon">✉️</span>
                  <span>artist@handdrawnportfolio.com</span>
                </li>
                <li>
                  <span className="contact-icon">📱</span>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <span className="contact-icon">📍</span>
                  <span>New York, NY</span>
                </li>
              </ul>
            </div>
            
            <div className="contact-form-wrapper">
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" placeholder="Your name" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="Your email" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} placeholder="Your message"></textarea>
                </div>
                
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
