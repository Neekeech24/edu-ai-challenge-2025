import { Validator, ValidationResult, ValidatorOptions } from './types';

/**
 * Base class for all validators providing common validation functionality
 * @template T The type of value being validated
 */
export abstract class BaseValidator<T> implements Validator<T> {
  /** Validator options including message customization and optional status */
  protected options: ValidatorOptions = {};
  
  /** Collection of validation rules and their error messages */
  protected rules: Array<{ rule: (value: T) => boolean; message: string }> = [];

  constructor() {
    // Add type checking as the first validation rule
    this.addTypeCheck();
  }

  /**
   * Adds the basic type checking rule for this validator
   * Must be implemented by each specific validator
   */
  protected abstract addTypeCheck(): void;

  /**
   * Validates a value against all registered validation rules
   * @param value The value to validate
   * @returns ValidationResult containing validation status and errors
   */
  validate(value: unknown): ValidationResult {
    // Handle optional values
    if (this.options.optional && (value === undefined || value === null)) {
      return { isValid: true, errors: [] };
    }

    const errors: string[] = [];
    
    // Check each validation rule
    for (const { rule, message } of this.rules) {
      if (!rule(value as T)) {
        errors.push(message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Makes this field optional (null/undefined values will pass validation)
   * @returns this for method chaining
   */
  optional(): this {
    this.options.optional = true;
    return this;
  }

  /**
   * Sets a custom error message for the last added validation rule
   * @param message The custom error message
   * @returns this for method chaining
   */
  withMessage(message: string): this {
    if (this.rules.length > 0) {
      this.rules[this.rules.length - 1].message = message;
    }
    return this;
  }

  /**
   * Adds a new validation rule
   * @param rule The validation function
   * @param defaultMessage Default error message if validation fails
   * @returns this for method chaining
   */
  protected addRule(rule: (value: T) => boolean, defaultMessage: string): this {
    this.rules.push({ rule, message: defaultMessage });
    return this;
  }
} 