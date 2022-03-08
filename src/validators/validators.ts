import { isPhone, isValidDate } from 'utils';
import validatorIsEmail from 'validator/lib/isEmail';

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

export const validateEmail = (value: Optional<string>) =>
  value && validatorIsEmail(value) ? null : 'Некорректная почта';

export const requiredValidator = required('Обязательное поле');

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

export const stringMinLength = (strLength: number, message?: string) => {
  return value => (value?.length <= strLength ? message || `Введите более ${strLength} символов` : null);
};

export const trimmedRequired = (message = 'Обязательное поле') => {
  return val => (!val || trim(val).length === 0 ? message : null);
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
