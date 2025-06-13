/**
 * Represents the result of a validation operation
 */
export type ValidationResult = {
  /** Whether the validation passed */
  isValid: boolean;
  /** List of validation error messages */
  errors: string[];
};

/**
 * Common options for all validators
 */
export type ValidatorOptions = {
  /** Custom error message to override the default */
  message?: string;
  /** Whether the field is optional */
  optional?: boolean;
};

/**
 * Base interface for all validators
 * @template T The type of value being validated
 */
export interface Validator<T> {
  /** 
   * Validates a value against this validator's rules
   * @param value The value to validate
   * @returns ValidationResult containing validation status and errors
   */
  validate(value: unknown): ValidationResult;
  
  /**
   * Makes this field optional (null/undefined values will pass validation)
   */
  optional(): this;
  
  /**
   * Sets a custom error message for the last added validation rule
   * @param message The custom error message
   */
  withMessage(message: string): this;
}

/**
 * Represents a single validation rule function
 * @template T The type of value being validated
 */
export type ValidationRule<T> = (value: T) => boolean; 