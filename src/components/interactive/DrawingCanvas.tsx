'use client';

import { useRef, useEffect, useState } from 'react';
import './DrawingCanvas.css';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  clearOnEscape?: boolean;
  className?: string;
}

const DrawingCanvas = ({
  width = 800,
  height = 500,
  backgroundColor = '#f9f7f1',
  strokeColor = '#333333',
  strokeWidth = 3,
  clearOnEscape = true,
  className = '',
}: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState(strokeColor);
  const [currentSize, setCurrentSize] = useState(strokeWidth);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  
  // Initialize canvas on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Set initial background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add paper texture effect
    addPaperTexture(ctx, canvas.width, canvas.height);
    
    // Handle escape key to clear canvas
    const handleKeyDown = (e: KeyboardEvent) => {
      if (clearOnEscape && e.key === 'Escape') {
        clearCanvas();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [width, height, backgroundColor, clearOnEscape]);
  
  // Add paper texture effect
  const addPaperTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.globalAlpha = 0.1;
    
    // Add some noise
    for (let i = 0; i < width * height * 0.05; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 1 + 0.5;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.5 ? '#000000' : '#ffffff';
      ctx.fill();
    }
    
    // Add some subtle lines
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const length = Math.random() * 50 + 20;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      );
      ctx.strokeStyle = '#00000015';
      ctx.lineWidth = Math.random() * 0.5 + 0.1;
      ctx.stroke();
    }
    
    ctx.restore();
  };
  
  // Start drawing
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    e.preventDefault();
    
    const { x, y } = getEventCoordinates(e, canvas);
    setLastX(x);
    setLastY(y);
    setIsDrawing(true);
    
    // Start a new path where the mouse is
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentTool === 'eraser' ? backgroundColor : currentColor;
    ctx.lineWidth = currentSize;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  // Continue drawing
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    e.preventDefault();
    
    const { x, y } = getEventCoordinates(e, canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentTool === 'eraser' ? backgroundColor : currentColor;
    ctx.lineWidth = currentSize;
    
    // For a more hand-drawn feel, add slight jitter
    const jitter = currentSize * 0.1;
    const jitterX = Math.random() * jitter - jitter / 2;
    const jitterY = Math.random() * jitter - jitter / 2;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x + jitterX, y + jitterY);
    ctx.stroke();
    
    // Update last position
    setLastX(x);
    setLastY(y);
  };
  
  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  // Get coordinates from mouse or touch event
  const getEventCoordinates = (event: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in event) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
  };
  
  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Re-add paper texture
    addPaperTexture(ctx, canvas.width, canvas.height);
  };
  
  // Switch tools
  const switchTool = (tool: 'pen' | 'eraser') => {
    setCurrentTool(tool);
  };
  
  // Change color
  const changeColor = (color: string) => {
    setCurrentColor(color);
  };
  
  // Change brush size
  const changeBrushSize = (size: number) => {
    setCurrentSize(size);
  };

  return (
    <div className={`drawing-canvas-container ${className}`}>
      <div className="drawing-tools">
        <button 
          className={`tool-btn ${currentTool === 'pen' ? 'active' : ''}`} 
          onClick={() => switchTool('pen')}
          title="Pen"
        >
          <span className="tool-icon">✏️</span>
        </button>
        <button 
          className={`tool-btn ${currentTool === 'eraser' ? 'active' : ''}`} 
          onClick={() => switchTool('eraser')}
          title="Eraser"
        >
          <span className="tool-icon">🧽</span>
        </button>
        <div className="color-picker">
          <button 
            className={`color-btn ${currentColor === '#333333' ? 'active' : ''}`} 
            style={{ backgroundColor: '#333333' }}
            onClick={() => changeColor('#333333')}
            title="Black"
          ></button>
          <button 
            className={`color-btn ${currentColor === '#e74c3c' ? 'active' : ''}`} 
            style={{ backgroundColor: '#e74c3c' }}
            onClick={() => changeColor('#e74c3c')}
            title="Red"
          ></button>
          <button 
            className={`color-btn ${currentColor === '#3498db' ? 'active' : ''}`} 
            style={{ backgroundColor: '#3498db' }}
            onClick={() => changeColor('#3498db')}
            title="Blue"
          ></button>
          <button 
            className={`color-btn ${currentColor === '#2ecc71' ? 'active' : ''}`} 
            style={{ backgroundColor: '#2ecc71' }}
            onClick={() => changeColor('#2ecc71')}
            title="Green"
          ></button>
        </div>
        <div className="size-picker">
          <button 
            className={`size-btn ${currentSize === 2 ? 'active' : ''}`} 
            onClick={() => changeBrushSize(2)}
            title="Small"
          >
            <div className="size-dot" style={{ width: '2px', height: '2px' }}></div>
          </button>
          <button 
            className={`size-btn ${currentSize === 4 ? 'active' : ''}`} 
            onClick={() => changeBrushSize(4)}
            title="Medium"
          >
            <div className="size-dot" style={{ width: '4px', height: '4px' }}></div>
          </button>
          <button 
            className={`size-btn ${currentSize === 8 ? 'active' : ''}`} 
            onClick={() => changeBrushSize(8)}
            title="Large"
          >
            <div className="size-dot" style={{ width: '8px', height: '8px' }}></div>
          </button>
        </div>
        <button 
          className="clear-btn" 
          onClick={clearCanvas}
          title="Clear Canvas"
        >
          Clear
        </button>
      </div>
      
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      ></canvas>
    </div>
  );
};

export default DrawingCanvas; 