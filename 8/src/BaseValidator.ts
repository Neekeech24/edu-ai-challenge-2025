import { Validator, ValidationResult, ValidatorOptions } from './types';

export abstract class BaseValidator<T> implements Validator<T> {
  protected options: ValidatorOptions = {};
  protected rules: Array<{ rule: (value: T) => boolean; message: string }> = [];

  constructor() {
    this.addTypeCheck();
  }

  protected abstract addTypeCheck(): void;

  validate(value: unknown): ValidationResult {
    if (this.options.optional && (value === undefined || value === null)) {
      return { isValid: true, errors: [] };
    }

    const errors: string[] = [];
    
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

  optional(): this {
    this.options.optional = true;
    return this;
  }

  withMessage(message: string): this {
    if (this.rules.length > 0) {
      this.rules[this.rules.length - 1].message = message;
    }
    return this;
  }

  protected addRule(rule: (value: T) => boolean, defaultMessage: string): this {
    this.rules.push({ rule, message: defaultMessage });
    return this;
  }
} 