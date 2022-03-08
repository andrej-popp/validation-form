export type IValidationResponse = string | null | undefined | false;

export type IValidatorResponse = IValidationResponse | Promise<IValidationResponse>;

export interface IValidator<TValue> {
  (value: TValue): IValidatorResponse;
}

export type ValidateResult<TValue> = { hasError: true } | { hasError: false; value: TValue };

export interface IValidatable<TValue, TResult> {
  validating: boolean;
  hasError: boolean;
  isChanged: boolean;
  error?: Optional<string>;
  $: TValue;
  unsafeValue: TResult;
  enableAutoValidation: () => void;
  disableAutoValidation: () => void;
  validate(validators?: IValidator<TValue>[]): Promise<ValidateResult<TValue>>;
}

export interface ICompossibleValidatable<TValue, TResult> extends IValidatable<TValue, TResult> {
  reset: (value?: any) => void;
  _onValidationPass: () => void;
  _onInit: () => void;
  setCompositionParent: (config: { onValidationPass: () => void; onInit: () => void }) => void;
}
