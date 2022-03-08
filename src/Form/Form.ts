import { action, computed, isArrayLike, isObservable, observable, runInAction } from 'mobx';
import { ICompossibleValidatable, IValidator, ValidateResult } from '../types/types';
import { applyValidators } from '../utils/utils';

export type ValidatableMapOrArray = { [key: string]: ICompossibleValidatable<any, any> };

export type UnsafeValue<TValue extends ValidatableMapOrArray> = { [T in keyof TValue]: TValue[T]['unsafeValue'] };

export type SafeValue<TValue extends ValidatableMapOrArray> = { [T in keyof TValue]: TValue[T]['$'] };

export class Form<TValue extends ValidatableMapOrArray>
  implements ICompossibleValidatable<TValue, UnsafeValue<TValue>> {
  @observable public validating = false;
  @observable public autoValidationEnabled = false;
  protected mode: 'object' | 'array' = 'object';
  @observable private _error: string | null | undefined = '';
  private _validators: IValidator<TValue>[] = [];
  @observable private validatedSubFields: ICompossibleValidatable<any, any>[] = [];

  public constructor(public $: TValue) {
    this.mode = isArrayLike($) ? 'array' : 'object';

    if (!isObservable(this.$)) {
      this.$ = observable(this.$);
    }
  }

  public _onValidationPass = () => {};
  public _onInit = () => {};

  @computed
  public get fields() {
    return this.keys.map(key => this.$[key]);
  }

  @computed
  public get values() {
    return this.unsafeValue;
  }

  public get isChanged(): boolean {
    return Object.values(this.$).some(it => it.isChanged);
  }

  @computed
  // Return unsafe value set after change event
  public get unsafeValue(): { [T in keyof TValue]: TValue[T]['unsafeValue'] } {
    return this.keys.reduce((obj, key) => ((obj[key] = this.$[key].unsafeValue), obj), {} as UnsafeValue<TValue>);
  }

  @computed
  // Return safe value set after validation
  public get value(): { [T in keyof TValue]: TValue[T]['$'] } {
    return this.keys.reduce((obj, key) => ((obj[key] = this.$[key].$), obj), {} as SafeValue<TValue>);
  }

  @computed
  public get keys() {
    return Object.keys(this.$) as (keyof TValue)[];
  }

  @action
  public validators = (...validators: IValidator<TValue>[]) => {
    this._validators = validators;

    return this;
  };

  @action
  public async validate(): Promise<ValidateResult<TValue>> {
    this.validating = true;

    const fieldsResult = await Promise.all(this.fields.map(field => field.validate()));
    const done = runInAction(() => {
      if (fieldsResult.some(f => f.hasError)) {
        this.validating = false;

        return true;
      }

      return false;
    });

    if (done) return { hasError: true as const };

    const error = await applyValidators(this.$, this._validators || []);

    return runInAction(() => {
      if (error !== this._error) {
        this._error = error;
      }

      this.validating = false;

      const hasError = !!error;

      if (hasError) {
        return { hasError: true as const };
      }

      return { hasError: false as const, value: this.$ };
    });
  }

  @computed
  public get hasError() {
    return this.hasFieldError || this.hasFormError;
  }

  @computed
  public get hasFieldError() {
    return this.fields.some(f => f.hasError);
  }

  @computed
  public get hasFormError() {
    return !!this._error;
  }

  @action
  public clearFormError() {
    this._error = '';
  }

  @computed
  public get fieldError() {
    const subItemWithError = this.fields.find(field => field.hasError);

    return subItemWithError ? subItemWithError.error : null;
  }

  @computed
  public get formError() {
    return this._error;
  }

  @computed
  public get error() {
    return this.fieldError || this.formError;
  }

  @action
  public setFormError(error) {
    this._error = error;
  }

  @computed
  public get showFormError() {
    return !this.hasFieldError && this.hasFormError;
  }

  @action
  public resetValidationError = () => {
    this.fields.forEach(field => (field.error = null));
  };

  @action
  public reset = (value?: { [TKey in keyof TValue]: TValue[TKey]['$'] }) => {
    if (value) {
      Object.keys(value).forEach(key => this.$[key].reset(value[key]));
    } else {
      this.fields.forEach(v => v.reset());
    }
  };

  @action
  public enableAutoValidation = () => {
    this.autoValidationEnabled = true;
    this.fields.forEach(x => x.enableAutoValidation());
  };

  @action
  public disableAutoValidation = () => {
    this.autoValidationEnabled = false;
    this.fields.forEach(x => x.disableAutoValidation());
  };

  @action
  public compose() {
    const fields = this.fields;

    fields.forEach(field =>
      field.setCompositionParent({
        onInit: action(() => {
          this.validatedSubFields = this.validatedSubFields.filter(v => v !== field);
        }),
        onValidationPass: action(() => {
          if (this.hasFormError) {
            this.clearFormError();
          }

          if (this.validatedSubFields.indexOf(field) === -1) {
            this.validatedSubFields.push(field);
          }

          if (
            !this.hasFieldError &&
            !this.validating &&
            !this.fields.some(v => this.validatedSubFields.indexOf(v) === -1)
          ) {
            this.validate();
          }
        }),
      })
    );

    return this;
  }

  @action
  public setCompositionParent = (config: { onValidationPass: () => void; onInit: () => void }) => {
    this._onValidationPass = () => runInAction(config.onValidationPass);
    this._onInit = () => runInAction(config.onInit);
  };
}
