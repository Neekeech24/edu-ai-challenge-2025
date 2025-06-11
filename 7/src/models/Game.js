import { Board } from './Board.js';
import { Player, CpuPlayer } from './Player.js';
import { Renderer } from '../utils/Renderer.js';
import { InputHandler } from '../utils/InputHandler.js';

/**
 * Main Game class that manages the Sea Battle game
 */
export class Game {
  /**
   * Create a new game
   * @param {number} boardSize - Size of the game board
   * @param {number} numShips - Number of ships per player
   * @param {number} shipLength - Length of each ship
   */
  constructor(boardSize = 10, numShips = 3, shipLength = 3) {
    this.boardSize = boardSize;
    this.numShips = numShips;
    this.shipLength = shipLength;
    
    // Create boards
    this.playerBoard = new Board(boardSize, true);
    this.cpuBoard = new Board(boardSize);
    
    // Create players
    this.player = new Player('Player');
    this.cpu = new CpuPlayer(boardSize);
    
    // Create utils
    this.renderer = new Renderer();
    this.inputHandler = new InputHandler();
    
    // Game state
    this.isGameOver = false;
    this.playerWon = false;
  }

  /**
   * Initialize the game
   */
  init() {
    this.playerBoard.placeShipsRandomly(this.numShips, this.shipLength);
    this.cpuBoard.placeShipsRandomly(this.numShips, this.shipLength);
    this.renderer.displayWelcomeMessage(this.numShips);
  }

  /**
   * Start the game loop
   */
  async start() {
    this.init();
    await this.gameLoop();
  }

  /**
   * Main game loop
   */
  async gameLoop() {
    while (!this.isGameOver) {
      this.renderer.renderBoards(this.cpuBoard.getGrid(), this.playerBoard.getGrid());
      
      // Player's turn
      const playerMoveValid = await this.handlePlayerTurn();
      
      // Check if game is over
      if (this.checkGameOver()) {
        break;
      }
      
      // CPU's turn (only if player made a valid move)
      if (playerMoveValid) {
        await this.handleCpuTurn();
      }
      
      // Check if game is over
      if (this.checkGameOver()) {
        break;
      }
    }
    
    // Final board state and game over message
    this.renderer.renderBoards(this.cpuBoard.getGrid(), this.playerBoard.getGrid());
    this.renderer.displayGameOverMessage(this.playerWon);
    this.inputHandler.close();
  }

  /**
   * Handle the player's turn
   * @returns {Promise<boolean>} Whether the player made a valid move
   */
  async handlePlayerTurn() {
    let validMove = false;
    
    while (!validMove) {
      const guess = await this.inputHandler.getPlayerGuess();
      const validation = this.inputHandler.validateInput(guess, this.boardSize);
      
      if (!validation.valid) {
        this.renderer.displayMessage(validation.message);
        continue;
      }
      
      if (this.player.hasGuessed(guess)) {
        this.renderer.displayMessage('You already guessed that location!');
        continue;
      }
      
      this.player.makeGuess(guess);
      const result = this.cpuBoard.receiveShot(guess);
      
      if (!result.valid) {
        this.renderer.displayMessage(result.message);
        continue;
      }
      
      if (result.hit) {
        this.renderer.displayMessage('PLAYER HIT!');
        
        if (result.sunk) {
          this.renderer.displayMessage('You sunk an enemy battleship!');
        }
      } else {
        this.renderer.displayMessage('PLAYER MISS.');
      }
      
      validMove = true;
    }
    
    return true;
  }

  /**
   * Handle the CPU's turn
   */
  async handleCpuTurn() {
    this.renderer.displayTurnHeader('CPU');
    
    let guess = this.cpu.generateGuess();
    let result = this.playerBoard.receiveShot(guess);
    this.cpu.processResult(guess, result);
    
    if (result.hit) {
      this.renderer.displayMessage(`CPU HIT at ${guess}!`);
      
      if (result.sunk) {
        this.renderer.displayMessage('CPU sunk your battleship!');
      }
    } else {
      this.renderer.displayMessage(`CPU MISS at ${guess}.`);
    }
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  /**
   * Check if the game is over
   * @returns {boolean} Whether the game is over
   */
  checkGameOver() {
    const playerRemainingShips = this.playerBoard.getRemainingShips();
    const cpuRemainingShips = this.cpuBoard.getRemainingShips();
    
    if (cpuRemainingShips === 0) {
      this.isGameOver = true;
      this.playerWon = true;
      return true;
    }
    
    if (playerRemainingShips === 0) {
      this.isGameOver = true;
      this.playerWon = false;
      return true;
    }
    
    return false;
  }
} 