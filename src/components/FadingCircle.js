import React, { memo } from 'react';
import '../styles/GameBoard.css';

const FadingCircle = memo(({ circle }) => {
  // Calculate the opacity and color based on the time elapsed since click
  const getFadingStyle = () => {
    const elapsed = (Date.now() - circle.clickTime) / 1000;
    const opacity = Math.max(0, 1 - elapsed / 3); // 3 seconds fade
    
    const baseColor = circle.isWrong ? 'rgba(240, 80, 80,' : 'rgba(240, 140, 0,';
    const isLargeSet = circle.number > 100;
    
    return {
      left: `${circle.x}px`,
      top: `${circle.y}px`,
      width: isLargeSet ? '24px' : '40px',
      height: isLargeSet ? '24px' : '40px',
      fontSize: isLargeSet ? '10px' : '16px',
      backgroundColor: `${baseColor}${opacity})`,
      opacity: opacity
    };
  };

  return (
    <div
      className="fading-circle"
      style={getFadingStyle()}
    >
      {circle.number}
    </div>
  );
});

export default FadingCircle;