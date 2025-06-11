import readline from 'readline';
import { promisify } from 'util';

/**
 * Handles user input for the game
 */
export class InputHandler {
  /**
   * Create a new input handler
   */
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    // Promisify the question method
    this.rl.questionAsync = promisify(this.rl.question).bind(this.rl);
  }

  /**
   * Get player input for their guess
   * @returns {Promise<string>} The player's guess
   */
  async getPlayerGuess() {
    return this.rl.questionAsync('Enter your guess (e.g., 00): ');
  }

  /**
   * Close the readline interface
   */
  close() {
    this.rl.close();
  }

  /**
   * Validate player input
   * @param {string} input - The player's input
   * @param {number} boardSize - The size of the game board
   * @returns {object} Validation result with valid flag and error message
   */
  validateInput(input, boardSize) {
    if (input === null || input.length !== 2) {
      return {
        valid: false,
        message: 'Oops, input must be exactly two digits (e.g., 00, 34, 98).'
      };
    }

    const row = parseInt(input[0]);
    const col = parseInt(input[1]);

    if (
      isNaN(row) ||
      isNaN(col) ||
      row < 0 ||
      row >= boardSize ||
      col < 0 ||
      col >= boardSize
    ) {
      return {
        valid: false,
        message: `Oops, please enter valid row and column numbers between 0 and ${boardSize - 1}.`
      };
    }

    return { valid: true };
  }
} 