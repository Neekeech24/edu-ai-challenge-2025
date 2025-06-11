/**
 * Represents a ship in the Sea Battle game
 */
export class Ship {
  /**
   * Create a new ship
   * @param {string[]} locations - Array of coordinate strings (e.g., ["00", "01", "02"])
   */
  constructor(locations) {
    this.locations = locations;
    this.hits = Array(locations.length).fill(false);
  }

  /**
   * Register a hit on the ship at the specified location
   * @param {string} location - Coordinate string (e.g., "01")
   * @returns {boolean} Whether the hit was successful
   */
  hit(location) {
    const index = this.locations.indexOf(location);
    if (index >= 0 && !this.hits[index]) {
      this.hits[index] = true;
      return true;
    }
    return false;
  }

  /**
   * Check if the ship has been sunk (all locations hit)
   * @returns {boolean} Whether the ship is sunk
   */
  isSunk() {
    return this.hits.every(hit => hit);
  }

  /**
   * Check if a location is part of this ship and has been hit
   * @param {string} location - Coordinate string
   * @returns {boolean} Whether the location is hit
   */
  isLocationHit(location) {
    const index = this.locations.indexOf(location);
    return index >= 0 && this.hits[index];
  }
} 