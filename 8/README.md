# TypeScript Validation Library

A robust, type-safe validation library for complex data structures in TypeScript.

## Features

- Type-safe validation for primitive and complex types
- Fluent API for building validation schemas
- Comprehensive error messages
- Support for optional fields
- Extensible validation rules
- Built with TypeScript for excellent type inference

## Installation

```bash
npm install validation-library
```

## Usage

```typescript
import { Schema } from 'validation-library';

// Define a schema for a user object
const userSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().email(),
  age: Schema.number().min(0).optional(),
  tags: Schema.array(Schema.string()),
  address: Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^\d{5}$/)
  }).optional()
});

// Validate data
const userData = {
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  tags: ["developer", "designer"],
  address: {
    street: "123 Main St",
    city: "Anytown",
    postalCode: "12345"
  }
};

const result = userSchema.validate(userData);
console.log(result.isValid); // true
console.log(result.errors);  // []

// Invalid data example
const invalidData = {
  name: "J", // too short
  email: "invalid-email",
  age: -1,
  tags: ["developer", 123], // invalid tag type
  address: {
    street: "123 Main St",
    city: "Anytown",
    postalCode: "invalid" // doesn't match pattern
  }
};

const invalidResult = userSchema.validate(invalidData);
console.log(invalidResult.isValid); // false
console.log(invalidResult.errors);
// [
//   "Field 'name': String must be at least 2 characters long",
//   "Field 'email': Invalid email address",
//   "Field 'age': Number must be greater than or equal to 0",
//   "Field 'tags[1]': Value must be a string",
//   "Field 'address.postalCode': String must match pattern /^\d{5}$/"
// ]
```

## API Reference

### Schema

The main entry point for creating validators.

#### String Validator

- `string()`: Creates a string validator
- `minLength(n)`: Sets minimum length
- `maxLength(n)`: Sets maximum length
- `email()`: Validates email format
- `pattern(regex)`: Validates against a regular expression

#### Number Validator

- `number()`: Creates a number validator
- `min(n)`: Sets minimum value
- `max(n)`: Sets maximum value
- `integer()`: Requires an integer
- `positive()`: Requires a positive number

#### Array Validator

- `array(itemValidator)`: Creates an array validator
- `minLength(n)`: Sets minimum array length
- `maxLength(n)`: Sets maximum array length

#### Object Validator

- `object(schema)`: Creates an object validator
- `strict()`: Disallows unknown properties

### Common Methods

All validators support:

- `optional()`: Makes the field optional
- `withMessage(msg)`: Customizes the error message

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC 