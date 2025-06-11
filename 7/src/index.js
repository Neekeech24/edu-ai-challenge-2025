import { Game } from './models/Game.js';

/**
 * Main entry point for the Sea Battle game
 */
async function main() {
  const boardSize = 10;
  const numShips = 3;
  const shipLength = 3;
  
  try {
    const game = new Game(boardSize, numShips, shipLength);
    await game.start();
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

main(); 