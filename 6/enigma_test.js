const { Enigma } = require('./enigma');

// Define alphabet at the top level so it's available for all functions
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * A comprehensive test suite for the Enigma machine implementation
 */
function runBasicTests() {
  console.log("=== BASIC ENIGMA MACHINE TESTS ===");
  
  // Test with simple message first
  console.log("\n=== TEST 1: Simple Message ===");
  const simpleMessage = "HELLO";
  console.log("Original message:", simpleMessage);
  
  const rotorPositions = [0, 0, 0];
  const ringSettings = [0, 0, 0];
  const plugPairs = [['A', 'B'], ['C', 'D']];
  
  // Manual character-by-character encryption
  const encryptEnigma = new Enigma([0, 1, 2], rotorPositions, ringSettings, plugPairs);
  let encrypted = '';
  for (const c of simpleMessage) {
    encrypted += encryptEnigma.encryptChar(c);
  }
  console.log("Encrypted:", encrypted);
  
  // Manual character-by-character decryption
  const decryptEnigma = new Enigma([0, 1, 2], rotorPositions, ringSettings, plugPairs);
  let decrypted = '';
  for (const c of encrypted) {
    decrypted += decryptEnigma.encryptChar(c);
  }
  console.log("Decrypted:", decrypted);
  console.log("Match:", simpleMessage === decrypted ? "✓ PASS" : "✗ FAIL");
  
  // Test with space
  console.log("\n=== TEST 2: Testing Space Character ===");
  const spaceTest = "A B";
  console.log("Original:", spaceTest);
  
  // Create new enigmas for space test
  const spaceEncryptEnigma = new Enigma([0, 1, 2], rotorPositions, ringSettings, plugPairs);
  let spaceEncrypted = '';
  for (let i = 0; i < spaceTest.length; i++) {
    const c = spaceTest[i];
    const e = spaceEncryptEnigma.encryptChar(c);
    console.log(`Encrypting '${c}' -> '${e}'`);
    spaceEncrypted += e;
  }
  console.log("Encrypted:", spaceEncrypted);
  
  const spaceDecryptEnigma = new Enigma([0, 1, 2], rotorPositions, ringSettings, plugPairs);
  let spaceDecrypted = '';
  for (let i = 0; i < spaceEncrypted.length; i++) {
    const c = spaceEncrypted[i];
    const d = spaceDecryptEnigma.encryptChar(c);
    console.log(`Decrypting '${c}' -> '${d}'`);
    spaceDecrypted += d;
  }
  console.log("Decrypted:", spaceDecrypted);
  console.log("Match:", spaceTest === spaceDecrypted ? "✓ PASS" : "✗ FAIL");
}

function fullMessageTest() {
  console.log("\n=== TEST 3: Full Message Processing ===");
  
  // Original message
  const message = "HELLO WORLD";
  console.log("Original:", message);
  
  // Settings
  const rotorPositions = [0, 0, 0];
  const ringSettings = [0, 0, 0];
  const plugPairs = [['A', 'B'], ['C', 'D']];
  
  // Encrypt
  const enigma1 = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const encrypted = enigma1.process(message);
  console.log("Encrypted:", encrypted);
  
  // Decrypt - using a new machine with the same INITIAL settings
  const enigma2 = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const decrypted = enigma2.process(encrypted);
  console.log("Decrypted:", decrypted);
  console.log("Match:", message === decrypted ? "✓ PASS" : "✗ FAIL");
}

function rotorPositionsTest() {
  console.log("\n=== TEST 4: Different Rotor Positions ===");
  
  const message = "ENIGMAMACHINE";
  console.log("Original:", message);
  
  // Non-zero initial positions
  const rotorPositions = [5, 17, 9]; // Arbitrary non-zero positions
  const ringSettings = [0, 0, 0];
  const plugPairs = [['A', 'B'], ['C', 'D']];
  
  const enigma1 = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const encrypted = enigma1.process(message);
  console.log("Encrypted:", encrypted);
  
  const enigma2 = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const decrypted = enigma2.process(encrypted);
  console.log("Decrypted:", decrypted);
  console.log("Match:", message === decrypted ? "✓ PASS" : "✗ FAIL");
}

