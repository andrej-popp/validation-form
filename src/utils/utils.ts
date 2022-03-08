import { IValidator } from 'types';
import { isObservableMap } from 'mobx';

export const applyValidators = <TValue>(value: TValue, validators: IValidator<TValue>[]): Promise<string | null> => {
  return new Promise<string | null>((resolve, reject) => {
    let currentIndex = 0;

    const gotoNextValidator = () => {
      currentIndex++;
      runCurrentValidator();
    };

    const runCurrentValidator = () => {
      if (currentIndex === validators.length) {
        resolve(null);

        return;
      }

      const validator = validators[currentIndex];
      const res = validator(value);

      if (!res) {
        gotoNextValidator();

        return;
      }

      if (!isPromiseLike(res)) {
        resolve(res);

        return;
      }

      res
        .then((msg: any) => {
          if (!msg) {
            // no error
            gotoNextValidator();
          } else {
            // some error
            resolve(msg);
          }
        })
        .catch(reject);
    };

    runCurrentValidator();
  });
};

export const isPromiseLike = (arg: any): arg is Promise<any> => {
  return arg != null && typeof arg === 'object' && typeof arg.then === 'function';
};

export const isMapLike = (thing: any) => {
  return isObservableMap(thing) || (typeof Map !== 'undefined' && thing instanceof Map);
};

export const validatePasswordLength = value => {
  const oneSymbolOrDigitRegExp = /^([А-Яа-яA-Za-z\d <>[\](){}/|`~@#$%^&*_\-+=:;',.!?,]{8,128})$/;

  return oneSymbolOrDigitRegExp.test(value);
};
