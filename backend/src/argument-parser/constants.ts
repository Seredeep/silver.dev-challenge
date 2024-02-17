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

export type ValidationFunction = (value: string) => ValidationResult;

export type ValidationRules = {
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
