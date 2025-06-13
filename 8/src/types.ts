export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type ValidatorOptions = {
  message?: string;
  optional?: boolean;
};

export interface Validator<T> {
  validate(value: unknown): ValidationResult;
  optional(): this;
  withMessage(message: string): this;
}

export type ValidationRule<T> = (value: T) => boolean; 