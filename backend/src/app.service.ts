import { Injectable } from '@nestjs/common';
import {
  NamedArgument,
  PositionalArgument,
  ValidationResult,
  parse,
  validationRules,
} from './argument-parser';

@Injectable()
export class AppService {
  /**
   * Method to test the argument parser
   */
  parseParams = (params: string): string => {
    //Positional arguments with no validation rules
    const positionalArguments: PositionalArgument[] = [{}, {}];

    //Custom validator for age
    const minimumAgeValidator: (string) => ValidationResult = (a) => {
      const parsed = parseInt(a, 10);
      if (parsed < 18) {
        return { isValid: false, message: 'Age must be 18 or older' };
      }
    };

    //Named arguments and their validation rules
    const namedArguments: NamedArgument[] = [
      { name: 'name', validate: validationRules.name },
      {
        name: 'age',
        validate: [validationRules.age, minimumAgeValidator],
      },
    ];

    const parsedParams = parse(params, {
      positionalArguments,
      namedArguments,
    });

    return JSON.stringify(parsedParams);
  };

  getHello(): string {
    return 'Hello World!';
  }
}
