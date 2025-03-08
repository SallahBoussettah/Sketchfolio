'use client';

import DrawingAnimation from '@/components/animations/DrawingAnimation';
import AdvancedDrawing from '@/components/animations/AdvancedDrawing';
import ScrollDrawing from '@/components/animations/ScrollDrawing';
import InteractiveDrawingAnimation from '@/components/animations/InteractiveDrawingAnimation';
import InteractiveAdvancedDrawing from '@/components/animations/InteractiveAdvancedDrawing';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import './animations.css';

export default function Animations() {
  return (
    <>
      <NavBar />
      <main className="animations-page">
        <h1 className="page-title">Animations</h1>
        <p className="page-subtitle">Hand-drawn animations powered by Anime.js</p>
        
        <section className="animation-section">
          <h2 className="section-title">Drawing Animation</h2>
          <p className="section-description">
            This animation reveals artwork as if it's being hand-drawn, stroke by stroke.
          </p>
          <DrawingAnimation />
        </section>
        
        <section className="animation-section">
          <h2 className="section-title">Advanced Drawing</h2>
          <p className="section-description">
            A more complex scene unfolds with layered animations that simulate a hand-drawn artwork coming to life.
          </p>
          <AdvancedDrawing />
        </section>
        
        <section className="animation-section">
          <h2 className="section-title">Scroll Drawing</h2>
          <p className="section-description">
            Animation that reveals elements as you scroll down the page, creating a dynamic storytelling experience.
          </p>
          <ScrollDrawing />
        </section>

        <section className="animation-section">
          <h2 className="section-title">Interactive Drawing Animation</h2>
          <p className="section-description">
            An interactive animation where you can toggle between viewing the animation and drawing your own version.
          </p>
          <InteractiveDrawingAnimation />
        </section>

        <section className="animation-section">
          <h2 className="section-title">Interactive Advanced Drawing</h2>
          <p className="section-description">
            A more complex interactive animation featuring a landscape scene that you can view or recreate with your own drawing.
          </p>
          <InteractiveAdvancedDrawing />
        </section>
      </main>
      <Footer />
    </>
  );
} 