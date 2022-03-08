import {
  required,
  isDate,
  bikValidator,
  requiredValidator,
  validateYear,
  ogripValidator,
  accountNumberValidator,
  kppValidator,
  ogrnValidator,
  requiredArray,
  requiredDocumentRadioButtonValue,
  trim,
  validateEmail,
  validatePhone,
  smsCodeValidator,
  loginValidator,
  passwordValidation,
  requiredArrayWithLabel,
  range,
  stringFixLength,
  stringMinLength,
  min,
  minErrorText,
  max,
  maxErrorText,
} from '../validators/validators';

describe('validators tests', () => {
  describe('required', () => {
    const errorMessage = 'errorMessage';
    const validator = required(errorMessage);

    it('negative', () => {
      let value: string | null | undefined | [] = '';

      expect(validator(value)).toBe(errorMessage);

      value = null;
      expect(validator(value)).toBe(errorMessage);

      value = [];
      expect(validator(value)).toBe(errorMessage);

      value = undefined;
      expect(validator(value)).toBe(errorMessage);
    });

    it('positive', () => {
      let value: string | string[] = 'test';

      expect(validator(value)).toBe(null);

      value = ['element'];
      expect(validator(value)).toBe(null);
    });
  });

  describe('isDate', () => {
    const errorMessage = 'Некорректная дата';

    it('negative', () => {
      let value: string | undefined = '';

      expect(isDate(value)).toBe(errorMessage);

      value = undefined;
      expect(isDate(value)).toBe(errorMessage);
    });

    it('positive', () => {
      expect(isDate('19.10.2020')).toBeNull();
    });
  });

  describe('bikValidator', () => {
    const errorMessage = 'Некорректный БИК';

    it('negative not 9 letters', () => {
      let value: string | undefined | null = '';

      expect(bikValidator(value)).toBe(errorMessage);

      value = '123123123123';
      expect(bikValidator(value)).toBe(errorMessage);

      value = '123123';
      expect(bikValidator(value)).toBe(errorMessage);
    });

    it('positive', () => {
      let value: string | undefined | null = '12312 3123';

      expect(bikValidator(value)).toBe(null);

      value = '122 312 123';
      expect(bikValidator(value)).toBe(null);
    });
  });

  describe('requiredValidator', () => {
    const errorMessage = 'Обязательное поле';

    it('negative', () => {
      let value: string | null | undefined | [] = '';

      expect(requiredValidator(value)).toBe(errorMessage);

      value = null;
      expect(requiredValidator(value)).toBe(errorMessage);

      value = [];
      expect(requiredValidator(value)).toBe(errorMessage);

      value = undefined;
      expect(requiredValidator(value)).toBe(errorMessage);
    });

    it('positive', () => {
      let value: string | string[] = 'test';

      expect(requiredValidator(value)).toBe(null);

      value = ['element'];
      expect(requiredValidator(value)).toBe(null);
    });
  });

  describe('validateYear', () => {
    const errorMessage = 'Некорректная дата';

    beforeEach(() => {
      Date.now = jest.fn(() => new Date(Date.UTC(2020, 9, 15)).valueOf());
    });

    it('negative', () => {
      let value = '';

      expect(validateYear(value)).toBe(errorMessage);

      // -101 years
      value = '1919-06-14T15:00:00+03:00';
      expect(validateYear(value)).toBe(errorMessage);

      // +101 years
      value = '2121-06-14T15:00:00+03:00';
      expect(validateYear(value)).toBe(errorMessage);
    });

    it('positive', () => {
      let value = '15.10.2020';

      expect(validateYear(value)).toBe(null);

      // +99 years
      value = '14.06.2119';
      expect(validateYear(value)).toBe(null);

      // -99 years
      value = '14.06.1921';
      expect(validateYear(value)).toBe(null);
    });
  });

  describe('ogripValidator', () => {
    const errorMessage = 'Некорректный ОГРИП';

    it('negative not 15 letters', () => {
      let value: string | undefined | null = '';

      expect(ogripValidator(value)).toBe(errorMessage);

      value = '123123123123';
      expect(ogripValidator(value)).toBe(errorMessage);

      value = '123123';
      expect(ogripValidator(value)).toBe(errorMessage);
    });

    it('positive 15 symbols', () => {
      let value: string | undefined | null = '12333 12333 12333';

      expect(ogripValidator(value)).toBe(null);

      value = '1 2 2 3 1 2 3 4 5 6 2 3 4 5 6';
      expect(ogripValidator(value)).toBe(null);
    });
  });

  describe('ogrnValidator', () => {
    const errorMessage = 'Некорректный ОГРН';

    it('negative not 13 letters', () => {
      let value: string | undefined | null = '';

      expect(ogrnValidator(value)).toBe(errorMessage);

      value = '12312312312311111111111111111111111';
      expect(ogrnValidator(value)).toBe(errorMessage);

      value = '123123';
      expect(ogrnValidator(value)).toBe(errorMessage);
    });

    it('positive', () => {
      let value: string | undefined | null = '12312 12312 123';

      expect(ogrnValidator(value)).toBe(null);

      value = '122 312 123 123 1';
      expect(ogrnValidator(value)).toBe(null);
    });
  });

  describe('kppValidator', () => {
    const errorMessage = 'Некорректный КПП';

    it('negative not 13 letters', () => {
      let value: string | undefined | null = '';

      expect(kppValidator(value)).toBe(errorMessage);

      value = '12312312312311111111111111111111111';
      expect(kppValidator(value)).toBe(errorMessage);

      value = '123123';
      expect(kppValidator(value)).toBe(errorMessage);
    });

    it('positive', () => {
      let value: string | undefined | null = '12312 1231';

      expect(kppValidator(value)).toBe(null);

      value = '122 312 123';
      expect(kppValidator(value)).toBe(null);
    });
  });

  describe('accountNumberValidator', () => {
    const errorMessage = 'Некорректный счёт';

    it('negative less or more 20 letters', () => {
      let value: string | undefined | null = '';

      expect(accountNumberValidator(value)).toBe(errorMessage);

      value = '12312312312311111111111111111111111';
      expect(accountNumberValidator(value)).toBe(errorMessage);

      value = '123123';
      expect(accountNumberValidator(value)).toBe(errorMessage);
    });

    it('positive 20 letters', () => {
      let value: string | undefined | null = '12312 12312 12312 12312';

      expect(accountNumberValidator(value)).toBe(null);

      value = '1234 1234 1234 1234 1234';
      expect(accountNumberValidator(value)).toBe(null);
    });
  });

  describe('requiredArray', () => {
    const errorMessage = 'Выберите хотя бы одно значение';

    it('negative', () => {
      const value: string[] = [];

      expect(requiredArray(value)).toBe(errorMessage);
    });

    it('positive', () => {
      let value: any[] = [1, 2, 3];

      expect(requiredArray(value)).toBe(null);

      value = ['element'];
      expect(requiredArray(value)).toBe(null);
    });
  });

  describe('requiredArray', () => {
    const errorMessage = 'Выберите хотя бы одно значение1';

    it('negative', () => {
      const value: string[] = [];

      expect(requiredArrayWithLabel(errorMessage)(value)).toBe(errorMessage);
    });

    it('positive', () => {
      let value: any[] = [1, 2, 3];

      expect(requiredArrayWithLabel(errorMessage)(value)).toBe(null);

      value = ['element'];
      expect(requiredArrayWithLabel(errorMessage)(value)).toBe(null);
    });
  });

  describe('requiredDocumentRadioButtonValue', () => {
    const errorMessage = 'error';

    it('negative', () => {
      let value: string | null | undefined = '';

      expect(requiredDocumentRadioButtonValue(value)).toBe(errorMessage);

      value = null;
      expect(requiredDocumentRadioButtonValue(value)).toBe(errorMessage);

      value = undefined;
      expect(requiredDocumentRadioButtonValue(value)).toBe(errorMessage);

      value = 'NotSet';
      expect(requiredDocumentRadioButtonValue(value)).toBe(errorMessage);
    });

    it('positive', () => {
      const value: string | null | undefined = 'any string';

      expect(requiredDocumentRadioButtonValue(value)).toBe(null);
    });
  });

  describe('trim', () => {
    it('testTrim', () => {
      const trimValue = '123123123123123123123123';

      let value = '123123 123123 123123 123123';

      expect(trim(value)).toBe(trimValue);

      value = '1 2 3 1 2 3   1 231 2 3   1 23 12 3   1 2 3 1 2 3';
      expect(trim(value)).toBe(trimValue);

      value = '  1 23 1 2 3 1 2 31 23123123123123              ';
      expect(trim(value)).toBe(trimValue);
    });
  });

  describe('validateEmail', () => {
    const errorMessage = 'Некорректная почта';

    it('negative', () => {
      let value: string | null | undefined = '';

      expect(validateEmail(value)).toBe(errorMessage);

      value = '123123123@';
      expect(validateEmail(value)).toBe(errorMessage);
    });

    it('positive', () => {
      const value: string | null | undefined = 'asdasda@asdasd.rere';

      expect(validateEmail(value)).toBe(null);
    });
  });

  describe('validatePhone', () => {
    const errorMessage = 'Некорректный номер';
    const validator = validatePhone();

    it('negative', () => {
      expect(validator('1231231123123123')).toBe(errorMessage);
    });

    it('positive', () => {
      expect(validator('89211111111')).toBe(null);
      expect(validator('')).toBe(null);
      expect(validator(null)).toBe(null);
      expect(validator('+79211111111')).toBe(null);
      expect(validator('+7(921) 111 11 11')).toBe(null);
    });
  });

  describe('smsCodeValidator', () => {
    it('positive', () => {
      expect(smsCodeValidator('1234')).toBeNull();
    });

    it('negative', () => {
      expect(smsCodeValidator('123')).toEqual('Введите код');
    });
  });

  describe('loginValidator', () => {
    it('Корректный номер телефона', () => {
      const login = '79999999999';

      expect(loginValidator(login)).toBeNull();
    });

    it('Корректный email', () => {
      const login = 'test@test.com';

      expect(loginValidator(login)).toBeNull();
    });

    it('Некорректный номер телефона', () => {
      const login = '79999999';

      expect(loginValidator(login)).toBe('Проверьте корректность введенного контакта');
    });

    it('Некорректный email', () => {
      const login = 'test@test';

      expect(loginValidator(login)).toBe('Проверьте корректность введенного контакта');
    });
  });

  describe('passwordValidation', () => {
    it('Пароль соответствует требованиям', () => {
      expect(passwordValidation()('Q1ertyui')).toBeNull();
    });

    it('Пароль соответствует требованиям', () => {
      expect(passwordValidation()('Q#ertyui')).toBeNull();
    });

    it('Пароль не соответствует требованиям', () => {
      expect(passwordValidation()('Q#ERTYUI')).toEqual('Не соответствует требованиям');
    });

    it('Пароль не соответствует требованиям', () => {
      expect(passwordValidation()('q1ertyui')).toEqual('Не соответствует требованиям');
    });

    it('Пароль не соответствует требованиям', () => {
      expect(passwordValidation()('Qcertyui')).toEqual('Не соответствует требованиям');
    });
  });

  describe('range', () => {
    it('Range при правильном значении валиден', () => {
      expect(range(0, 100)(50)).toBeNull();
    });

    it('ошибка Range является текстом, если напрямую его передать', () => {
      expect(range(0, 100, 'text')(101)).toEqual('text');
    });

    it('ошибка Range отдает текст по умолчанию, если напрямую ничего не передать', () => {
      expect(range(0, 100)(101)).toEqual('Укажите от 0 до 100');
    });

    it('ошибка Range отдает текст с переданного коллбека', () => {
      const myCb = (min, max) => `my text ${min} to ${max}`;

      expect(range(0, 100, '', myCb)(101)).toEqual('my text 0 to 100');
    });
  });

  describe('validate string length', () => {
    it('stringFixLength при правильной длине строки', () => {
      expect(stringFixLength(6)('123456')).toBeNull();
    });

    it('stringFixLength ошибка при неверной длине', () => {
      expect(stringFixLength(6)('12345')).toEqual('Требуется 6 символов');
    });

    it('stringMinLength при правильной длине строки', () => {
      expect(stringMinLength(6)('1234567')).toBeNull();
    });

    it('stringMinLength ошибка по умолчанию при неправильной длине строки', () => {
      expect(stringMinLength(6)('123456')).toEqual('Введите более 6 символов');
    });

    it('stringMinLength кастомная ошибка при неправильной длине строки', () => {
      expect(stringMinLength(6, 'test')('123456')).toEqual('test');
    });
  });

  describe('min', () => {
    const errorText = 'error';
    const minVal = 100;

    it('min при правильном значении валиден', () => {
      expect(min(minVal)(minVal)).toBeNull();
    });

    it('ошибка min является текстом, если напрямую его передать', () => {
      expect(min(minVal, errorText)(minVal - 1)).toEqual(errorText);
    });

    it('ошибка min отдает текст по умолчанию, если напрямую ничего не передать', () => {
      expect(min(minVal)(minVal - 1)).toEqual(minErrorText(minVal));
    });

    it('ошибка min отдает текст с переданного коллбека', () => {
      const textCb = min => `custom text ${min}`;

      expect(min(minVal, textCb)(minVal - 1)).toEqual(textCb(minVal));
    });
  });

  describe('max', () => {
    const errorText = 'error';
    const maxVal = 1000;

    it('max при правильном значении валиден', () => {
      expect(max(maxVal)(maxVal)).toBeNull();
    });

    it('ошибка max является текстом, если напрямую его передать', () => {
      expect(max(maxVal, errorText)(maxVal + 1)).toEqual(errorText);
    });

    it('ошибка max отдает текст по умолчанию, если напрямую ничего не передать', () => {
      expect(max(maxVal)(maxVal + 1)).toEqual(maxErrorText(maxVal));
    });

    it('ошибка max отдает текст с переданного коллбека', () => {
      const textCb = max => `custom text ${max}`;

      expect(max(maxVal, textCb)(maxVal + 1)).toEqual(textCb(maxVal));
    });
  });
});
