import { Board } from '../src/models/Board.js';
import { Ship } from '../src/models/Ship.js';

// Mock Ship class for controlled testing
jest.mock('../src/models/Ship.js', () => {
  return {
    Ship: jest.fn().mockImplementation((locations) => {
      return {
        locations,
        hits: Array(locations.length).fill(false),
        hit: jest.fn().mockImplementation((location) => {
          const index = locations.indexOf(location);
          if (index >= 0 && !this.hits[index]) {
            this.hits[index] = true;
            return true;
          }
          return false;
        }),
        isSunk: jest.fn().mockReturnValue(false),
        isLocationHit: jest.fn().mockImplementation((location) => {
          const index = locations.indexOf(location);
          return index >= 0 && this.hits[index];
        })
      };
    })
  };
});

describe('Board', () => {
  let board;
  const size = 10;
  
  beforeEach(() => {
    board = new Board(size);
    Ship.mockClear();
  });
  
  test('should create a board of the correct size', () => {
    expect(board.size).toBe(size);
    expect(board.grid.length).toBe(size);
    
    // Check all cells are water
    for (let i = 0; i < size; i++) {
      expect(board.grid[i].length).toBe(size);
      for (let j = 0; j < size; j++) {
        expect(board.grid[i][j]).toBe('~');
      }
    }
  });
  
  test('should create an empty grid correctly', () => {
    const grid = board.createEmptyGrid();
    expect(grid.length).toBe(size);
    
    for (let i = 0; i < size; i++) {
      expect(grid[i].length).toBe(size);
      for (let j = 0; j < size; j++) {
        expect(grid[i][j]).toBe('~');
      }
    }
  });
  
  test('should place ships correctly', () => {
    const numShips = 3;
    const shipLength = 3;
    
    // Override the Ship constructor mock to test ship placement
    Ship.mockImplementation((locations) => {
      return {
        locations,
        hits: Array(locations.length).fill(false)
      };
    });
    
    const ships = board.placeShipsRandomly(numShips, shipLength);
    
    expect(ships.length).toBe(numShips);
    expect(board.ships.length).toBe(numShips);
    
    // Each ship should have the correct length
    for (const ship of ships) {
      expect(ship.locations.length).toBe(shipLength);
    }
  });
  
  test('should process valid shots correctly', () => {
    // Create a board with a controlled ship
    board.ships = [{ 
      locations: ['00', '01', '02'],
      hits: [false, false, false],
      hit: jest.fn().mockImplementation((location) => {
        const index = ['00', '01', '02'].indexOf(location);
        if (index >= 0) {
          board.ships[0].hits[index] = true;
          return true;
        }
        return false;
      }),
      isSunk: jest.fn().mockImplementation(() => {
        return board.ships[0].hits.every(hit => hit);
      }),
      isLocationHit: jest.fn().mockImplementation((location) => {
        const index = ['00', '01', '02'].indexOf(location);
        return index >= 0 && board.ships[0].hits[index];
      })
    }];
    
    // Test a hit
    const hitResult = board.receiveShot('00');
    expect(hitResult.valid).toBe(true);
    expect(hitResult.hit).toBe(true);
    expect(hitResult.sunk).toBe(false);
    expect(board.grid[0][0]).toBe('X');
    
    // Test a miss
    const missResult = board.receiveShot('99');
    expect(missResult.valid).toBe(true);
    expect(missResult.hit).toBe(false);
    expect(missResult.sunk).toBe(false);
    expect(board.grid[9][9]).toBe('O');
    expect(board.missedShots.has('99')).toBe(true);
    
    // Test sinking a ship
    board.receiveShot('01');
    const sunkResult = board.receiveShot('02');
    expect(sunkResult.valid).toBe(true);
    expect(sunkResult.hit).toBe(true);
    expect(sunkResult.sunk).toBe(true);
  });
  
  test('should reject invalid shots', () => {
    // Out of bounds shot
    const invalidResult = board.receiveShot('XX');
    expect(invalidResult.valid).toBe(false);
    
    // Already hit location
    board.missedShots.add('55');
    const duplicateResult = board.receiveShot('55');
    expect(duplicateResult.valid).toBe(false);
  });
  
  test('should track remaining ships correctly', () => {
    board.ships = [
      { isSunk: jest.fn().mockReturnValue(false) },
      { isSunk: jest.fn().mockReturnValue(true) },
      { isSunk: jest.fn().mockReturnValue(false) }
    ];
    
    expect(board.getRemainingShips()).toBe(2);
  });
}); 