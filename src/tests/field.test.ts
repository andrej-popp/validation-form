import { Field } from 'Form';

export const required = (message = 'Заполните поле') => {
  return (val: any) => (!val || val === [] ? message : null);
};

export const maxLength = (length: number, message = 'Заполните поле') => {
  return (val: any) => (val.length > length ? message : null);
};

describe('test new validation field', () => {
  let field: Field<Optional<string>>;

  const initValue = '';
  const errorMessage = 'Validation message';

  beforeEach(() => {
    field = new Field<Optional<string>>(initValue).validators(required(errorMessage));
  });

  it('Меняю значение поля', async () => {
    field.onChange('test');
    await field.validate();
    expect(field.value).toBe('test');
    expect(field.error).toBe(null);
  });

  it('Валидирую невалидное значение', async () => {
    field.onChange('');
    await field.validate();
    expect(field.error).toBe(errorMessage);
    expect(field.hasError).toBe(true);

    // initValue === onChangeValue
    expect(field.dirty).toBe(false);
  });

  it('Ресечу поле', async () => {
    field.onChange(null);
    await field.validate();
    field.reset();
    expect(field.value).toBe(initValue);
    expect(field.error).toBe(null);
    expect(field.hasError).toBe(false);
    expect(field.dirty).toBe(false);
  });

  it('Валидация кастомная (по случаю)', async () => {
    const value = 'qwer';

    field.onChange(value);
    await field.validate([maxLength(3, 'Некорректная длина')]);
    expect(field.value).toBe(value);
    expect(field.error).toBe('Некорректная длина');
    expect(field.hasError).toBe(true);
  });

  it('Массив валидаций с ошибкой в первом элементе', async () => {
    const value = 'xyzq';

    field.onChange(value);
    await field.validate([maxLength(3, 'Должно быть 3 символа'), maxLength(4, 'Должно быть 4 символа')]);
    expect(field.value).toBe(value);
    expect(field.error).toBe('Должно быть 3 символа');
    expect(field.hasError).toBe(true);
  });

  it('Массив валидаций с ошибкой в последнем элементе', async () => {
    const value = 'qazw';

    field.onChange(value);
    await field.validate([maxLength(4, 'Должно быть 4 символа'), maxLength(3, 'Должно быть 3 символа')]);
    expect(field.value).toBe(value);
    expect(field.error).toBe('Должно быть 3 символа');
    expect(field.hasError).toBe(true);
  });
});
