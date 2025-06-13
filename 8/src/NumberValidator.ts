import { BaseValidator } from './BaseValidator';

export class NumberValidator extends BaseValidator<number> {
  protected addTypeCheck(): void {
    this.addRule(
      (value): value is number => typeof value === 'number' && !isNaN(value),
      'Value must be a number'
    );
  }

  min(min: number): this {
    return this.addRule(
      value => value >= min,
      `Number must be greater than or equal to ${min}`
    );
  }

  max(max: number): this {
    return this.addRule(
      value => value <= max,
      `Number must be less than or equal to ${max}`
    );
  }

  positive(): this {
    return this.addRule(
      value => value > 0,
      'Number must be positive'
    );
  }

  negative(): this {
    return this.addRule(
      value => value < 0,
      'Number must be negative'
    );
  }

  integer(): this {
    return this.addRule(
      value => Number.isInteger(value),
      'Number must be an integer'
    );
  }
} 