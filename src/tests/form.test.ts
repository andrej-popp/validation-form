import { VField, Form } from '../Form';
import { toJS } from 'mobx';

export const required = (message = 'Заполните поле') => {
  return (val: any) => (!val || val === [] ? message : null);
};

export const checkStringLength = (message: string, length = 1) => {
  return (val: any) => (val.length < length ? message : null);
};

describe('test new validation form', () => {
  let form: Form<{
    stringField: VField<Optional<string>>;
    arrayField: VField<Optional<string[]>>;
    mulitplyValidatorsField: VField<Optional<string>>;
  }>;
  let stringField: VField<Optional<string>>;
  let arrayField: VField<Optional<string[]>>;
  let mulitplyValidatorsField: VField<Optional<string>>;

  const firstErrorMessage = 'Validation message 1';
  const secondErrorMessage = 'Validation message 2';
  const thirdErrorMessage = 'Validation message 3';

  beforeEach(() => {
    stringField = new VField<Optional<string>>(null).validators(required(firstErrorMessage));
    arrayField = new VField<Optional<string[]>>(null).validators(required(secondErrorMessage));
    mulitplyValidatorsField = new VField<Optional<string>>(null).validators(
      required(firstErrorMessage),
      checkStringLength(secondErrorMessage, 2),
      checkStringLength(thirdErrorMessage, 4)
    );
    form = new Form({ stringField, arrayField, mulitplyValidatorsField }).validators(() => thirdErrorMessage);
  });

  it('Ресет ошибок формы', async () => {
    // проверяю что значения в нуле
    expect(form.$.stringField.value).toBe(null);
    expect(form.$.arrayField.value).toBe(null);
    await form.validate();
    expect(form.$.stringField.error).toBe(firstErrorMessage);
    expect(form.$.arrayField.error).toBe(secondErrorMessage);
    expect(form.hasError).toBe(true);
    expect(form.hasFieldError).toBe(true);

    form.reset();

    expect(form.$.stringField.value).toBe(null);
    expect(form.$.arrayField.value).toBe(null);
    expect(form.$.stringField.error).toBe(null);
    expect(form.$.arrayField.error).toBe(null);
    expect(form.hasFormError).toBe(false);
    expect(form.hasError).toBe(false);
    expect(form.hasFieldError).toBe(false);
  });

  it('Ресет значений формы', async () => {
    const stringValue = 'asdasd';

    form.$.stringField.onChange(stringValue);
    form.$.arrayField.onChange([stringValue]);
    expect(form.$.stringField.value).toBe(stringValue);
    expect(toJS(form.$.arrayField.value)).toEqual([stringValue]);

    form.reset();

    expect(form.$.stringField.value).toBe(null);
    expect(form.$.arrayField.value).toBe(null);
  });

  it('Валидирует всю форму', async () => {
    await form.validate();
    expect(form.$.stringField.error).toBe(firstErrorMessage);
    expect(form.$.arrayField.error).toBe(secondErrorMessage);
    expect(form.$.mulitplyValidatorsField.error).toBe(firstErrorMessage);
    expect(form.error).toBe(firstErrorMessage);

    form.$.stringField.onChange('asd');
    form.$.arrayField.onChange(['asd']);
    form.$.mulitplyValidatorsField.onChange('asdasdad');

    await form.validate();
    expect(form.$.stringField.error).toBe(null);
    expect(form.$.arrayField.error).toBe(null);
    expect(form.$.mulitplyValidatorsField.error).toBe(null);
    // тут берет первую ошибку из филда, если их нет берет ошибку валидации формы
    expect(form.error).toBe(thirdErrorMessage);
  });

  it('Достает все значения', async () => {
    form.$.arrayField.onChange(['asdasd']);
    form.$.stringField.onChange('asdasd');
    form.$.mulitplyValidatorsField.onChange('string');
    expect(form.values).toStrictEqual({
      stringField: form.$.stringField.value,
      arrayField: form.$.arrayField.value,
      mulitplyValidatorsField: form.$.mulitplyValidatorsField.value,
    });
  });

  it('Проверка множества валидаторов', async () => {
    form.$.mulitplyValidatorsField.onChange('');
    await form.validate();
    expect(form.$.mulitplyValidatorsField.error).toBe(firstErrorMessage);

    form.$.mulitplyValidatorsField.onChange('a');
    await form.validate();
    expect(form.$.mulitplyValidatorsField.error).toBe(secondErrorMessage);

    form.$.mulitplyValidatorsField.onChange('aa');
    await form.validate();
    expect(form.$.mulitplyValidatorsField.error).toBe(thirdErrorMessage);
  });

  it('Проверка множества валидаторов вложенных', async () => {
    const formWithNestedForm = new Form({ form: new Form({ name: new VField('123123') }) });

    expect(formWithNestedForm.values).toEqual({ form: { name: '123123' } });
  });
});
