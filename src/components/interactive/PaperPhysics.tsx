'use client';

import { useEffect, useRef, useState } from 'react';
import { Engine, Render, Runner, Bodies, Composite, Body, Events, Mouse, MouseConstraint, World, IEventCollision } from 'matter-js';
import './PaperPhysics.css';

interface PaperPhysicsRender extends Render {
  options: {
    width: number;
    height: number;
    wireframes: boolean;
    background: string;
    pixelRatio: number;
  };
}

interface DragEvent extends MouseConstraint {
  body: any;
}

interface MouseConstraintEvent {
  body: any;
  position: { x: number; y: number };
}

const PaperPhysics = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);
  const [isActive, setIsActive] = useState(true);
  
  // Handle toggle physics
  const togglePhysics = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (!sceneRef.current) return;

    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 0.5 }
    });
    
    engineRef.current = engine;
    
    // Get container dimensions for responsive rendering
    const containerWidth = sceneRef.current.clientWidth;
    const containerHeight = Math.min(400, window.innerHeight * 0.5);
    
    // Create renderer with typed options
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        wireframes: false,
        background: '#f9f7f1',
        pixelRatio: Math.min(2, window.devicePixelRatio || 1) // Limit pixel ratio for performance
      }
    }) as PaperPhysicsRender;

    // Create paper pieces (rectangles with rounded corners)
    const paperCount = 12;
    const papers = [];
    
    for (let i = 0; i < paperCount; i++) {
      // Random sizes for the paper
      const width = Math.random() * 80 + 40;
      const height = Math.random() * 60 + 40;
      
      // Random rotation
      const angle = Math.random() * Math.PI * 2;
      
      // Random position - ensure width and height are defined
      const x = Math.random() * (render.options.width - width) + width/2;
      const y = Math.random() * (render.options.height - height) + height/2;
      
      // Create the paper body
      const paper = Bodies.rectangle(x, y, width, height, {
        chamfer: { radius: 5 },
        angle: angle,
        friction: 0.8,
        frictionAir: 0.15,
        restitution: 0.3,
        render: {
          fillStyle: getRandomPaperColor(),
          strokeStyle: '#999',
          lineWidth: 1
        }
      });
      
      // Add some hand-drawn decoration to the paper (using the label for identification)
      paper.label = `paper-${i}`;
      
      papers.push(paper);
    }

    // Add papers to the world
    Composite.add(engine.world, papers);
    
    // Add boundaries to keep the papers contained
    const wallThickness = 50;
    const width = render.options.width;
    const height = render.options.height;
    
    const walls = [
      // Bottom wall
      Bodies.rectangle(width/2, height + wallThickness/2, width + wallThickness*2, wallThickness, { 
        isStatic: true,
        render: { 
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
          lineWidth: 0
        }
      }),
      // Left wall
      Bodies.rectangle(-wallThickness/2, height/2, wallThickness, height + wallThickness*2, { 
        isStatic: true,
        render: { 
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
          lineWidth: 0
        }
      }),
      // Right wall
      Bodies.rectangle(width + wallThickness/2, height/2, wallThickness, height + wallThickness*2, { 
        isStatic: true,
        render: { 
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
          lineWidth: 0
        }
      }),
      // Top wall
      Bodies.rectangle(width/2, -wallThickness/2, width + wallThickness*2, wallThickness, { 
        isStatic: true,
        render: { 
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
          lineWidth: 0
        }
      })
    ];
    
    Composite.add(engine.world, walls);
    
    // Add mouse constraint for interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    
    Composite.add(engine.world, mouseConstraint);
    
    // Keep the mouse in sync with rendering
    render.mouse = mouse;
    
    // Add a "throw" effect on mouse release
    Events.on(mouseConstraint, 'enddrag', function(event) {
      // Type assertion for the event to include body property
      const dragEvent = event as unknown as { body: any };
      
      if (dragEvent.body) {
        // Apply random force
        Body.applyForce(dragEvent.body, dragEvent.body.position, {
          x: (Math.random() * 2 - 1) * 0.05,
          y: (Math.random() * 2 - 1) * 0.05
        });
        
        // Apply random spin
        Body.setAngularVelocity(dragEvent.body, (Math.random() * 2 - 1) * 0.05);
      }
    });
    
    // Start the engine and runner
    Runner.run(Runner.create(), engine);
    Render.run(render);
    
    // Handle window resize
    const handleResize = () => {
      if (!sceneRef.current || !render) return;
      
      const containerWidth = sceneRef.current.clientWidth;
      const containerHeight = Math.min(
        400,
        window.innerWidth <= 480 ? 200 : 
        window.innerWidth <= 576 ? 240 :
        window.innerWidth <= 768 ? 280 :
        window.innerWidth <= 992 ? 340 : 380
      );
      
      // Resize world bounds
      World.clear(engine.world, false);
      const newBounds = {
        min: { x: 0, y: 0 },
        max: { x: containerWidth, y: containerHeight }
      };
      
      // Update render bounds
      render.bounds = newBounds;
      render.options.width = containerWidth;
      render.options.height = containerHeight;
      render.canvas.width = containerWidth;
      render.canvas.height = containerHeight;
      
      // Update renderer
      Render.setPixelRatio(render, Math.min(2, window.devicePixelRatio || 1));
      
      if (isActive) {
        Render.run(render);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      // Stop the engine and rendering
      Render.stop(render);
      World.clear(engine.world, true);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, [isActive]);
  
  // Toggle physics active/inactive
  useEffect(() => {
    if (!engineRef.current) return;
    
    const engine = engineRef.current;
    
    if (isActive) {
      // Normal gravity
      engine.world.gravity.y = 0.5;
      
      // Restore air friction
      Composite.allBodies(engine.world).forEach((body: any) => {
        if (body.label && body.label.includes('paper')) {
          Body.set(body, {
            frictionAir: 0.15
          });
        }
      });
    } else {
      // Zero gravity
      engine.world.gravity.y = 0;
      
      // Increase air friction to "freeze" in place
      Composite.allBodies(engine.world).forEach((body: any) => {
        if (body.label && body.label.includes('paper')) {
          Body.set(body, {
            frictionAir: 0.9,
            velocity: { x: 0, y: 0 },
            angularVelocity: 0
          });
        }
      });
    }
  }, [isActive]);

  return (
    <div className="paper-physics-container">
      <h3 className="physics-title" style={{ opacity: 1, transform: 'none' }}>Interactive Paper Physics</h3>
      <p className="physics-description" style={{ opacity: 1, transform: 'none' }}>
        Drag, throw, and play with these paper scraps. Each piece responds to physics!
      </p>
      <div className="physics-scene" ref={sceneRef} style={{ opacity: 1, visibility: 'visible' }}></div>
      <div className="physics-controls">
        <button className="physics-toggle-btn" onClick={togglePhysics} style={{ opacity: 1, transform: 'none' }}>
          {isActive ? 'Pause Physics' : 'Resume Physics'}
        </button>
      </div>
    </div>
  );
};

// Helper function to get random paper colors
function getRandomPaperColor() {
  const colors = [
    '#f9f7f1', // cream
    '#f8f6e9', // light cream
    '#fffdf7', // white
    '#f0ead6', // light tan
    '#f5f5dc', // beige
    '#fff1e6', // light peach
    '#fdebd0', // light orange
    '#e9f5db', // light green
    '#ddf3ff', // light blue
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default PaperPhysics; 