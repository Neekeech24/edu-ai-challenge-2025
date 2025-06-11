import { Ship } from './Ship.js';

/**
 * Represents a game board in Sea Battle
 */
export class Board {
  /**
   * Create a new board
   * @param {number} size - The size of the board (e.g., 10 for a 10x10 board)
   * @param {boolean} isPlayerBoard - Whether this is the player's board
   */
  constructor(size, isPlayerBoard = false) {
    this.size = size;
    this.isPlayerBoard = isPlayerBoard;
    this.ships = [];
    this.grid = this.createEmptyGrid();
    this.missedShots = new Set();
  }

  /**
   * Create an empty grid filled with water ('~')
   * @returns {string[][]} The empty grid
   */
  createEmptyGrid() {
    return Array(this.size).fill().map(() => Array(this.size).fill('~'));
  }

  /**
   * Place ships randomly on the board
   * @param {number} numShips - Number of ships to place
   * @param {number} shipLength - Length of each ship
   */
  placeShipsRandomly(numShips, shipLength) {
    let placedShips = 0;
    
    while (placedShips < numShips) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      let startRow, startCol;
      const shipLocations = [];
      
      if (orientation === 'horizontal') {
        startRow = Math.floor(Math.random() * this.size);
        startCol = Math.floor(Math.random() * (this.size - shipLength + 1));
      } else {
        startRow = Math.floor(Math.random() * (this.size - shipLength + 1));
        startCol = Math.floor(Math.random() * this.size);
      }
      
      let collision = false;
      const tempLocations = [];
      
      for (let i = 0; i < shipLength; i++) {
        let checkRow = startRow;
        let checkCol = startCol;
        
        if (orientation === 'horizontal') {
          checkCol += i;
        } else {
          checkRow += i;
        }
        
        const locationStr = `${checkRow}${checkCol}`;
        tempLocations.push(locationStr);
        
        if (checkRow >= this.size || checkCol >= this.size || this.grid[checkRow][checkCol] !== '~') {
          collision = true;
          break;
        }
      }
      
      if (!collision) {
        const ship = new Ship(tempLocations);
        this.ships.push(ship);
        
        // Mark ship on grid if it's the player's board
        if (this.isPlayerBoard) {
          for (const location of tempLocations) {
            const row = parseInt(location[0]);
            const col = parseInt(location[1]);
            this.grid[row][col] = 'S';
          }
        }
        
        placedShips++;
      }
    }
    
    return this.ships;
  }
  
  /**
   * Process a shot at the given coordinates
   * @param {string} location - Coordinate string (e.g., "01")
   * @returns {object} Result object with hit status and sunk status
   */
  receiveShot(location) {
    const row = parseInt(location[0]);
    const col = parseInt(location[1]);
    
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
      return { valid: false, message: 'Invalid coordinates' };
    }
    
    // Check if location was already shot at
    for (const ship of this.ships) {
      if (ship.isLocationHit(location)) {
        return { valid: false, message: 'Already hit this location' };
      }
    }
    
    if (this.missedShots.has(location)) {
      return { valid: false, message: 'Already guessed this location' };
    }
    
    // Check for hit
    for (const ship of this.ships) {
      if (ship.hit(location)) {
        this.grid[row][col] = 'X';
        
        if (ship.isSunk()) {
          return { 
            valid: true, 
            hit: true, 
            sunk: true, 
            message: 'Ship sunk!'
          };
        }
        
        return { 
          valid: true, 
          hit: true, 
          sunk: false, 
          message: 'Hit!'
        };
      }
    }
    
    // Miss
    this.grid[row][col] = 'O';
    this.missedShots.add(location);
    
    return { 
      valid: true, 
      hit: false, 
      sunk: false, 
      message: 'Miss!'
    };
  }
  
  /**
   * Get the remaining ship count
   * @returns {number} Number of ships not sunk
   */
  getRemainingShips() {
    return this.ships.filter(ship => !ship.isSunk()).length;
  }
  
  /**
   * Get a string representation of the grid
   * @returns {string[][]} The current grid
   */
  getGrid() {
    return this.grid;
  }
} 