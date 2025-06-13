import { Schema } from './Schema';

// Define a complex schema for a user profile
const userProfileSchema = Schema.object({
  personalInfo: Schema.object({
    firstName: Schema.string().minLength(2).maxLength(50),
    lastName: Schema.string().minLength(2).maxLength(50),
    email: Schema.string().email(),
    age: Schema.number().min(0).max(150).optional(),
    phoneNumber: Schema.string().pattern(/^\+?[\d\s-]{10,}$/).optional()
  }),
  address: Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^\d{5}$/),
    country: Schema.string()
  }).optional(),
  preferences: Schema.object({
    newsletter: Schema.boolean().optional(),
    theme: Schema.string().pattern(/^(light|dark)$/).optional(),
    notifications: Schema.array(
      Schema.string().pattern(/^(email|sms|push)$/)
    ).optional()
  }).optional(),
  tags: Schema.array(Schema.string()).optional(),
  metadata: Schema.object({}).optional()
});

// Example valid data
const validProfile = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    age: 30,
    phoneNumber: "+1 123-456-7890"
  },
  address: {
    street: "123 Main St",
    city: "Anytown",
    postalCode: "12345",
    country: "USA"
  },
  preferences: {
    newsletter: true,
    theme: "dark",
    notifications: ["email", "push"]
  },
  tags: ["developer", "designer"]
};

// Validate the data
const result = userProfileSchema.validate(validProfile);
console.log("Validation result:", result);

// Example invalid data
const invalidProfile = {
  personalInfo: {
    firstName: "J", // too short
    lastName: "D", // too short
    email: "invalid-email", // invalid email
    age: -1, // negative age
    phoneNumber: "123" // invalid phone number
  },
  address: {
    street: "123 Main St",
    city: "Anytown",
    postalCode: "invalid", // invalid postal code
    country: "USA"
  },
  preferences: {
    theme: "invalid", // invalid theme
    notifications: ["invalid"] // invalid notification type
  }
};

// Validate the invalid data
const invalidResult = userProfileSchema.validate(invalidProfile);
console.log("\nInvalid data validation result:", invalidResult); 