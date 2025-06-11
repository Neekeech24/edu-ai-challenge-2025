import { Ship } from '../src/models/Ship.js';

describe('Ship', () => {
  let ship;
  const locations = ['00', '01', '02'];
  
  beforeEach(() => {
    ship = new Ship(locations);
  });
  
  test('should be created with correct locations', () => {
    expect(ship.locations).toEqual(locations);
    expect(ship.hits).toEqual([false, false, false]);
  });
  
  test('should register hits correctly', () => {
    // Hit first location
    const hitResult1 = ship.hit('00');
    expect(hitResult1).toBe(true);
    expect(ship.hits).toEqual([true, false, false]);
    
    // Hit second location
    const hitResult2 = ship.hit('01');
    expect(hitResult2).toBe(true);
    expect(ship.hits).toEqual([true, true, false]);
  });
  
  test('should not register hit for invalid location', () => {
    const hitResult = ship.hit('99');
    expect(hitResult).toBe(false);
    expect(ship.hits).toEqual([false, false, false]);
  });
  
  test('should not register hit for already hit location', () => {
    ship.hit('00');
    const hitResult = ship.hit('00');
    expect(hitResult).toBe(false);
    expect(ship.hits).toEqual([true, false, false]);
  });
  
  test('should correctly determine if ship is sunk', () => {
    expect(ship.isSunk()).toBe(false);
    
    ship.hit('00');
    expect(ship.isSunk()).toBe(false);
    
    ship.hit('01');
    expect(ship.isSunk()).toBe(false);
    
    ship.hit('02');
    expect(ship.isSunk()).toBe(true);
  });
  
  test('should correctly identify if a location is hit', () => {
    expect(ship.isLocationHit('00')).toBe(false);
    
    ship.hit('00');
    expect(ship.isLocationHit('00')).toBe(true);
    expect(ship.isLocationHit('01')).toBe(false);
    
    // Invalid location
    expect(ship.isLocationHit('99')).toBe(false);
  });
}); 