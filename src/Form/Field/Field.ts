import { observable, action, runInAction, computed } from 'mobx';
import { debounce } from 'lodash';
import { ICompossibleValidatable, IValidator, ValidateResult } from 'types';

export class Field<TValue> implements ICompossibleValidatable<TValue, TValue> {
  // значение проставляется на onChange
  @observable public initValue: TValue;
  @observable public unsafeValue: TValue;
  @observable public error: Optional<string>;
  @observable public label?: string;
  // значение проставляется либо при инициализации, либо при успешной валидации поля
  @observable public $: TValue;
  @observable public hasBeenValidated = false;
  @observable public validating = false;
  @observable public validateOnBlur = true;
  public queueValidation: () => void;
  @observable protected lastValidationRequest = 0;
  @observable protected preventNextQueuedValidation = false;
  @observable private _autoValidationDefault = false;
  @observable private _autoValidationEnabled: boolean = this._autoValidationDefault;
  private _onUpdate?: (state: Field<TValue>) => any;
  private _onDidChange?: (config: { newValue: TValue; oldValue: TValue }) => any;
  private _validators: IValidator<TValue>[] = [];

  public constructor(private _initValue: TValue) {
    this.initValue = _initValue;
    this.unsafeValue = _initValue;
    this.$ = _initValue;
    this.error = null;
    this.queueValidation = action(debounce(this.queuedValidationWakeup, 200));
    this._autoValidationEnabled = this._autoValidationDefault;
  }

  @computed
  public get isChanged(): boolean {
    return (
      JSON.stringify(this.unsafeValue)?.match(/[^ ]/gm)?.join('') !==
      JSON.stringify(this.initValue)?.match(/[^ ]/gm)?.join('')
    );
  }

  @computed
  public get value(): TValue {
    return this.unsafeValue;
  }

  public _onValidationPass = () => {};
  public _onInit = () => {};

  @action
  public queuedValidationWakeup = () => {
    if (this.preventNextQueuedValidation) {
      this.preventNextQueuedValidation = false;

      return;
    }

    this.validate();
  };

  @action
  public setLabel = (label: string) => {
    this.label = label;

    return this;
  };

  @action
  public setError(error: Optional<string>) {
    this.error = error;
  }

  @action
  public setValidateOnBlur(validateOnBlur: boolean) {
    this.validateOnBlur = validateOnBlur;

    return this;
  }

  @action
  public setAutoValidationDefault = (autoValidationDefault: boolean) => {
    this._autoValidationDefault = autoValidationDefault;
    this._autoValidationEnabled = autoValidationDefault;

    return this;
  };

  @action
  public getAutoValidationDefault = () => this._autoValidationDefault;

  @action
  public enableAutoValidation = () => {
    this._autoValidationEnabled = true;

    return this;
  };

  @action
  public enableAutoValidationAndValidate = () => {
    this._autoValidationEnabled = true;

    return this.validate();
  };

  @action
  public disableAutoValidation = () => {
    this._autoValidationEnabled = false;

    return this;
  };

  @action
  public clearValidators = () => {
    this._validators = [];

    return this;
  };

  @action
  public validators = (...validators: IValidator<TValue>[]) => {
    this._validators = validators;

    return this;
  };

  @action
  public onUpdate = (handler: (state: Field<TValue>) => any) => {
    this._onUpdate = handler;

    return this;
  };

  @action
  public onDidChange = (handler: (config: { newValue: TValue; oldValue: TValue }) => any) => {
    this._onDidChange = handler;

    return this;
  };

  @action
  public setAutoValidationDebouncedMs = (milliseconds: number) => {
    if (milliseconds === 0) {
      this.queueValidation = action(this.queuedValidationWakeup);
    } else {
      this.queueValidation = action(debounce(this.queuedValidationWakeup, milliseconds));
    }

    return this;
  };

  @action
  public onChange = (value: TValue) => {
    this.preventNextQueuedValidation = false;

    const oldValue = this.unsafeValue;

    this.unsafeValue = value;
    this.executeOnDidChange({ newValue: value, oldValue });
    this.executeOnUpdate();

    if (this._autoValidationEnabled) {
      this.queueValidation();
    }
  };

  @action
  public reset = (value: TValue = this._initValue) => {
    this.preventNextQueuedValidation = true;
    this._autoValidationEnabled = this._autoValidationDefault;
    this.initValue = value;
    this.unsafeValue = value;
    this.error = null;
    this.hasBeenValidated = false;
    this.$ = value;
    this._onInit();
    this.executeOnUpdate();
  };

  public get hasError(): boolean {
    return !!this.error;
  }

  public onBlur = () => this.validateOnBlur && this.validate();
  public onFocus = () => {};

  @computed
  public get props() {
    return {
      value: this.value,
      label: this.label,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onChange: this.onChange,
      error: this.error,
    };
  }

  @computed
  public get dirty() {
    return this.unsafeValue !== this._initValue;
  }

  @action
  public validate = async (validators: IValidator<TValue>[] = this._validators): Promise<ValidateResult<TValue>> => {
    if (validators.length > 0) {
      for (const validator of validators) {
        const error = (await validator(this.value)) as Optional<string>;

        if (error) {
          this.error = error;

          break;
        } else {
          this.error = null;
        }
      }
    }

    return {
      hasError: !!this.error,
      value: this.value,
    };
  };

  @action
  public setCompositionParent = (config: { onValidationPass: () => void; onInit: () => void }) => {
    this._onValidationPass = () => runInAction(config.onValidationPass);
    this._onInit = () => runInAction(config.onInit);
  };

  @action
  protected executeOnDidChange = (config: { newValue: TValue; oldValue: TValue }) => {
    this._onDidChange && this._onDidChange(config);
  };

  @action
  protected executeOnUpdate = () => {
    this._onUpdate && this._onUpdate(this);
  };
}
