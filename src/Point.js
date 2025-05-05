import React from 'react';

export default function Point({ id, x, y, onClick }) {
  return (
    <div
      className="point"
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={() => onClick(id)}
    >
      {id}
    </div>
  );
}