import React from 'react';
import '../styles/GameBoard.css';

const GameControls = ({
  points,
  handleInputChange,
  gameState,
  autoPlay,
  toggleAutoPlay,
  initGame,
  elapsedTime,
  formatTime
}) => {
  return (
    <div className="game-controls">
      <div className="control-row">
        <div className="points-input">
          <label htmlFor="pointsInput">Points:</label>
          <input
            id="pointsInput"
            type="number"
            value={points}
            onChange={handleInputChange}
            disabled={gameState === 'playing'}
            min="1"
            max="2000"
          />
        </div>
        
        <div className="timer">
          <span>Time:</span>
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </div>
      
      <div className="buttons">
        {gameState !== 'idle' && (
          <button 
            onClick={initGame}
            className="restart-button"
          >
            Restart
          </button>
        )}
        
        {gameState === 'idle' && (
          <button 
            onClick={initGame}
            className="play-button"
          >
            Play
          </button>
        )}
        
        {/* Auto Play button only visible when actively playing */}
        {gameState === 'playing' && (
          <button 
            onClick={toggleAutoPlay}
            className={`auto-play-button ${autoPlay ? 'active' : ''}`}
          >
            Auto Play {autoPlay ? 'ON' : 'OFF'}
          </button>
        )}
      </div>
    </div>
  );
};

export default GameControls;