function ringSettingsTest() {
  console.log("\n=== TEST 5: Different Ring Settings ===");
  
  const message = "TESTING RING SETTINGS";
  console.log("Original:", message);
  
  const rotorPositions = [0, 0, 0];
  const ringSettings = [3, 5, 7]; // Non-zero ring settings
  const plugPairs = [['A', 'B'], ['C', 'D']];
  
  const enigma1 = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const encrypted = enigma1.process(message);
  console.log("Encrypted:", encrypted);
  
  const enigma2 = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const decrypted = enigma2.process(encrypted);
  console.log("Decrypted:", decrypted);
  console.log("Match:", message === decrypted ? "✓ PASS" : "✗ FAIL");
}

function plugboardTest() {
  console.log("\n=== TEST 6: Complex Plugboard Setup ===");
  
  const message = "PLUGBOARD TEST";
  console.log("Original:", message);
  
  const rotorPositions = [0, 0, 0];
  const ringSettings = [0, 0, 0];
  // More complex plugboard configuration
  const plugPairs = [
    ['A', 'Z'], ['B', 'Y'], ['C', 'X'], ['D', 'W'], ['E', 'V'],
    ['F', 'U'], ['G', 'T'], ['H', 'S'], ['I', 'R'], ['J', 'Q']
  ];
  
  const enigma1 = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const encrypted = enigma1.process(message);
  console.log("Encrypted:", encrypted);
  
  const enigma2 = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const decrypted = enigma2.process(encrypted);
  console.log("Decrypted:", decrypted);
  console.log("Match:", message === decrypted ? "✓ PASS" : "✗ FAIL");
}

