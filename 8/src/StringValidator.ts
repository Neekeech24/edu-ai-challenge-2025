import { BaseValidator } from './BaseValidator';

export class StringValidator extends BaseValidator<string> {
  protected addTypeCheck(): void {
    this.addRule(
      (value): value is string => typeof value === 'string',
      'Value must be a string'
    );
  }

  minLength(length: number): this {
    return this.addRule(
      value => value.length >= length,
      `String must be at least ${length} characters long`
    );
  }

  maxLength(length: number): this {
    return this.addRule(
      value => value.length <= length,
      `String must be at most ${length} characters long`
    );
  }

  pattern(regex: RegExp): this {
    return this.addRule(
      value => regex.test(value),
      `String must match pattern ${regex}`
    );
  }

  email(): this {
    return this.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .withMessage('Invalid email address');
  }

  nonEmpty(): this {
    return this.addRule(
      value => value.trim().length > 0,
      'String must not be empty'
    );
  }
} 