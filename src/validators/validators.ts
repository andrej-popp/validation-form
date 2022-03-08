import { addYears, getYear, parse, startOfToday } from 'date-fns';
import {
  hasAnyExceptRussianAndSpaces,
  hasOneSymbolOrDigit,
  isPhone,
  upperCaseAndLowerCase,
  validatePasswordLength,
} from 'services/validators';
import validatorIsEmail from 'validator/lib/isEmail';
import { fromRuToISODateFormat, isValidDate } from 'services/dateTime';

const MAX_RANGE_VALUE = 1000000;

const SYMBOL_DECLENSION: [string, string, string] = ['символ', 'символа', 'символов'];

export const trim = (string: string) => string.replace(/ /g, '');

export const required = (message = 'Обязательное поле') => {
  return (val: any) => (!val || val.length === 0 ? message : null);
};

export const requiredStringNumber = (message = 'Обязательное поле') => {
  return (val: any) => (!val || val === '0' ? message : null);
};

export const notEmpty = (message = 'Обязательное поле') => {
  return (val: any) => (val === '' || val === null || val === undefined || val.length === 0 ? message : null);
};

export const isDate = (value: string | undefined) => (isValidDate(value) ? null : 'Некорректная дата');

export const validatePhone = (message = 'Некорректный номер') => {
  return (val: Optional<string>) => (val === null || val === '' || isPhone(trim(val)) ? null : message);
};

export const requiredDocumentRadioButtonValue = (value: any) => {
  return !!value && value !== 'NotSet' ? null : 'error';
};

export const bikValidator = (value: string) => (value.replace(/ /g, '').length === 9 ? null : 'Некорректный БИК');

export const accountNumberValidator = (value: string) => (trim(value).length === 20 ? null : 'Некорректный счёт');

export const requiredArray = (value: any[]) => (value && value.length >= 1 ? null : 'Выберите хотя бы одно значение');

export const requiredArrayWithLabel = (label = 'Выберите хотя бы одно значение') => (value: any[]) =>
  value && value.length >= 1 ? null : label;

export const validateEmail = (value: Optional<string>) =>
  value && validatorIsEmail(value) ? null : 'Некорректная почта';

export const requiredValidator = required('Обязательное поле');

export const validateYear = (value: any) => {
  const currentYear = pipe(fromRuToISODateFormat, parse, getYear)(value);
  const yearOfAddYears = (years: number) => pipe<number, number>(Date.now, [addYears, years], getYear)();
  const isValid = currentYear <= yearOfAddYears(100) && currentYear >= yearOfAddYears(-100);

  return isValid ? null : 'Некорректная дата';
};

export const emailOrPhoneValidator = (message = 'Обязательное поле') => (value: Optional<string>) => {
  const isPhoneValid = isPhone(value);
  const isEmailValid = value && validatorIsEmail(value);

  if (isPhoneValid || isEmailValid) {
    return null;
  } else {
    return message;
  }
};

export const ogripValidator = (value: any) => {
  return trim(value).length === 15 ? null : 'Некорректный ОГРИП';
};

export const ogrnValidator = (value: any) => {
  return trim(value).length === 13 ? null : 'Некорректный ОГРН';
};

export const kppValidator = (value: any) => {
  return trim(value).length === 9 ? null : 'Некорректный КПП';
};

export const smsCodeValidator = (value: string) => {
  return trim(value).length === 4 ? null : 'Введите код';
};

export const loginValidator = (value: string) => {
  const isPhoneValid = isPhone(value);
  const isEmailValid = validatorIsEmail(value);

  if (isPhoneValid || isEmailValid) {
    return null;
  } else {
    return 'Проверьте корректность введенного контакта';
  }
};

export const passwordValidation = (msg = 'Не соответствует требованиям') => (value: string) => {
  const anyExceptRussianAndSpaces = hasAnyExceptRussianAndSpaces(value);
  const hasSymbolsOrDigits = hasOneSymbolOrDigit(value);
  const moreThanEightLetters = validatePasswordLength(value);
  const hasUpperCaseAndLowerCase = upperCaseAndLowerCase(value);

  return anyExceptRussianAndSpaces && hasSymbolsOrDigits && moreThanEightLetters && hasUpperCaseAndLowerCase
    ? null
    : msg;
};

export const rangeErrorText = (min: number, max: number) => {
  return `Укажите от ${min} до ${max}`;
};

export const range = (
  min: number,
  max: number,
  text = '',
  textCallback: (min: number, max: number) => string = rangeErrorText
) => {
  const errorText = text && text !== '' ? text : textCallback && textCallback(min, max);

  return value => (value !== null && (value < min || value > max) ? errorText : null);
};

export const numbersOnly = errorText => {
  return value => (/^\d*\.?\d*$/.test(value) ? errorText : null);
};

export const stringLength = strLength => {
  return value => (value?.length > strLength ? `Введите не более ${strLength} символов` : null);
};

export const stringFixLength = strLength => {
  return value =>
    value?.length !== strLength ? `Требуется ${strLength} ${Filter.declension(strLength, SYMBOL_DECLENSION)}` : null;
};

export const stringMinLength = (strLength: number, message?: string) => {
  return value => (value?.length <= strLength ? message || `Введите более ${strLength} символов` : null);
};

export const trimmedRequired = (message = 'Обязательное поле') => {
  return val => (!val || trim(val).length === 0 ? message : null);
};

export const isNumberRange = (limitTypeIdValue: LimitTypeId) => {
  return val =>
    !val || Math.abs(val) > MAX_RANGE_VALUE
      ? `Не может превышать ${MAX_RANGE_VALUE.toLocaleString('ru-RU')} ${
          (limitTypeIdValue && numberRangeErrorTexts[limitTypeIdValue]) || ''
        }`
      : null;
};

export const isPositiveNumber = (message = 'Число должно быть больше 0') => {
  return val => (!val || val <= 0 ? message : null);
};

export const minErrorText = (min: number) => {
  return `Число должно быть больше или равно ${min}`;
};

export const min = (min: number, message?: string | ((min: number) => string)) => {
  return (val: number) => {
    if (val < min) {
      if (!message) return minErrorText(min);

      if (typeof message === 'string') return message;

      return message(min);
    }

    return null;
  };
};

export const maxErrorText = (max: number) => {
  return `Число должно быть меньше или равно ${max}`;
};

export const max = (max: number, message?: string | ((max: number) => string)) => {
  return (val: number) => {
    if (val > max) {
      if (!message) return maxErrorText(max);

      if (typeof message === 'string') return message;

      return message(max);
    }

    return null;
  };
};

export const isDateLaterThanToday = (message?: string) => (date: Optional<string>) => {
  if (date) {
    const chosenDate = parse(date);

    if (chosenDate.getTime() < startOfToday().getTime()) {
      return message || 'Укажите дату от текущего дня';
    }
  }

  return null;
};
