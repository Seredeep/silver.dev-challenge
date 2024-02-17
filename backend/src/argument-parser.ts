import * as moment from 'moment';

export type NamedArgument = {
  validate?: ValidationFunction | ValidationFunction[];
  name: string;
};

export type PositionalArgument = {
  validate?: ValidationFunction | ValidationFunction[];
};

export type ValidationResult = {
  isValid?: boolean;
  message?: string;
};

type ValidationFunction = (value: string) => ValidationResult;

type ValidationRules = {
  [key in
    | 'age'
    | 'name'
    | 'required'
    | 'email'
    | 'phone'
    | 'url'
    | 'date'
    | 'time']: ValidationFunction;
};

export type ParsedArgument = {
  name?: string;
  position?: number;
  value: string;
  validationResult: ValidationResult;
  message?: string;
};

export type ExpectedParams = {
  positionalArguments?: PositionalArgument[];
  namedArguments?: NamedArgument[];
};

function _validateMany(value: string, validation: ValidationFunction[]) {
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

export function parse(
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
            ? _validateMany(parsedParam.value, expectedParam.validate)
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
            ? _validateMany(parsedParam.value, expectedParam.validate)
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

export const validationRules: ValidationRules = {
  age: (value: string) => {
    if (isNaN(Number(value))) {
      return { isValid: false, message: 'Age must be a number' };
    }
    return { isValid: true };
  },
  name: (value: string) => {
    if (!value) {
      return { isValid: false, message: 'Name is required' };
    }
    return { isValid: true };
  },
  required: (value: string) => {
    if (!value) {
      return { isValid: false, message: 'Value is required' };
    }
    return { isValid: true };
  },
  email: (value: string) => {
    if (!value.includes('@')) {
      return { isValid: false, message: 'Email is invalid' };
    }
    return { isValid: true };
  },
  phone: (value: string) => {
    if (!value.match(/^\d{10}$/)) {
      return { isValid: false, message: 'Phone number is invalid' };
    }
    return { isValid: true };
  },
  url: (value: string) => {
    if (!value.match(/^https?:\/\/\S+$/)) {
      return { isValid: false, message: 'URL is invalid' };
    }
    return { isValid: true };
  },
  date: (value: string) => {
    if (!moment(value, 'YYYY-MM-DD').isValid()) {
      return { isValid: false, message: 'Date is invalid' };
    }
    return { isValid: true };
  },
  time: (value: string) => {
    if (!moment(value, 'HH:mm').isValid()) {
      return { isValid: false, message: 'Time is invalid' };
    }
    return { isValid: true };
  },
};
