import { StringValidator } from './StringValidator';
import { NumberValidator } from './NumberValidator';
import { ArrayValidator } from './ArrayValidator';
import { ObjectValidator } from './ObjectValidator';
import { BooleanValidator } from './BooleanValidator';
import { Validator } from './types';

export class Schema {
  static string(): StringValidator {
    return new StringValidator();
  }

  static number(): NumberValidator {
    return new NumberValidator();
  }

  static boolean(): BooleanValidator {
    return new BooleanValidator();
  }

  static array<T>(itemValidator: Validator<T>): ArrayValidator<T> {
    return new ArrayValidator<T>(itemValidator);
  }

  static object<T extends Record<string, any>>(schema: Record<string, Validator<any>>): ObjectValidator<T> {
    return new ObjectValidator<T>(schema);
  }
} 