// * Generate circles with improved performance for large counts

export const generateCircles = (count, boardWidth, boardHeight) => {
  // Use a spatial partitioning grid for faster collision detection
  const circles = [];
  const radius = count > 100 ? 12 : 20; // Smaller radius for large counts
  const padding = 10;
  const minDistance = 2 * radius + 5; // Reduced spacing between circles
  
  // Create a grid for spatial partitioning
  const cellSize = minDistance;
  const gridWidth = Math.ceil(boardWidth / cellSize);
  const gridHeight = Math.ceil(boardHeight / cellSize);
  const grid = Array(gridWidth * gridHeight).fill().map(() => []);
  
  // Get grid cell for a position
  const getGridCell = (x, y) => {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    return grid[gridY * gridWidth + gridX];
  };
  
  // Check nearby grid cells for collisions
  const checkCollision = (x, y) => {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    
    // Check surrounding cells
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = gridX + dx;
        const ny = gridY + dy;
        
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
          const cell = grid[ny * gridWidth + nx];
          
          for (const circleIndex of cell) {
            const circle = circles[circleIndex];
            const dx = circle.x - x;
            const dy = circle.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
              return true; // Collision detected
            }
          }
        }
      }
    }
    
    return false;
  };
  
  // Generate positions with retries
  const generatePosition = () => {
    const maxAttempts = count > 1000 ? 10 : 30; // Fewer attempts for large counts
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = Math.random() * (boardWidth - 2 * radius - 2 * padding) + radius + padding;
      const y = Math.random() * (boardHeight - 2 * radius - 2 * padding) + radius + padding;
      
      if (!checkCollision(x, y)) {
        return { x, y };
      }
    }
    
    // If we couldn't find a non-overlapping position after max attempts,
    // just place it somewhere in the board with minimal overlap checking
    const x = Math.random() * (boardWidth - 2 * radius - 2 * padding) + radius + padding;
    const y = Math.random() * (boardHeight - 2 * radius - 2 * padding) + radius + padding;
    return { x, y };
  };
  
  // Generate all circles
  for (let i = 1; i <= count; i++) {
    const { x, y } = generatePosition();
    
    circles.push({
      id: i,
      number: i,
      x,
      y,
      clicked: false
    });
    
    // Add to grid
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
      grid[gridY * gridWidth + gridX].push(i - 1);
    }
  }
  
  return circles;
};

/**
 * Splits circles into chunks for virtualized rendering
 */
export const getVisibleCircles = (circles, viewportTop, viewportBottom, viewportLeft, viewportRight, padding = 100) => {
  return circles.filter(circle => 
    circle.x + padding >= viewportLeft && 
    circle.x - padding <= viewportRight &&
    circle.y + padding >= viewportTop && 
    circle.y - padding <= viewportBottom
  );
};