import { Game } from '../src/models/Game.js';
import { Board } from '../src/models/Board.js';
import { Player, CpuPlayer } from '../src/models/Player.js';
import { Renderer } from '../src/utils/Renderer.js';
import { InputHandler } from '../src/utils/InputHandler.js';

// Mock dependencies
jest.mock('../src/models/Board.js');
jest.mock('../src/models/Player.js');
jest.mock('../src/utils/Renderer.js');
jest.mock('../src/utils/InputHandler.js');

describe('Game', () => {
  let game;
  const boardSize = 10;
  const numShips = 3;
  const shipLength = 3;
  
  // Mock implementations
  beforeEach(() => {
    // Reset mocks
    Board.mockClear();
    Player.mockClear();
    CpuPlayer.mockClear();
    Renderer.mockClear();
    InputHandler.mockClear();
    
    // Set up Board mock
    Board.mockImplementation((size, isPlayerBoard) => {
      return {
        size,
        isPlayerBoard,
        placeShipsRandomly: jest.fn().mockReturnValue([]),
        receiveShot: jest.fn(),
        getRemainingShips: jest.fn(),
        getGrid: jest.fn().mockReturnValue([])
      };
    });
    
    // Set up Player mock
    Player.mockImplementation((name) => {
      return {
        name,
        makeGuess: jest.fn(),
        hasGuessed: jest.fn()
      };
    });
    
    // Set up CpuPlayer mock
    CpuPlayer.mockImplementation((size) => {
      return {
        name: 'CPU',
        makeGuess: jest.fn(),
        hasGuessed: jest.fn(),
        generateGuess: jest.fn(),
        processResult: jest.fn()
      };
    });
    
    // Set up Renderer mock
    Renderer.mockImplementation(() => {
      return {
        renderBoards: jest.fn(),
        displayMessage: jest.fn(),
        displayWelcomeMessage: jest.fn(),
        displayGameOverMessage: jest.fn(),
        displayTurnHeader: jest.fn()
      };
    });
    
    // Set up InputHandler mock
    InputHandler.mockImplementation(() => {
      return {
        getPlayerGuess: jest.fn(),
        close: jest.fn(),
        validateInput: jest.fn()
      };
    });
    
    game = new Game(boardSize, numShips, shipLength);
  });
  
  test('should initialize with correct properties', () => {
    expect(game.boardSize).toBe(boardSize);
    expect(game.numShips).toBe(numShips);
    expect(game.shipLength).toBe(shipLength);
    expect(game.isGameOver).toBe(false);
    expect(game.playerWon).toBe(false);
    
    // Check objects were created with correct params
    expect(Board).toHaveBeenCalledTimes(2);
    expect(Board).toHaveBeenNthCalledWith(1, boardSize, true); // Player board
    expect(Board).toHaveBeenNthCalledWith(2, boardSize); // CPU board
    
    expect(Player).toHaveBeenCalledTimes(1);
    expect(Player).toHaveBeenCalledWith('Player');
    
    expect(CpuPlayer).toHaveBeenCalledTimes(1);
    expect(CpuPlayer).toHaveBeenCalledWith(boardSize);
    
    expect(Renderer).toHaveBeenCalledTimes(1);
    expect(InputHandler).toHaveBeenCalledTimes(1);
  });
  
  test('should initialize the game properly', () => {
    game.init();
    
    expect(game.playerBoard.placeShipsRandomly).toHaveBeenCalledWith(numShips, shipLength);
    expect(game.cpuBoard.placeShipsRandomly).toHaveBeenCalledWith(numShips, shipLength);
    expect(game.renderer.displayWelcomeMessage).toHaveBeenCalledWith(numShips);
  });
  
  test('should check game over conditions correctly', () => {
    // No ships sunk - game continues
    game.playerBoard.getRemainingShips.mockReturnValue(3);
    game.cpuBoard.getRemainingShips.mockReturnValue(3);
    expect(game.checkGameOver()).toBe(false);
    expect(game.isGameOver).toBe(false);
    
    // CPU ships all sunk - player wins
    game.playerBoard.getRemainingShips.mockReturnValue(1);
    game.cpuBoard.getRemainingShips.mockReturnValue(0);
    expect(game.checkGameOver()).toBe(true);
    expect(game.isGameOver).toBe(true);
    expect(game.playerWon).toBe(true);
    
    // Reset for next test
    game.isGameOver = false;
    
    // Player ships all sunk - CPU wins
    game.playerBoard.getRemainingShips.mockReturnValue(0);
    game.cpuBoard.getRemainingShips.mockReturnValue(2);
    expect(game.checkGameOver()).toBe(true);
    expect(game.isGameOver).toBe(true);
    expect(game.playerWon).toBe(false);
  });
  
  test('should handle CPU turn correctly', async () => {
    const cpuGuess = '55';
    const shotResult = { valid: true, hit: true, sunk: true };
    
    game.cpu.generateGuess.mockReturnValue(cpuGuess);
    game.playerBoard.receiveShot.mockReturnValue(shotResult);
    
    await game.handleCpuTurn();
    
    expect(game.renderer.displayTurnHeader).toHaveBeenCalledWith('CPU');
    expect(game.cpu.generateGuess).toHaveBeenCalled();
    expect(game.playerBoard.receiveShot).toHaveBeenCalledWith(cpuGuess);
    expect(game.cpu.processResult).toHaveBeenCalledWith(cpuGuess, shotResult);
    expect(game.renderer.displayMessage).toHaveBeenCalledWith(expect.stringContaining('CPU HIT'));
    expect(game.renderer.displayMessage).toHaveBeenCalledWith(expect.stringContaining('sunk'));
  });
}); 