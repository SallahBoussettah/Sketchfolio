'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import anime from 'animejs';
import './PortfolioProjects.css';

// Sample project data - in a real app this would come from an API or CMS
const projectsData = [
  {
    id: 1,
    title: "Children's Book Illustrations",
    description: "A series of hand-drawn illustrations for a children's book about adventures in an enchanted forest. Created with ink and watercolor techniques.",
    details: "This project involved creating 15 full-page illustrations and 25 spot illustrations for a 32-page children's book. The illustrations were created using traditional ink drawing techniques with watercolor washes. The goal was to create whimsical, engaging artwork that would appeal to children ages 4-8 while conveying the story's themes of friendship and discovery.",
    client: "Sunshine Publishing",
    duration: "3 months",
    techniques: ["Pen and Ink", "Watercolor", "Digital Cleanup"],
    image: "/img/project-1.svg", // Placeholder
  },
  {
    id: 2,
    title: "Editorial Magazine Illustrations",
    description: "A collection of conceptual illustrations for a magazine feature on sustainable living. Hand-drawn with colored pencil and digital enhancement.",
    details: "This series consisted of 5 editorial illustrations for a magazine feature on sustainable living practices. The illustrations needed to convey complex concepts in an approachable, visually engaging way. The artwork was created using colored pencil techniques and then enhanced digitally to achieve the final look. The editorial team required flexibility for last-minute changes, so the layered approach proved invaluable during revisions.",
    client: "Green Life Magazine",
    duration: "1 month",
    techniques: ["Colored Pencil", "Digital Enhancement", "Concept Sketching"],
    image: "/img/project-2.svg", // Placeholder
  },
  {
    id: 3,
    title: "Character Design Collection",
    description: "A set of character designs for an animated short film. Hand-drawn concepts that were later adapted for animation.",
    details: "This character design project involved creating main and supporting characters for an animated short film. The process began with extensive concept sketching to establish the look and feel of each character. Final designs were hand-drawn with ink and marker, then scanned and prepared for the animation team. The project required close collaboration with directors and animators to ensure the designs met both aesthetic and technical requirements.",
    client: "Animation Studio XYZ",
    duration: "2 months",
    techniques: ["Pencil Sketching", "Ink Drawing", "Digital Preparation"],
    image: "/img/project-3.svg", // Placeholder
  }
];

