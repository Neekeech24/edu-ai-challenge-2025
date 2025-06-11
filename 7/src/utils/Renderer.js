/**
 * Handles rendering the game boards and messages to the console
 */
export class Renderer {
  /**
   * Render both game boards side by side
   * @param {Array} opponentGrid - The opponent's grid
   * @param {Array} playerGrid - The player's grid
   */
  renderBoards(opponentGrid, playerGrid) {
    const size = opponentGrid.length;
    
    console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    
    // Print column headers
    let header = '  ';
    for (let h = 0; h < size; h++) {
      header += h + ' ';
    }
    console.log(header + '     ' + header);
    
    // Print both boards side by side
    for (let i = 0; i < size; i++) {
      let rowStr = i + ' ';
      
      // Opponent's board
      for (let j = 0; j < size; j++) {
        rowStr += opponentGrid[i][j] + ' ';
      }
      
      rowStr += '    ' + i + ' ';
      
      // Player's board
      for (let j = 0; j < size; j++) {
        rowStr += playerGrid[i][j] + ' ';
      }
      
      console.log(rowStr);
    }
    
    console.log('\n');
  }
  
  /**
   * Display a message to the player
   * @param {string} message - The message to display
   */
  displayMessage(message) {
    console.log(message);
  }
  
  /**
   * Display the game title and instructions
   * @param {number} numShips - Number of ships in the game
   */
  displayWelcomeMessage(numShips) {
    console.log("\nLet's play Sea Battle!");
    console.log(`Try to sink the ${numShips} enemy ships.`);
    console.log('Enter coordinates as two digits (e.g., 00 for top-left, 99 for bottom-right).');
    console.log('~ = water, S = your ships, X = hit, O = miss\n');
  }
  
  /**
   * Display a game over message
   * @param {boolean} playerWon - Whether the player won
   */
  displayGameOverMessage(playerWon) {
    if (playerWon) {
      console.log('\n*** CONGRATULATIONS! You sunk all enemy battleships! ***');
    } else {
      console.log('\n*** GAME OVER! The CPU sunk all your battleships! ***');
    }
  }
  
  /**
   * Display a turn header
   * @param {string} playerName - The name of the player whose turn it is
   */
  displayTurnHeader(playerName) {
    console.log(`\n--- ${playerName}'s Turn ---`);
  }
} 