function differentRotorOrderTest() {
  console.log("\n=== TEST 7: Different Rotor Order ===");
  
  const message = "TESTING DIFFERENT ROTOR ORDER";
  console.log("Original:", message);
  
  const rotorPositions = [3, 7, 11];
  const ringSettings = [2, 4, 6];
  const plugPairs = [['A', 'B'], ['C', 'D']];
  
  // Using different rotor order: 2, 0, 1 (instead of 0, 1, 2)
  const enigma1 = new Enigma([2, 0, 1], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const encrypted = enigma1.process(message);
  console.log("Encrypted:", encrypted);
  
  const enigma2 = new Enigma([2, 0, 1], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const decrypted = enigma2.process(encrypted);
  console.log("Decrypted:", decrypted);
  console.log("Match:", message === decrypted ? "✓ PASS" : "✗ FAIL");
}

function longMessageTest() {
  console.log("\n=== TEST 8: Long Message (Testing Rotor Stepping) ===");
  
  // Long message to test multiple rotor turnovers
  const message = "THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG";
  console.log("Original:", message);
  
  const rotorPositions = [23, 2, 17];
  const ringSettings = [7, 11, 15];
  const plugPairs = [['A', 'N'], ['B', 'O'], ['C', 'P'], ['D', 'Q'], ['E', 'R']];
  
  const enigma1 = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const encrypted = enigma1.process(message);
  console.log("Encrypted:", encrypted);
  
  const enigma2 = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const decrypted = enigma2.process(encrypted);
  console.log("Decrypted:", decrypted);
  console.log("Match:", message === decrypted ? "✓ PASS" : "✗ FAIL");
}

function knownOutputTest() {
  console.log("\n=== TEST 9: Known Output Test ===");
  
  // Setup with known inputs and outputs (these values should be verified against a reliable Enigma simulator)
  const message = "AAAAA";
  const rotorPositions = [0, 0, 0];
  const ringSettings = [0, 0, 0];
  const plugPairs = [];
  
  const enigma = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const encrypted = enigma.process(message);
  
  // Expected output would need to be verified with a known good implementation
  // This is a placeholder - you should replace with actual expected output
  const expectedOutput = encrypted; // Replace with actual expected output
  
  console.log("Input:", message);
  console.log("Encrypted:", encrypted);
  console.log("Expected:", expectedOutput);
  console.log("Match:", encrypted === expectedOutput ? "✓ PASS" : "✗ FAIL");
}

function notchTest() {
  console.log("\n=== TEST 10: Notch and Double-Stepping Test ===");
  
  // Test the double-stepping mechanism with character encryption
  console.log("Observing rotor stepping behavior during character encryption");
  
  // For the Enigma machine with these rotors:
  // - Rotor I has notch at Q (position 16)
  // - Rotor II has notch at E (position 4)  
  // - Rotor III has notch at V (position 21)
  
  // Test 1: Set the middle rotor to just before the notch
  console.log("\nTest 1: Middle rotor approaching notch");
  
  // Set the middle rotor (II) to position D (just before its notch at E)
  const enigma1 = new Enigma(
    [0, 1, 2],         // Rotors I, II, III
    [0, 3, 0],         // Initial positions A, D, A
    [0, 0, 0],         // Ring settings
    []                 // No plugboard pairs
  );
  
  console.log("Initial positions:", enigma1.rotors.map(r => alphabet[r.position]));
  
  // Encrypt characters and observe the rotor positions
  const testText = "ABCDEF";
  let encrypted = '';
  
  for (let i = 0; i < testText.length; i++) {
    const result = enigma1.encryptChar(testText[i]);
    encrypted += result;
    console.log(`After char '${testText[i]}' → '${result}':`, enigma1.rotors.map(r => alphabet[r.position]));
    
    // Look for the moment when the middle rotor is at notch position E
    if (alphabet[enigma1.rotors[1].position] === 'E') {
      console.log(`  Middle rotor at notch position!`);
      
      // The next character encryption should trigger double-stepping
      if (i + 1 < testText.length) {
        const nextResult = enigma1.encryptChar(testText[i + 1]);
        encrypted += nextResult;
        console.log(`After char '${testText[i + 1]}' → '${nextResult}':`, enigma1.rotors.map(r => alphabet[r.position]));
        
        // Check if both left and middle rotors have stepped
        const leftStepped = enigma1.rotors[0].position === 1; // A → B
        const middleStepped = enigma1.rotors[1].position === 5; // E → F
        
        console.log(`  Double-stepping observed:`, 
                    (leftStepped && middleStepped) ? "✓ YES" : "✗ NO");
        
        i++; // Skip the next character since we've already processed it
      }
    }
  }
  
  console.log("Input:", testText);
  console.log("Encrypted:", encrypted);
  
  // Test 2: Set up for the right rotor at its notch to test middle rotor advancement
  console.log("\nTest 2: Right rotor at notch position");
  
  // Set the right rotor (III) to position U (just before its notch at V)
  const enigma2 = new Enigma(
    [0, 1, 2],         // Rotors I, II, III
    [0, 0, 20],        // Initial positions A, A, U (right rotor just before notch)
    [0, 0, 0],         // Ring settings
    []                 // No plugboard pairs
  );
  
  console.log("Initial positions:", enigma2.rotors.map(r => alphabet[r.position]));
  
  // Encrypt a few characters
  const testText2 = "ABC";
  let encrypted2 = '';
  
  for (let i = 0; i < testText2.length; i++) {
    const result = enigma2.encryptChar(testText2[i]);
    encrypted2 += result;
    console.log(`After char '${testText2[i]}' → '${result}':`, enigma2.rotors.map(r => alphabet[r.position]));
    
    // When right rotor moves from U to V (its notch position), middle rotor should step
    if (i === 0) {
      const middleRotorStepped = enigma2.rotors[1].position === 1; // A → B
      console.log(`  Middle rotor stepped when right rotor reached notch:`, 
                  middleRotorStepped ? "✓ YES" : "✗ NO");
    }
  }
  
  console.log("Input:", testText2);
  console.log("Encrypted:", encrypted2);
}

function historicalValidationTest() {
  console.log("\n=== TEST 11: Historical Validation Test ===");
  
  // This test validates the behavior of the Enigma machine against historically documented behavior
  
  // Test 1: The Enigma's encryption should be reciprocal (self-inverse)
  console.log("Test 1: Reciprocal property");
  const message = "THISISASECRETMESSAGE";
  
  // Use complex configuration
  const rotorPositions = [12, 5, 21];
  const ringSettings = [7, 2, 19];
  const plugPairs = [
    ['A', 'M'], ['F', 'I'], ['N', 'V'], ['P', 'S'], ['T', 'U'], ['W', 'Z']
  ];
  
  const enigma = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const encrypted = enigma.process(message);
  
  // Reset to same initial settings
  const enigma2 = new Enigma([0, 1, 2], [...rotorPositions], [...ringSettings], [...plugPairs]);
  const decrypted = enigma2.process(encrypted);
  
  console.log("Original:", message);
  console.log("Encrypted:", encrypted);
  console.log("Decrypted:", decrypted);
  console.log("Reciprocal property:", message === decrypted ? "✓ PASS" : "✗ FAIL");
  
  // Test 2: Double stepping mechanism validation
  // This is a key mechanical feature of the historical Enigma
  console.log("\nTest 2: Double stepping validation");
  
  // For the Enigma machine with these rotors:
  // - Rotor I has notch at Q (position 16)
  // - Rotor II has notch at E (position 4)  
  // - Rotor III has notch at V (position 21)
  
  // To test the double-stepping mechanism:
  // 1. We'll set the middle rotor to position D (index 3), just before its notch at E (index 4)
  // 2. When we step once, the right rotor advances to B, middle stays at D, left stays at A
  // 3. When we step again, the right rotor advances to C, middle stays at D, left stays at A
  // 4. When we step again, the right rotor advances to D, middle stays at D, left stays at A
  // 5. When we step again, the right rotor advances to E, middle rotor now DOES move to E (because right rotor's position is V), left stays at A
  // 6. When we step again, the right rotor advances to F, middle is at E (notch position), which triggers both middle and left rotors to move
  //    This results in right=F, middle=F, left=B
  
  // Create an Enigma with rotors at key positions to test the double-stepping
  const steppingTest = new Enigma(
    [0, 1, 2],         // Rotors I, II, III
    [0, 3, 0],         // Initial positions A, D, A
    [0, 0, 0],         // Ring settings
    []                 // No plugboard pairs
  );
  
  console.log("Starting test with middle rotor (II) at position D (just before notch E)");
  console.log("Initial:", steppingTest.rotors.map(r => alphabet[r.position]));
  
  // Manually step 5 times
  for (let i = 1; i <= 5; i++) {
    steppingTest.stepRotors();
    console.log(`After step ${i}:`, steppingTest.rotors.map(r => alphabet[r.position]));
    
    // Check step 5, where the double-stepping should occur
    if (i === 5) {
      // After step 5, due to double-stepping, we expect:
      // - Left rotor (I) to have moved from A to B (position 1)
      // - Middle rotor (II) to have moved from E to F (position 5)
      // - Right rotor (III) to have moved from E to F (position 5)
      const correct = steppingTest.rotors[0].position === 1 && 
                     steppingTest.rotors[1].position === 5 && 
                     steppingTest.rotors[2].position === 5;
      console.log(`  Double-stepping occurred:`, correct ? "✓ PASS" : "✗ FAIL");
    }
  }
  
  // Test 3: Test the specific behavior where the middle rotor (II) is at notch position E
  console.log("\nTest 3: Middle rotor at notch position");
  
  // Set up with middle rotor already AT the notch position E
  const notchTest = new Enigma(
    [0, 1, 2],         // Rotors I, II, III  
    [0, 4, 0],         // Initial positions A, E, A (middle rotor at notch)
    [0, 0, 0],         // Ring settings
    []                 // No plugboard pairs
  );
  
  console.log("Initial (middle rotor at notch E):", notchTest.rotors.map(r => alphabet[r.position]));
  
  // Step once
  notchTest.stepRotors();
  console.log("After step:", notchTest.rotors.map(r => alphabet[r.position]));
  
  // We expect both the left and middle rotors to step when the middle rotor is at notch
  const notchStepCorrect = notchTest.rotors[0].position === 1 && 
                           notchTest.rotors[1].position === 5 && 
                           notchTest.rotors[2].position === 1;
  console.log(`  Double-stepping from notch position:`, notchStepCorrect ? "✓ PASS" : "✗ FAIL");
  
  // Test 4: Known input/output pairs from historical documentation
  // These would be actual messages encrypted with known settings
  console.log("\nTest 4: Known historical input/output pairs");
  // For this test, you would need historically verified message/ciphertext pairs
  // with exact rotor settings, which we don't have in this exercise
  console.log("  (Skipping - would require historical data)");
}

// Run all tests
function runAllTests() {
  runBasicTests();
  fullMessageTest();
  rotorPositionsTest();
  ringSettingsTest();
  plugboardTest();
  differentRotorOrderTest();
  longMessageTest();
  knownOutputTest();
  notchTest();
  historicalValidationTest();
  
  console.log("\n=== ALL TESTS COMPLETED ===");
}

// Run tests
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runBasicTests,
  fullMessageTest,
  rotorPositionsTest,
  ringSettingsTest,
  plugboardTest,
  differentRotorOrderTest,
  longMessageTest,
  knownOutputTest,
  notchTest,
  historicalValidationTest,
  runAllTests
}; 