import React from 'react';

function Point({ data, onClick }) {
  const { id, x, y, status } = data;

  return (
    <div
      onClick={() => onClick(id)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 40,
        height: 40,
        border: '1px solid red',
        borderRadius: '50%',
        textAlign: 'center',
        lineHeight: '40px',
        cursor: 'pointer',
        backgroundColor: status === 'fading' ? 'orange' : 'white',
        opacity: status === 'fading' ? 0.3 : 1,
        transition: 'opacity 3s linear'
      }}
    >
      {id}
    </div>
  );
}

export default Point;