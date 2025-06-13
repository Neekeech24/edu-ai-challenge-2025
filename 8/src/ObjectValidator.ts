import { BaseValidator } from './BaseValidator';
import { Validator, ValidationResult } from './types';

export class ObjectValidator<T extends Record<string, any>> extends BaseValidator<T> {
  constructor(private schema: Record<string, Validator<any>>) {
    super();
  }

  protected addTypeCheck(): void {
    this.addRule(
      (value): boolean => 
        typeof value === 'object' && value !== null && !Array.isArray(value),
      'Value must be an object'
    );
  }

  validate(value: unknown): ValidationResult {
    const baseResult = super.validate(value);
    if (!baseResult.isValid) {
      return baseResult;
    }

    const object = value as T;
    const errors: string[] = [];

    // Check for required fields and validate each field
    for (const [key, validator] of Object.entries(this.schema)) {
      const fieldValue = object[key];
      
      if (fieldValue === undefined) {
        if (!(validator as any).options?.optional) {
          errors.push(`Field "${key}" is required`);
        }
        continue;
      }

      const fieldResult = validator.validate(fieldValue);
      if (!fieldResult.isValid) {
        errors.push(`Field "${key}": ${fieldResult.errors.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  strict(): this {
    return this.addRule(
      value => {
        const extraKeys = Object.keys(value).filter(key => !(key in this.schema));
        return extraKeys.length === 0;
      },
      'Object contains unknown fields'
    );
  }
} 