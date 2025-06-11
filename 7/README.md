# Sea Battle CLI Game

A modern implementation of the classic Sea Battle (Battleship) game, written in JavaScript (ES6+).

## Features

- Clean, modular codebase using ES6+ features
- Object-oriented design with proper encapsulation
- Smart CPU opponent with hunt/target strategy
- Comprehensive unit tests
- Improved code structure and organization
- Async/await for better flow control

## Gameplay

You play against a CPU opponent. Both players place their ships on a 10x10 grid. Players take turns guessing coordinates to hit the opponent's ships. The first player to sink all of the opponent's ships wins.

- `~` represents water (unknown)
- `S` represents your ships on your board
- `X` represents a hit (on either board)
- `O` represents a miss (on either board)

## Project Structure

```
├── src/                  # Source code
│   ├── models/           # Core game models
│   │   ├── Ship.js       # Ship class
│   │   ├── Board.js      # Board class
│   │   ├── Player.js     # Player and CpuPlayer classes
│   │   └── Game.js       # Main game controller
│   ├── utils/            # Utility modules
│   │   ├── Renderer.js   # Display logic
│   │   └── InputHandler.js # User input handling
│   └── index.js          # Entry point
├── tests/                # Unit tests
│   ├── Ship.test.js
│   ├── Board.test.js
│   ├── Player.test.js
│   └── Game.test.js
└── package.json          # Project configuration
```

## How to Run

1. Ensure you have Node.js installed (v14+ recommended). You can download it from https://nodejs.org/.
2. Navigate to the project directory in your terminal.
3. Install dependencies:
   ```
   npm install
   ```
4. Run the game:
   ```
   npm start
   ```
5. Run tests:
   ```
   npm test
   ```

## Game Instructions

1. The game starts with ships randomly placed on both boards.
2. Enter your guesses as two-digit coordinates (e.g., `00` for the top-left corner, `99` for the bottom-right).
3. The CPU opponent will automatically take its turn after you.
4. First player to sink all opponent ships wins!

## Code Design

- **Ship**: Represents a ship with locations and hit tracking
- **Board**: Manages the game grid and ship placement
- **Player/CpuPlayer**: Handles player actions and CPU AI
- **Game**: Coordinates game flow and state
- **Renderer**: Handles display logic
- **InputHandler**: Manages user input

The CPU uses a strategy similar to human players:
- **Hunt mode**: Randomly selects targets until a hit is found
- **Target mode**: Focuses on adjacent cells after a hit to find the rest of the ship 