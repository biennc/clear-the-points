import React, { useState, useEffect } from 'react';
import Point from './Point';
import './styles.css';

const TOTAL_POINTS = 10;

const generatePoints = () => {
  return Array.from({ length: TOTAL_POINTS }, (_, i) => ({
    id: i + 1,
    x: Math.random() * 300 + 50,
    y: Math.random() * 300 + 50,
  }));
};

export default function Game() {
  const [points, setPoints] = useState(generatePoints());
  const [next, setNext] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [allCleared, setAllCleared] = useState(false);

  useEffect(() => {
    if (points.length === 0) {
      setAllCleared(true);
      setTimeTaken(((Date.now() - startTime) / 1000).toFixed(1));
    }
  }, [points]);

  const handleClick = (id) => {
    if (id === next) {
      setPoints(points.filter((p) => p.id !== id));
      setNext(id + 1);
    }
  };

  const handleRestart = () => {
    setPoints(generatePoints());
    setNext(1);
    setStartTime(Date.now());
    setAllCleared(false);
    setTimeTaken(null);
  };

  useEffect(() => {
    handleRestart(); // Khởi động lần đầu
  }, []);

  return (
    <div className="game-container">
      <h2>LET'S PLAY</h2>
      <p>Points: {TOTAL_POINTS - points.length}</p>
      <p>Time: {timeTaken ? `${timeTaken}s` : `${((Date.now() - startTime) / 1000).toFixed(1)}s`}</p>
      <button onClick={handleRestart}>Restart</button>
      <div className="board">
        {points.map((p) => (
          <Point key={p.id} {...p} onClick={handleClick} />
        ))}
      </div>
      {allCleared && <h3 className="cleared">ALL CLEARED</h3>}
    </div>
  );
}