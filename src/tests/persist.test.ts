import { getFromStorage, VField, Form } from '../Form';
import { persist } from '../Form';

const testField = 'testField';
const testFormPersistId = 'testFormPersistId';
const initialValue = 'initialValue';
const newValue = 'newValue';

describe('Тест persist', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });

  describe('Новые экземпляры', () => {
    it('Читает localStorage при срабатывании обертки persist (перезагрузка страницы)', () => {
      const formBeforeReload = persist(
        new Form({
          [testField]: new VField(initialValue),
        }),
        { key: testFormPersistId }
      );

      formBeforeReload.$[testField].onChange(newValue);

      jest.advanceTimersByTime(2000);

      const formAfterReload = persist(
        new Form({
          [testField]: new VField(''),
        }),
        { key: testFormPersistId }
      );

      expect(formAfterReload.$[testField].value).toEqual(formBeforeReload.$[testField].value);
    });

    afterEach(() => {
      localStorage.clear();
    });
  });

  describe('Операции с одной формой', () => {
    let form: Form<{ [testField]: VField<any> }>;

    beforeEach(() => {
      form = persist(
        new Form({
          [testField]: new VField(initialValue),
        }),
        { key: testFormPersistId }
      );
    });

    it('Пишет в localStorage при изменении значения', () => {
      form.$[testField].onChange(newValue);
      jest.advanceTimersByTime(2000);

      const storageValues = (getFromStorage(testFormPersistId) as unknown) as Record<string, unknown>;

      expect(storageValues[testField]).toEqual(newValue);
    });

    it('При инициализации не пишет в форму вместо дефолтных значений undefined и null', () => {
      const storageValues = getFromStorage(testFormPersistId);

      expect(storageValues).toEqual(null);
      expect(form.$[testField].value).toEqual(form.$[testField].initValue);
      expect(form.$[testField].value).toEqual(initialValue);
    });

    it('localStorage.setItem вызывается с дебаунсом SAVE_TO_STORAGE_DELAY', () => {
      jest.spyOn(window.localStorage.__proto__, 'setItem');
      form.$[testField].onChange(newValue);
      expect(localStorage.setItem).toBeCalledTimes(0);
      jest.advanceTimersByTime(1001);
      expect(localStorage.setItem).toBeCalledTimes(1);
    });

    afterEach(() => {
      localStorage.clear();
    });
  });
});
