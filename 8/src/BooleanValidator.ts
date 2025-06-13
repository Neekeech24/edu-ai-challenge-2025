import { BaseValidator } from './BaseValidator';

export class BooleanValidator extends BaseValidator<boolean> {
  protected addTypeCheck(): void {
    this.addRule(
      (value): value is boolean => typeof value === 'boolean',
      'Value must be a boolean'
    );
  }
} 