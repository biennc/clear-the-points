import React, { useEffect, useRef, useState, forwardRef } from 'react';
import Circle from './Circle';
import FadingCircle from './FadingCircle';
import { getVisibleCircles } from '../utils/gameUtils';
import '../styles/GameBoard.css';

const GameBoard = forwardRef(({ circles, fadingCircles, handleCircleClick }, ref) => {
  const [viewportState, setViewportState] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  });
  const [visibleCircles, setVisibleCircles] = useState([]);
  const scrollContainerRef = useRef(null);

  // Update visible circles based on viewport
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const updateVisibleCircles = () => {
        const { scrollTop, scrollLeft, clientHeight, clientWidth } = container;
        
        setViewportState({
          top: scrollTop,
          left: scrollLeft,
          bottom: scrollTop + clientHeight,
          right: scrollLeft + clientWidth
        });
      };

      // Initial calculation
      updateVisibleCircles();

      // Add scroll event listener
      container.addEventListener('scroll', updateVisibleCircles);
      
      return () => {
        container.removeEventListener('scroll', updateVisibleCircles);
      };
    }
  }, []);

  // Update visible circles when viewport or all circles change
  useEffect(() => {
    const { top, bottom, left, right } = viewportState;
    const visible = getVisibleCircles(circles, top, bottom, left, right);
    setVisibleCircles(visible);
  }, [circles, viewportState]);

  // Determine board dimensions based on the number of circles
  const getBoardDimensions = () => {
    const count = circles.length;
    const baseSize = 600;
    
    // For larger counts, increase the board size
    if (count <= 100) return { width: baseSize, height: baseSize };
    if (count <= 500) return { width: baseSize * 1.5, height: baseSize * 1.5 };
    if (count <= 1000) return { width: baseSize * 2, height: baseSize * 2 };
    if (count <= 2000) return { width: baseSize * 2.5, height: baseSize * 2.5 };
    return { width: baseSize * 3, height: baseSize * 3 }; // For 3000
  };

  const { width, height } = getBoardDimensions();

  return (
    <div 
      className="game-board-container" 
      ref={scrollContainerRef}
      style={{ width: '100%', height: '70vh', overflow: 'auto' }}
    >
      <div 
        className="game-board" 
        ref={ref}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {visibleCircles.map(circle => (
          <Circle 
            key={circle.id} 
            circle={circle} 
            onClick={() => handleCircleClick(circle)}
          />
        ))}
        
        {fadingCircles.map(circle => (
          <FadingCircle key={`fade-${circle.id}-${circle.clickTime}`} circle={circle} />
        ))}
      </div>
    </div>
  );
});

export default GameBoard;