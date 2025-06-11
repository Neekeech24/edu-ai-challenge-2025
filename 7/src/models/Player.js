/**
 * Base Player class for Sea Battle game
 */
export class Player {
  /**
   * Create a new player
   * @param {string} name - Player name
   */
  constructor(name) {
    this.name = name;
    this.guesses = new Set();
  }

  /**
   * Make a guess at a coordinate
   * @param {string} location - The coordinate to guess
   * @returns {boolean} Whether the guess is valid (not previously guessed)
   */
  makeGuess(location) {
    if (this.guesses.has(location)) {
      return false;
    }
    this.guesses.add(location);
    return true;
  }

  /**
   * Check if a location has been guessed
   * @param {string} location - The coordinate to check
   * @returns {boolean} Whether the location has been guessed
   */
  hasGuessed(location) {
    return this.guesses.has(location);
  }
}

/**
 * CPU player with AI strategy
 */
export class CpuPlayer extends Player {
  /**
   * Create a new CPU player
   * @param {number} boardSize - Size of the game board
   */
  constructor(boardSize) {
    super('CPU');
    this.boardSize = boardSize;
    this.mode = 'hunt';
    this.targetQueue = [];
    this.lastHit = null;
  }

  /**
   * Generate a guess based on the current strategy
   * @returns {string} The coordinate to guess
   */
  generateGuess() {
    if (this.mode === 'target' && this.targetQueue.length > 0) {
      return this.targetQueue.shift();
    }

    // Switch to hunt mode if no targets
    this.mode = 'hunt';
    return this.generateRandomGuess();
  }

  /**
   * Generate a random guess
   * @returns {string} A random unguessed coordinate
   */
  generateRandomGuess() {
    let row, col, guess;
    
    do {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * this.boardSize);
      guess = `${row}${col}`;
    } while (this.hasGuessed(guess));
    
    return guess;
  }

  /**
   * Process the result of a shot
   * @param {string} location - The coordinate that was shot
   * @param {object} result - The result of the shot
   */
  processResult(location, result) {
    this.makeGuess(location);
    
    if (result.hit) {
      this.lastHit = location;
      this.mode = 'target';
      
      if (!result.sunk) {
        this.addAdjacentTargets(location);
      } else {
        // If ship was sunk, clear target queue if empty
        if (this.targetQueue.length === 0) {
          this.mode = 'hunt';
        }
      }
    } else if (this.mode === 'target' && this.targetQueue.length === 0) {
      this.mode = 'hunt';
    }
  }

  /**
   * Add adjacent coordinates to the target queue
   * @param {string} location - The hit location
   */
  addAdjacentTargets(location) {
    const row = parseInt(location[0]);
    const col = parseInt(location[1]);
    
    const adjacent = [
      { r: row - 1, c: col },
      { r: row + 1, c: col },
      { r: row, c: col - 1 },
      { r: row, c: col + 1 }
    ];
    
    for (const pos of adjacent) {
      if (this.isValidPosition(pos.r, pos.c)) {
        const targetLocation = `${pos.r}${pos.c}`;
        
        if (!this.hasGuessed(targetLocation) && !this.targetQueue.includes(targetLocation)) {
          this.targetQueue.push(targetLocation);
        }
      }
    }
  }

  /**
   * Check if a position is valid on the board and not previously guessed
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {boolean} Whether the position is valid
   */
  isValidPosition(row, col) {
    return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
  }
} 