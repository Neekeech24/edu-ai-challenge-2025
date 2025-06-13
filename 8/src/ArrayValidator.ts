import { BaseValidator } from './BaseValidator';
import { Validator, ValidationResult } from './types';

export class ArrayValidator<T> extends BaseValidator<T[]> {
  constructor(private itemValidator: Validator<T>) {
    super();
  }

  protected addTypeCheck(): void {
    this.addRule(
      (value): value is T[] => Array.isArray(value),
      'Value must be an array'
    );
  }

  minLength(length: number): this {
    return this.addRule(
      value => value.length >= length,
      `Array must contain at least ${length} items`
    );
  }

  maxLength(length: number): this {
    return this.addRule(
      value => value.length <= length,
      `Array must contain at most ${length} items`
    );
  }

  validate(value: unknown): ValidationResult {
    const baseResult = super.validate(value);
    if (!baseResult.isValid) {
      return baseResult;
    }

    const array = value as T[];
    const errors: string[] = [];

    for (let i = 0; i < array.length; i++) {
      const itemResult = this.itemValidator.validate(array[i]);
      if (!itemResult.isValid) {
        errors.push(`Item at index ${i}: ${itemResult.errors.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 