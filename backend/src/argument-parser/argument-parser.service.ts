import { Injectable } from '@nestjs/common';
import {
  ValidationFunction,
  ValidationResult,
  ExpectedParams,
  ParsedArgument,
} from './constants';

@Injectable()
export class ArgumentParserService {
  private _validateMany(value: string, validation: ValidationFunction[]) {
    let finalResult: ValidationResult = {};
    for (const val of validation) {
      const result = val(value);
      if (result.isValid === false) {
        finalResult = {
          isValid: false,
          message: finalResult.message
            ? `${finalResult.message} ${result.message}`
            : result.message,
        };
      } else if (finalResult.isValid === undefined) {
        finalResult = { isValid: true };
      }
    }
    return finalResult;
  }

  public parse(
    input: string,
    expectedParams: ExpectedParams,
    throwOnInvalid = false,
  ): ParsedArgument[] {
    const posArgs: ParsedArgument[] = [];
    const namedArgs: ParsedArgument[] = [];

    if (!expectedParams.positionalArguments && !expectedParams.namedArguments) {
      throw new Error(
        'No expected parameters. At least one expected type of parameter is required',
      );
    }

    const parsedArgumentsArray = input.split(' ');

    for (const param of parsedArgumentsArray) {
      if (param.startsWith('--')) {
        const [name, value] = param.substring(2).split('=');
        namedArgs.push({ name, value, validationResult: {} });
      } else {
        posArgs.push({
          value: param,
          validationResult: {},
          position: posArgs.length,
        });
      }
    }

    if (expectedParams.positionalArguments) {
      expectedParams.positionalArguments.forEach((expectedParam, index) => {
        const parsedParam = posArgs.find((param) => param.position === index);
        if (parsedParam) {
          parsedParam.validationResult = expectedParam.validate
            ? expectedParam.validate instanceof Array
              ? this._validateMany(parsedParam.value, expectedParam.validate)
              : expectedParam.validate(parsedParam.value)
            : { isValid: true };
        }
      });
    }
    if (expectedParams.namedArguments) {
      for (const expectedParam of expectedParams.namedArguments) {
        const parsedParam = namedArgs.find(
          (param) => param.name === expectedParam.name,
        );
        if (parsedParam) {
          parsedParam.validationResult = expectedParam.validate
            ? expectedParam.validate instanceof Array
              ? this._validateMany(parsedParam.value, expectedParam.validate)
              : expectedParam.validate(parsedParam.value)
            : { isValid: true };
        }
      }
    }
    if (throwOnInvalid) {
      let message = '';
      for (const param of [...posArgs, ...namedArgs]) {
        if (param.validationResult.isValid === false) {
          message += `${param.name} ${param.validationResult.message}\n`;
        }
      }
      if (message !== '') {
        throw new Error(message);
      }
    }
    return [...posArgs, ...namedArgs];
  }
}