const PortfolioProjects = () => {
  const [selectedProject, setSelectedProject] = useState<null | number>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const projectRefs = useRef<Array<HTMLDivElement | null>>([]);
  
  // Animation for projects when they come into view
  useEffect(() => {
    if (inView) {
      anime({
        targets: '.project-card',
        translateY: [50, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1500,
        delay: anime.stagger(200)
      });
    }
  }, [inView]);
  
  // Animation for project details
  const animateProjectDetails = (index: number) => {
    if (projectRefs.current[index]) {
      // Find elements to animate within this project card
      const elements = projectRefs.current[index]?.querySelectorAll('.project-details-content > *');
      
      if (elements) {
        anime({
          targets: Array.from(elements),
          translateY: [20, 0],
          opacity: [0, 1],
          easing: 'easeOutExpo',
          duration: 800,
          delay: anime.stagger(100)
        });
      }
      
      // Animate the project SVG
      anime({
        targets: `.project-${index} .project-svg-element`,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        delay: anime.stagger(150),
        direction: 'normal',
        loop: false
      });
    }
  };
  
  const toggleProjectDetails = (index: number) => {
    if (selectedProject === index) {
      setSelectedProject(null);
    } else {
      setSelectedProject(index);
      // Wait a bit for the animation to start before animating contents
      setTimeout(() => animateProjectDetails(index), 500);
    }
  };

  return (
    <section className="portfolio-projects" ref={ref}>
      <h2 className="projects-title">Featured Projects</h2>
      <p className="projects-description">Here are some of my most significant projects. Click on each to see more details.</p>
      
      <div className="projects-container">
        {projectsData.map((project, index) => (
          <div key={project.id} className="project-wrapper">
            <div 
              className={`project-card ${selectedProject === index ? 'active' : ''}`} 
              onClick={() => toggleProjectDetails(index)}
            >
              <div className="project-preview">
                {/* SVG placeholder for project image */}
                <svg width="100%" height="200" viewBox="0 0 400 200" className="project-preview-svg">
                  <rect width="100%" height="100%" fill="#f5f5f5" />
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fill="#333" fontFamily="Comic Sans MS, cursive">
                    {project.title}
                  </text>
                  
                  {/* Different decorative elements for each project */}
                  {index === 0 && (
                    <>
                      <circle cx="200" cy="80" r="40" stroke="#333" strokeWidth="1" fill="none" strokeDasharray="5,5" />
                      <path d="M 150 130 C 175 170, 225 170, 250 130" stroke="#333" strokeWidth="1" fill="none" />
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <path d="M 100 100 L 300 100 M 100 120 L 300 120 M 100 140 L 300 140" stroke="#333" strokeWidth="1" fill="none" strokeDasharray="8,4" />
                      <rect x="150" y="60" width="100" height="100" stroke="#333" strokeWidth="1" fill="none" />
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <path d="M 150 50 L 250 50 L 250 150 L 150 150 Z" stroke="#333" strokeWidth="1" fill="none" />
                      <circle cx="200" cy="85" r="15" stroke="#333" strokeWidth="1" fill="none" />
                      <path d="M 180 110 Q 200 130, 220 110" stroke="#333" strokeWidth="1" fill="none" />
                    </>
                  )}
                </svg>
              </div>
              
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span className="view-details">
                  {selectedProject === index ? 'Close Details' : 'View Details'}
                </span>
              </div>
            </div>
            
            {/* Project Details */}
            <motion.div 
              className={`project-details project-${index}`}
              ref={(el) => { projectRefs.current[index] = el; }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: selectedProject === index ? 'auto' : 0,
                opacity: selectedProject === index ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="project-details-content">
                <div className="project-details-header">
                  <h3>{project.title}</h3>
                  <span className="project-client">Client: {project.client}</span>
                  <span className="project-duration">Duration: {project.duration}</span>
                </div>
                
                <div className="project-columns">
                  <div className="project-text">
                    <h4>Project Overview</h4>
                    <p>{project.details}</p>
                    
                    <h4>Techniques Used</h4>
                    <ul className="techniques-list">
                      {project.techniques.map((technique, i) => (
                        <li key={i}>{technique}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="project-visual">
                    {/* SVG Illustration for the project */}
                    <svg width="100%" height="300" viewBox="0 0 400 300" className="project-svg">
                      <rect width="100%" height="100%" fill="#f9f7f1" />
                      
                      {/* Different SVG content based on project type */}
                      {index === 0 && (
                        // Children's book illustration placeholder
                        <>
                          <path 
                            className="project-svg-element" 
                            d="M 50 200 Q 125 100, 200 200 T 350 200" 
                            stroke="#333" 
                            strokeWidth="2" 
                            fill="none"
                          />
                          <circle 
                            className="project-svg-element" 
                            cx="200" 
                            cy="120" 
                            r="50" 
                            stroke="#333" 
                            strokeWidth="2" 
                            fill="none"
                          />
                          <path 
                            className="project-svg-element" 
                            d="M 180 120 Q 200 140, 220 120" 
                            stroke="#333" 
                            strokeWidth="2" 
                            fill="none"
                          />
                          <circle 
                            className="project-svg-element" 
                            cx="185" 
                            cy="105" 
                            r="5" 
                            stroke="#333" 
                            strokeWidth="1" 
                            fill="#333"
                          />
                          <circle 
                            className="project-svg-element" 
                            cx="215" 
                            cy="105" 
                            r="5" 
                            stroke="#333" 
                            strokeWidth="1" 
                            fill="#333"
                          />
                        </>
                      )}
                      
                      {index === 1 && (
                        // Editorial illustration placeholder
                        <>
                          <rect 
                            className="project-svg-element" 
                            x="100" 
                            y="50" 
                            width="200" 
                            height="200" 
                            stroke="#333" 
                            strokeWidth="2" 
                            fill="none"
                          />
                          <circle 
                            className="project-svg-element" 
                            cx="200" 
                            cy="150" 
                            r="60" 
                            stroke="#333" 
                            strokeWidth="2" 
                            fill="none"
                          />
                          <line 
                            className="project-svg-element" 
                            x1="150" 
                            y1="100" 
                            x2="250" 
                            y2="200" 
                            stroke="#333" 
                            strokeWidth="2"
                          />
                          <line 
                            className="project-svg-element" 
                            x1="250" 
                            y1="100" 
                            x2="150" 
                            y2="200" 
                            stroke="#333" 
                            strokeWidth="2"
                          />
                        </>
                      )}
                      
                      {index === 2 && (
                        // Character design placeholder
                        <>
                          <circle 
                            className="project-svg-element" 
                            cx="200" 
                            cy="100" 
                            r="40" 
                            stroke="#333" 
                            strokeWidth="2" 
                            fill="none"
                          />
                          <line 
                            className="project-svg-element" 
                            x1="200" 
                            y1="140" 
                            x2="200" 
                            y2="220" 
                            stroke="#333" 
                            strokeWidth="2"
                          />
                          <line 
                            className="project-svg-element" 
                            x1="200" 
                            y1="160" 
                            x2="150" 
                            y2="190" 
                            stroke="#333" 
                            strokeWidth="2"
                          />
                          <line 
                            className="project-svg-element" 
                            x1="200" 
                            y1="160" 
                            x2="250" 
                            y2="190" 
                            stroke="#333" 
                            strokeWidth="2"
                          />
                          <line 
                            className="project-svg-element" 
                            x1="200" 
                            y1="220" 
                            x2="170" 
                            y2="270" 
                            stroke="#333" 
                            strokeWidth="2"
                          />
                          <line 
                            className="project-svg-element" 
                            x1="200" 
                            y1="220" 
                            x2="230" 
                            y2="270" 
                            stroke="#333" 
                            strokeWidth="2"
                          />
                          <circle 
                            className="project-svg-element" 
                            cx="185" 
                            cy="90" 
                            r="5" 
                            stroke="#333" 
                            strokeWidth="1" 
                            fill="#333"
                          />
                          <circle 
                            className="project-svg-element" 
                            cx="215" 
                            cy="90" 
                            r="5" 
                            stroke="#333" 
                            strokeWidth="1" 
                            fill="#333"
                          />
                          <path 
                            className="project-svg-element" 
                            d="M 180 110 Q 200 130, 220 110" 
                            stroke="#333" 
                            strokeWidth="2" 
                            fill="none"
                          />
                        </>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioProjects; 