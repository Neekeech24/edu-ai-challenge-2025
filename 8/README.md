# TypeScript Validation Library

A robust, type-safe validation library for complex data structures in TypeScript.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd validation-library
```

2. Install dependencies:
```bash
npm install
```

3. Build the library:
```bash
npm run build
```

## Running Tests

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Watch mode for development:
```bash
npm run test:watch
```

## Usage Guide

### 1. Basic Validation

```typescript
import { Schema } from 'validation-library';

// Create a string validator
const nameValidator = Schema.string()
  .minLength(2)
  .maxLength(50)
  .withMessage('Name must be between 2 and 50 characters');

// Validate a value
const result = nameValidator.validate('John');
console.log(result.isValid); // true
```

### 2. Complex Object Validation

```typescript
// Define a schema for a user object
const userSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().email(),
  age: Schema.number().min(0).max(150).optional(),
  roles: Schema.array(Schema.string())
});

// Validate an object
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  roles: ['admin', 'user']
};

const result = userSchema.validate(user);
console.log(result.isValid); // true
console.log(result.errors);  // []
```

### 3. Nested Object Validation

```typescript
const addressSchema = Schema.object({
  street: Schema.string(),
  city: Schema.string(),
  postalCode: Schema.string().pattern(/^\d{5}$/)
});

const userWithAddressSchema = Schema.object({
  name: Schema.string(),
  address: addressSchema
});
```

### 4. Optional Fields

```typescript
const schema = Schema.object({
  requiredField: Schema.string(),
  optionalField: Schema.number().optional()
});
```

### 5. Custom Validation Messages

```typescript
const ageValidator = Schema.number()
  .min(18)
  .withMessage('Must be at least 18 years old')
  .max(100)
  .withMessage('Must be under 100 years old');
```

## Available Validators

### String Validator
- `string()`: Creates a string validator
- `minLength(n)`: Sets minimum length
- `maxLength(n)`: Sets maximum length
- `email()`: Validates email format
- `pattern(regex)`: Validates against a regular expression
- `nonEmpty()`: Ensures string is not empty

### Number Validator
- `number()`: Creates a number validator
- `min(n)`: Sets minimum value
- `max(n)`: Sets maximum value
- `positive()`: Requires a positive number
- `negative()`: Requires a negative number
- `integer()`: Requires an integer

### Boolean Validator
- `boolean()`: Creates a boolean validator

### Array Validator
- `array(itemValidator)`: Creates an array validator
- `minLength(n)`: Sets minimum array length
- `maxLength(n)`: Sets maximum array length

### Object Validator
- `object(schema)`: Creates an object validator
- `strict()`: Disallows unknown properties

## Common Methods
All validators support:
- `optional()`: Makes the field optional
- `withMessage(msg)`: Customizes the error message

## Error Handling

The validation result includes detailed error messages:
```typescript
const result = userSchema.validate(invalidUser);
if (!result.isValid) {
  console.log('Validation errors:', result.errors);
  // Example output:
  // [
  //   "Field 'name': String must be at least 2 characters long",
  //   "Field 'email': Invalid email address"
  // ]
}
```

## Type Safety

The library is built with TypeScript and provides full type safety:
```typescript
// TypeScript will catch type errors at compile time
const schema = Schema.object({
  name: Schema.string(),
  age: Schema.number()
});

// TypeScript error: type 'string' is not assignable to type 'number'
const invalid = {
  name: "John",
  age: "30" // Error!
};
```

## Development

1. Watch mode for TypeScript compilation:
```bash
npm run build:watch
```

2. Run tests in watch mode:
```bash
npm run test:watch
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run the tests
5. Submit a pull request

## License

ISC 