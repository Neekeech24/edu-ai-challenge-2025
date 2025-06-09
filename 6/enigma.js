const readline = require('readline');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function mod(n, m) {
  return ((n % m) + m) % m;
}

const ROTORS = [
  { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' }, // Rotor I
  { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' }, // Rotor II
  { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' }, // Rotor III
];
const REFLECTOR = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

// BUG FIX 1: Updated the plugboard implementation to correctly handle pairs as arrays
function plugboardSwap(c, pairs) {
  for (const pair of pairs) {
    if (c === pair[0]) return pair[1];
    if (c === pair[1]) return pair[0];
  }
  return c;
}

class Rotor {
  constructor(wiring, notch, ringSetting = 0, position = 0) {
    this.wiring = wiring;
    this.notch = notch;
    this.ringSetting = ringSetting;
    this.position = position;
  }
  step() {
    this.position = mod(this.position + 1, 26);
  }
  atNotch() {
    return alphabet[this.position] === this.notch;
  }
  // BUG FIX 2: Updated forward method to use charAt for consistent string handling
  forward(c) {
    const idx = mod(alphabet.indexOf(c) + this.position - this.ringSetting, 26);
    const output = this.wiring.charAt(idx);
    return output;
  }
  // BUG FIX 3: Added error handling for backward method and consistent string handling
  backward(c) {
    const idx = this.wiring.indexOf(c);
    if (idx === -1) {
      console.error(`Character ${c} not found in wiring ${this.wiring}`);
      return c;
    }
    
    const alphaIdx = mod(idx - this.position + this.ringSetting, 26);
    return alphabet.charAt(alphaIdx);
  }
}

class Enigma {
  constructor(rotorIDs, rotorPositions, ringSettings, plugboardPairs) {
    this.rotors = rotorIDs.map(
      (id, i) =>
        new Rotor(
          ROTORS[id].wiring,
          ROTORS[id].notch,
          ringSettings[i],
          rotorPositions[i],
        ),
    );
    this.plugboardPairs = plugboardPairs;
  }
  // BUG FIX 4: Corrected the double-stepping mechanism for the rotors
  // This matches the behavior of the historical Enigma machine more accurately
  stepRotors() {
    // In the historical Enigma, when the middle rotor is at its notch position,
    // both the middle and left rotors step. This is the "double-stepping" mechanism.
    // Additionally, when the right rotor is at its notch, it causes the middle rotor to step.
    
    // Check if middle rotor is at notch - this causes both middle and left rotors to step
    const middleRotorAtNotch = this.rotors[1].atNotch();
    
    // Check if right rotor is at notch - this causes middle rotor to step
    const rightRotorAtNotch = this.rotors[2].atNotch();
    
    // Step the left rotor if middle rotor is at its notch
    if (middleRotorAtNotch) {
      this.rotors[0].step();
    }
    
    // Step the middle rotor if either:
    // 1. The right rotor is at its notch, or
    // 2. The middle rotor itself is at its notch (this is the double-stepping mechanism)
    if (rightRotorAtNotch || middleRotorAtNotch) {
      this.rotors[1].step();
    }
    
    // Always step the right-most rotor
    this.rotors[2].step();
  }
  encryptChar(c) {
    if (!alphabet.includes(c)) return c;
    
    this.stepRotors();
    
    // First pass through plugboard (input)
    c = plugboardSwap(c, this.plugboardPairs);
    
    // Forward through rotors (right to left)
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      c = this.rotors[i].forward(c);
    }
    
    // Through the reflector
    const reflectorIdx = alphabet.indexOf(c);
    c = REFLECTOR.charAt(reflectorIdx);
    
    // Backward through rotors (left to right)
    for (let i = 0; i < this.rotors.length; i++) {
      c = this.rotors[i].backward(c);
    }
    
    // MAJOR BUG FIX 5: Added second pass through plugboard on output
    // This was the critical bug that prevented proper decryption.
    // In a real Enigma machine, the electrical signal passes through the plugboard
    // twice: once on entry and once on exit. Without this second pass through the 
    // plugboard, the encryption/decryption process is not symmetric/reciprocal,
    // making it impossible to decrypt messages using the same settings.
    c = plugboardSwap(c, this.plugboardPairs);
    
    return c;
  }
  process(text) {
    return text
      .toUpperCase()
      .split('')
      .map((c) => this.encryptChar(c))
      .join('');
  }
}

function promptEnigma() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter message: ', (message) => {
    rl.question('Rotor positions (e.g. 0 0 0): ', (posStr) => {
      const rotorPositions = posStr.split(' ').map(Number);
      rl.question('Ring settings (e.g. 0 0 0): ', (ringStr) => {
        const ringSettings = ringStr.split(' ').map(Number);
        rl.question('Plugboard pairs (e.g. AB CD): ', (plugStr) => {
          const plugPairs =
            plugStr
              .toUpperCase()
              .match(/([A-Z]{2})/g)
              ?.map((pair) => [pair[0], pair[1]]) || [];

          const enigma = new Enigma(
            [0, 1, 2],
            rotorPositions,
            ringSettings,
            plugPairs,
          );
          const result = enigma.process(message);
          console.log('Output:', result);
          rl.close();
        });
      });
    });
  });
}

if (require.main === module) {
  promptEnigma();
}

module.exports = {
  Enigma,
  promptEnigma
}; 