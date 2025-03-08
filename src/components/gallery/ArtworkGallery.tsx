'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import anime from 'animejs';
import './ArtworkGallery.css';

type ArtworkItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
};

// Sample artwork data - in a real app this would come from an API or CMS
const artworkData: ArtworkItem[] = [
  {
    id: 1,
    title: "Mountain Landscape",
    description: "A hand-drawn illustration of a mountain landscape with watercolor elements.",
    image: "/img/artwork-1.svg", // This is a placeholder path
    category: "Illustration",
    tags: ["landscape", "watercolor", "mountains"]
  },
  {
    id: 2,
    title: "Abstract Portrait",
    description: "An abstract portrait using mixed media techniques including pencil and ink.",
    image: "/img/artwork-2.svg", // This is a placeholder path
    category: "Portrait",
    tags: ["portrait", "abstract", "mixed-media"]
  },
  {
    id: 3,
    title: "Urban Sketch",
    description: "Quick urban sketch of a city street with pen and light watercolor wash.",
    image: "/img/artwork-3.svg", // This is a placeholder path
    category: "Sketch",
    tags: ["urban", "sketch", "pen"]
  },
  {
    id: 4,
    title: "Nature Study",
    description: "Detailed nature study of leaves and plants using colored pencils.",
    image: "/img/artwork-4.svg", // This is a placeholder path
    category: "Study",
    tags: ["nature", "detailed", "colored-pencil"]
  },
  {
    id: 5,
    title: "Character Design",
    description: "Character design concept for a fantasy story with ink and digital coloring.",
    image: "/img/artwork-5.svg", // This is a placeholder path
    category: "Character",
    tags: ["character", "design", "fantasy"]
  },
  {
    id: 6,
    title: "Botanical Illustration",
    description: "Scientific botanical illustration of rare flowers with watercolor and ink.",
    image: "/img/artwork-6.svg", // This is a placeholder path
    category: "Illustration",
    tags: ["botanical", "scientific", "watercolor"]
  }
];

const ArtworkGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredArtworks, setFilteredArtworks] = useState<ArtworkItem[]>(artworkData);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // Filter artworks when category changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredArtworks(artworkData);
    } else {
      setFilteredArtworks(artworkData.filter(artwork => artwork.category === selectedCategory));
    }
  }, [selectedCategory]);
  
  // Animation when the gallery comes into view
  useEffect(() => {
    if (inView) {
      anime({
        targets: '.artwork-item',
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: anime.stagger(150),
        easing: 'easeOutElastic(1, 0.5)',
        duration: 1200
      });
      
      anime({
        targets: '.category-button',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutExpo',
        duration: 800
      });
    }
  }, [inView]);
  
  // Get unique categories for filter buttons
  const categories = ['All', ...Array.from(new Set(artworkData.map(item => item.category)))];
  
  // Open artwork detail modal
  const openArtworkDetail = (artwork: ArtworkItem) => {
    setSelectedArtwork(artwork);
    
    // Add animation for the modal
    setTimeout(() => {
      anime({
        targets: '.artwork-modal-content',
        translateY: [50, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 800
      });
      
      // Draw SVG borders
      anime({
        targets: '.modal-border path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        delay: 300,
        direction: 'normal',
        loop: false
      });
    }, 100);
  };
  
  // Close artwork detail modal
  const closeArtworkDetail = () => {
    // Animate out
    anime({
      targets: '.artwork-modal-content',
      translateY: [0, 50],
      opacity: [1, 0],
      easing: 'easeInExpo',
      duration: 500,
      complete: () => {
        setSelectedArtwork(null);
      }
    });
  };

  return (
    <div className="artwork-gallery" ref={ref}>
      <h2 className="gallery-title">Art Gallery</h2>
      <p className="gallery-description">Explore a collection of hand-drawn artwork across different styles and techniques.</p>
      
      <div className="category-filters">
        {categories.map((category, index) => (
          <button 
            key={index}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="gallery-grid">
        {filteredArtworks.map((artwork) => (
          <div 
            key={artwork.id} 
            className="artwork-item"
            onClick={() => openArtworkDetail(artwork)}
          >
            <div className="artwork-preview">
              {/* We'll use SVG placeholders for now */}
              <svg width="100%" height="100%" viewBox="0 0 300 200" className="artwork-placeholder">
                <rect width="100%" height="100%" fill="#f5f5f5" />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fill="#333">
                  {artwork.title}
                </text>
                {/* Decorative elements based on category */}
                {artwork.category === 'Landscape' && (
                  <path d="M 50 150 L 120 80 L 180 120 L 250 60" stroke="#333" strokeWidth="2" fill="none" />
                )}
                {artwork.category === 'Portrait' && (
                  <circle cx="150" cy="80" r="40" stroke="#333" strokeWidth="2" fill="none" />
                )}
                {artwork.category === 'Sketch' && (
                  <path d="M 100 100 C 120 80, 180 80, 200 100" stroke="#333" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                )}
                {/* Default decorative element for other categories */}
                {!['Landscape', 'Portrait', 'Sketch'].includes(artwork.category) && (
                  <path d="M 80 80 L 220 120 M 80 120 L 220 80" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
                )}
              </svg>
            </div>
            <div className="artwork-info">
              <h3>{artwork.title}</h3>
              <span className="artwork-category">{artwork.category}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <motion.div 
          className="artwork-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="artwork-modal-overlay" onClick={closeArtworkDetail}></div>
          <div className="artwork-modal-content">
            <button className="modal-close" onClick={closeArtworkDetail}>×</button>
            
            <div className="modal-border">
              <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="none">
                <path d="M 20,20 L 780,20 L 780,580 L 20,580 L 20,20" 
                  stroke="#333" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                />
              </svg>
            </div>
            
            <div className="modal-artwork-display">
              {/* For now we'll use a placeholder */}
              <svg width="100%" height="400" viewBox="0 0 600 400" className="artwork-display-placeholder">
                <rect width="100%" height="100%" fill="#f9f7f1" />
                <text x="50%" y="30%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fill="#333" fontFamily="Comic Sans MS, cursive">
                  {selectedArtwork.title}
                </text>
                
                {/* More elaborate placeholder artwork based on category */}
                {selectedArtwork.category === 'Illustration' && (
                  <>
                    <path d="M 100 250 L 200 150 L 300 200 L 400 100 L 500 250" stroke="#333" strokeWidth="3" fill="none" />
                    <circle cx="450" cy="100" r="30" stroke="#333" strokeWidth="2" fill="#f9ca24" fillOpacity="0.5" />
                  </>
                )}
                {selectedArtwork.category === 'Portrait' && (
                  <>
                    <circle cx="300" cy="150" r="80" stroke="#333" strokeWidth="2" fill="none" />
                    <path d="M 270 130 C 280 120, 320 120, 330 130" stroke="#333" strokeWidth="2" fill="none" />
                    <circle cx="280" cy="100" r="5" fill="#333" />
                    <circle cx="320" cy="100" r="5" fill="#333" />
                  </>
                )}
                {selectedArtwork.category === 'Sketch' && (
                  <>
                    <path d="M 150 150 L 150 300 M 200 150 L 200 300 M 250 150 L 250 300" stroke="#333" strokeWidth="1" fill="none" strokeDasharray="5,5" />
                    <path d="M 150 200 L 450 200 M 150 250 L 450 250" stroke="#333" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                    <path d="M 300 150 L 450 150 L 450 300 L 300 300 Z" stroke="#333" strokeWidth="2" fill="none" />
                  </>
                )}
                {selectedArtwork.category === 'Study' && (
                  <>
                    <path d="M 250 100 C 300 50, 350 50, 400 100 S 450 150, 500 100" stroke="#333" strokeWidth="2" fill="none" />
                    <path d="M 150 150 C 200 200, 250 200, 300 150 S 350 100, 400 150" stroke="#333" strokeWidth="2" fill="none" />
                    <path d="M 100 250 C 150 200, 200 200, 250 250 S 300 300, 350 250" stroke="#333" strokeWidth="2" fill="none" />
                  </>
                )}
                {selectedArtwork.category === 'Character' && (
                  <>
                    <circle cx="300" cy="120" r="50" stroke="#333" strokeWidth="2" fill="none" />
                    <path d="M 300 170 L 300 280" stroke="#333" strokeWidth="2" fill="none" />
                    <path d="M 300 200 L 250 250 M 300 200 L 350 250" stroke="#333" strokeWidth="2" fill="none" />
                    <path d="M 270 280 L 300 280 L 330 280" stroke="#333" strokeWidth="2" fill="none" />
                  </>
                )}
              </svg>
            </div>
            
            <div className="modal-artwork-info">
              <h2>{selectedArtwork.title}</h2>
              <span className="modal-category">{selectedArtwork.category}</span>
              <p className="modal-description">{selectedArtwork.description}</p>
              
              <div className="modal-tags">
                {selectedArtwork.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ArtworkGallery; 