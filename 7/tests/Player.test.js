import { Player, CpuPlayer } from '../src/models/Player.js';

describe('Player', () => {
  let player;
  
  beforeEach(() => {
    player = new Player('Test Player');
  });
  
  test('should be created with the correct name', () => {
    expect(player.name).toBe('Test Player');
    expect(player.guesses.size).toBe(0);
  });
  
  test('should track guesses correctly', () => {
    expect(player.makeGuess('00')).toBe(true);
    expect(player.guesses.has('00')).toBe(true);
    expect(player.guesses.size).toBe(1);
    
    // Duplicate guess should return false
    expect(player.makeGuess('00')).toBe(false);
    expect(player.guesses.size).toBe(1);
    
    // New guess should work
    expect(player.makeGuess('01')).toBe(true);
    expect(player.guesses.has('01')).toBe(true);
    expect(player.guesses.size).toBe(2);
  });
  
  test('should correctly check if location has been guessed', () => {
    expect(player.hasGuessed('00')).toBe(false);
    
    player.makeGuess('00');
    expect(player.hasGuessed('00')).toBe(true);
    expect(player.hasGuessed('01')).toBe(false);
  });
});

describe('CpuPlayer', () => {
  let cpu;
  const boardSize = 10;
  
  beforeEach(() => {
    cpu = new CpuPlayer(boardSize);
  });
  
  test('should be created with the correct properties', () => {
    expect(cpu.name).toBe('CPU');
    expect(cpu.boardSize).toBe(boardSize);
    expect(cpu.mode).toBe('hunt');
    expect(cpu.targetQueue).toEqual([]);
    expect(cpu.lastHit).toBeNull();
  });
  
  test('should generate random guesses in hunt mode', () => {
    const guess = cpu.generateGuess();
    expect(typeof guess).toBe('string');
    expect(guess.length).toBe(2);
    
    const row = parseInt(guess[0]);
    const col = parseInt(guess[1]);
    
    expect(row).toBeGreaterThanOrEqual(0);
    expect(row).toBeLessThan(boardSize);
    expect(col).toBeGreaterThanOrEqual(0);
    expect(col).toBeLessThan(boardSize);
  });
  
  test('should not generate duplicate guesses', () => {
    // Pre-fill the guesses set with most positions except one
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (i !== 5 || j !== 5) {
          cpu.guesses.add(`${i}${j}`);
        }
      }
    }
    
    // The only remaining valid guess should be '55'
    const guess = cpu.generateGuess();
    expect(guess).toBe('55');
  });
  
  test('should switch to target mode and add adjacent targets on hit', () => {
    const location = '44';
    const result = { valid: true, hit: true, sunk: false };
    
    cpu.processResult(location, result);
    
    expect(cpu.mode).toBe('target');
    expect(cpu.lastHit).toBe(location);
    expect(cpu.guesses.has(location)).toBe(true);
    
    // Should have added adjacent positions to target queue
    const expectedTargets = ['34', '54', '43', '45'];
    expect(cpu.targetQueue.length).toBe(4);
    
    for (const target of expectedTargets) {
      expect(cpu.targetQueue.includes(target)).toBe(true);
    }
  });
  
  test('should use targets from queue when in target mode', () => {
    cpu.mode = 'target';
    cpu.targetQueue = ['12', '34'];
    
    const guess1 = cpu.generateGuess();
    expect(guess1).toBe('12');
    expect(cpu.targetQueue).toEqual(['34']);
    
    const guess2 = cpu.generateGuess();
    expect(guess2).toBe('34');
    expect(cpu.targetQueue).toEqual([]);
    
    // Should switch back to hunt mode when queue is empty
    const guess3 = cpu.generateGuess();
    expect(cpu.mode).toBe('hunt');
    expect(guess3).not.toBe('12');
    expect(guess3).not.toBe('34');
  });
  
  test('should handle sunk ships correctly', () => {
    // First hit
    cpu.processResult('44', { valid: true, hit: true, sunk: false });
    expect(cpu.mode).toBe('target');
    
    // Sink the ship with the second hit
    cpu.targetQueue = ['45'];  // Only one target left
    cpu.processResult('45', { valid: true, hit: true, sunk: true });
    
    // Should still be in target mode since the queue is empty
    expect(cpu.mode).toBe('hunt');
    expect(cpu.targetQueue).toEqual([]);
  });
  
  test('should handle misses correctly', () => {
    // Set up target mode
    cpu.mode = 'target';
    cpu.targetQueue = ['12', '34'];
    
    // Process a miss
    cpu.processResult('99', { valid: true, hit: false, sunk: false });
    
    // Should still be in target mode with the queue intact
    expect(cpu.mode).toBe('target');
    expect(cpu.targetQueue).toEqual(['12', '34']);
    expect(cpu.guesses.has('99')).toBe(true);
    
    // If queue becomes empty, should switch to hunt mode
    cpu.targetQueue = [];
    cpu.processResult('88', { valid: true, hit: false, sunk: false });
    expect(cpu.mode).toBe('hunt');
  });
}); 