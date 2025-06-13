import { Schema } from '../Schema';

describe('Validation Library', () => {
  describe('String Validator', () => {
    it('should validate string type', () => {
      const validator = Schema.string();
      expect(validator.validate('test').isValid).toBe(true);
      expect(validator.validate(123).isValid).toBe(false);
    });

    it('should validate string length', () => {
      const validator = Schema.string().minLength(2).maxLength(5);
      expect(validator.validate('abc').isValid).toBe(true);
      expect(validator.validate('a').isValid).toBe(false);
      expect(validator.validate('abcdef').isValid).toBe(false);
    });

    it('should validate email format', () => {
      const validator = Schema.string().email();
      expect(validator.validate('test@example.com').isValid).toBe(true);
      expect(validator.validate('invalid-email').isValid).toBe(false);
    });
  });

  describe('Number Validator', () => {
    it('should validate number type', () => {
      const validator = Schema.number();
      expect(validator.validate(123).isValid).toBe(true);
      expect(validator.validate('123').isValid).toBe(false);
    });

    it('should validate number range', () => {
      const validator = Schema.number().min(0).max(100);
      expect(validator.validate(50).isValid).toBe(true);
      expect(validator.validate(-1).isValid).toBe(false);
      expect(validator.validate(101).isValid).toBe(false);
    });
  });

  describe('Boolean Validator', () => {
    it('should validate boolean type', () => {
      const validator = Schema.boolean();
      expect(validator.validate(true).isValid).toBe(true);
      expect(validator.validate(false).isValid).toBe(true);
      expect(validator.validate('true').isValid).toBe(false);
      expect(validator.validate(1).isValid).toBe(false);
    });

    it('should handle optional boolean', () => {
      const validator = Schema.boolean().optional();
      expect(validator.validate(undefined).isValid).toBe(true);
      expect(validator.validate(null).isValid).toBe(true);
      expect(validator.validate(true).isValid).toBe(true);
      expect(validator.validate('true').isValid).toBe(false);
    });
  });

  describe('Array Validator', () => {
    it('should validate array of strings', () => {
      const validator = Schema.array(Schema.string());
      expect(validator.validate(['a', 'b', 'c']).isValid).toBe(true);
      expect(validator.validate(['a', 123, 'c']).isValid).toBe(false);
    });

    it('should validate array length', () => {
      const validator = Schema.array(Schema.string()).minLength(2).maxLength(3);
      expect(validator.validate(['a', 'b']).isValid).toBe(true);
      expect(validator.validate(['a']).isValid).toBe(false);
      expect(validator.validate(['a', 'b', 'c', 'd']).isValid).toBe(false);
    });
  });

  describe('Object Validator', () => {
    const userSchema = Schema.object({
      name: Schema.string().minLength(2),
      age: Schema.number().min(0),
      email: Schema.string().email(),
      isActive: Schema.boolean(),
      tags: Schema.array(Schema.string()).optional()
    });

    it('should validate valid object', () => {
      const validUser = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
        isActive: true,
        tags: ['developer', 'admin']
      };
      expect(userSchema.validate(validUser).isValid).toBe(true);
    });

    it('should validate invalid object', () => {
      const invalidUser = {
        name: 'J',  // too short
        age: -1,    // negative age
        email: 'invalid-email',
        isActive: 'true',  // wrong type
        tags: ['developer', 123]  // invalid tag type
      };
      const result = userSchema.validate(invalidUser);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle optional fields', () => {
      const userWithoutTags = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
        isActive: false
      };
      expect(userSchema.validate(userWithoutTags).isValid).toBe(true);
    });
  });
}); 