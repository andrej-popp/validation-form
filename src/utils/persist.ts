import { Form } from '../Form/ValidationForm';
import debounce from 'lodash/debounce';

type PersistParameters = {
  key: string;
};

const SAVE_TO_STORAGE_DELAY = 1000;

export const createSaveToStorage = (key: string) =>
  debounce(values => {
    localStorage.setItem(key, JSON.stringify(values));
  }, SAVE_TO_STORAGE_DELAY);

export const getFromStorage = (key: string) => {
  try {
    const storageValue = localStorage.getItem(key);

    return JSON.parse(storageValue as string);
  } catch (e) {
    return null;
  }
};

export function persist<T>(form: Form<any>, parameters: PersistParameters): Form<any> {
  const { key } = parameters;
  const savedValues = getFromStorage(key);

  const originalFormReset = form.reset;

  const saveToStorage = createSaveToStorage(key);

  form.reset = function (...args) {
    originalFormReset.call(form, ...args);
    saveToStorage(form.values);
  };

  for (const fieldId in form.$) {
    if (Object.hasOwnProperty.call(form.$, fieldId)) {
      const field = form.$[fieldId];
      const originalOnChange = field.onChange;
      const originalReset = field.reset;

      const valueFromStorage = savedValues?.[fieldId] ?? field.value;

      field.onChange(valueFromStorage);

      field.onChange = function (...args) {
        originalOnChange.call(field, ...args);
        saveToStorage(form.values);
      };

      field.reset = function (...args) {
        originalReset.call(field, ...args);
        saveToStorage(form.values);
      };
    }
  }

  return form;
}
