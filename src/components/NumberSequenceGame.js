import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import { generateCircles } from '../utils/gameUtils';
import '../styles/NumberSequenceGame.css';

const NumberSequenceGame = () => {
  const [points, setPoints] = useState(5);
  const [gameState, setGameState] = useState('idle'); // idle, playing, gameOver, allCleared
  const [circles, setCircles] = useState([]);
  const [nextNumber, setNextNumber] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [fadingCircles, setFadingCircles] = useState([]);
  
  const timerRef = useRef(null);
  const boardRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const circlesRef = useRef([]); // Reference to avoid stale closure issues
  
  // Use refs to avoid recreating functions on re-renders
  useEffect(() => {
    circlesRef.current = circles;
  }, [circles]);
  
  // Initialize the game with debounce for performance
  const initGame = useCallback(() => {
    if (boardRef.current) {
      const boardWidth = boardRef.current.offsetWidth;
      const boardHeight = boardRef.current.offsetHeight;
      
      // Show loading state for large points
      if (points > 500) {
        setGameState('loading');
      }
      
      // Use requestAnimationFrame to prevent UI blocking
      requestAnimationFrame(() => {
        const newCircles = generateCircles(points, boardWidth, boardHeight);
        
        setCircles(newCircles);
        setNextNumber(1);
        setElapsedTime(0);
        setFadingCircles([]);
        setGameState('playing');
        setAutoPlay(false);
        
        // Start timer
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setElapsedTime(prev => prev + 0.1);
        }, 100);
      });
    }
  }, [points]);
  
  // Handle circle click with optimized state updates
  const handleCircleClick = useCallback((circle) => {
    if (gameState !== 'playing' || circle.clicked) return;
    
    if (circle.number === nextNumber) {
      // Correct sequence - update only the clicked circle
      setCircles(prevCircles => 
        prevCircles.map(c => 
          c.id === circle.id ? { ...c, clicked: true } : c
        )
      );
      
      setNextNumber(prev => prev + 1);
      
      // Add to fading circles
      setFadingCircles(prev => [
        ...prev, 
        { ...circle, clickTime: Date.now() }
      ]);
      
      // Check if all circles are clicked
      if (nextNumber + 1 > points) {
        setGameState('allCleared');
        clearInterval(timerRef.current);
      }
    } else {
      // Wrong sequence - Game Over
      setGameState('gameOver');
      clearInterval(timerRef.current);
      
      // Add to fading circles
      setFadingCircles(prev => [
        ...prev, 
        { ...circle, clickTime: Date.now(), isWrong: true }
      ]);
    }
  }, [gameState, nextNumber, points]);
  
  // Auto play functionality with optimization
  useEffect(() => {
    if (gameState === 'playing' && autoPlay) {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      
      autoPlayTimerRef.current = setTimeout(() => {
        const currentCircles = circlesRef.current;
        const nextCircle = currentCircles.find(c => c.number === nextNumber && !c.clicked);
        if (nextCircle) {
          handleCircleClick(nextCircle);
        }
      }, 800); // Delay between auto clicks
    }
    
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [nextNumber, autoPlay, gameState, handleCircleClick]);
  
  // Clean up fading circles after animation with batch updates
  useEffect(() => {
    if (fadingCircles.length > 0) {
      const timer = setTimeout(() => {
        const now = Date.now();
        setFadingCircles(prev => prev.filter(circle => {
          return now - circle.clickTime < 3000; // 3 seconds fade duration
        }));
      }, 500); // Reduce frequency of checks
      
      return () => clearTimeout(timer);
    }
  }, [fadingCircles]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, []);
  
  // Debounced input handler for performance
  const handleInputChange = useCallback((e) => {
    const value = parseInt(e.target.value) || 0;
    setPoints(Math.max(1, Math.min(value, 5000))); // Increased limit to 5000
  }, []);
  
  const toggleAutoPlay = useCallback(() => {
    setAutoPlay(prev => !prev);
  }, []);
  
  const formatTime = useCallback((timeInSeconds) => {
    return timeInSeconds.toFixed(1) + 's';
  }, []);

  return (
    <div className="number-sequence-game">
      <h1 className="game-title">
        {gameState === 'gameOver' ? 'GAME OVER' : 
         gameState === 'loading' ? 'LOADING...' : 'LET\'S PLAY'}
      </h1>
      
      <GameControls 
        points={points}
        handleInputChange={handleInputChange}
        gameState={gameState}
        autoPlay={autoPlay}
        toggleAutoPlay={toggleAutoPlay}
        initGame={initGame}
        elapsedTime={elapsedTime}
        formatTime={formatTime}
      />
      
      <GameBoard 
        ref={boardRef}
        circles={circles}
        fadingCircles={fadingCircles}
        handleCircleClick={handleCircleClick}
      />
      
      <div className="next-number">
        Next: {gameState === 'playing' ? nextNumber : ''}
        {gameState === 'allCleared' && <span className="all-cleared">All Cleared!</span>}
      </div>
    </div>
  );
};

export default NumberSequenceGame;