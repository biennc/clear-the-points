import React, { memo } from 'react';
import '../styles/GameBoard.css';

const Circle = memo(({ circle, onClick }) => {
  // Dynamic styling based on number of circles
  const getCircleStyle = () => {
    const isLargeSet = circle.id > 100;
    
    return {
      left: `${circle.x}px`,
      top: `${circle.y}px`,
      width: isLargeSet ? '24px' : '40px',
      height: isLargeSet ? '24px' : '40px',
      fontSize: isLargeSet ? '10px' : '16px',
      opacity: circle.clicked ? 0.5 : 1,
      backgroundColor: circle.clicked ? '#88cc88' : '#4488cc'
    };
  };

  return (
    <div
      className="circle"
      style={getCircleStyle()}
      onClick={onClick}
    >
      {circle.number}
    </div>
  );
});

export default Circle;