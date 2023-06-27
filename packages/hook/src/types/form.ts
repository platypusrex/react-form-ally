import { FormErrors, FormTouched, FormValues } from './common';
import { Validation } from './validation';
import { FormInput } from './formInput';
import {
  DefaultCallback,
  SetError,
  SetErrors,
  SetFieldTouched,
  SetTouched,
  SetValue,
  SetValues,
  Submit,
} from './handlers';
import {
  RegisterCheckboxOptions,
  RegisterCheckboxResult,
  RegisterInputOptions,
  RegisterInputResult,
  RegisterRadioOptions,
  RegisterRadioResult,
} from './formField';

export type UseFormConfig<TValues extends FormValues<any> = FormValues<any>> = {
  validation?: Validation<TValues>;
  input: FormInput<TValues>;
};

export type UseForm<TValues extends FormValues<any> = FormValues<any>> = {
  onSubmit: Submit<TValues>;
  onReset: DefaultCallback;
  resetValues: DefaultCallback;
  resetErrors: DefaultCallback;
  resetTouched: DefaultCallback;
  setFieldValue: SetValue<TValues, keyof TValues>;
  setFieldsValues: SetValues<TValues>;
  setFieldError: SetError<TValues>;
  setFieldsErrors: SetErrors<TValues>;
  setFieldTouched: SetFieldTouched<TValues>;
  setFieldsTouched: SetTouched<TValues>;
  focusField: (name: keyof TValues) => void;
  registerInput: (fieldName: keyof TValues, options?: RegisterInputOptions) => RegisterInputResult;
  registerCheckbox: (
    fieldName: keyof TValues,
    options?: RegisterCheckboxOptions
  ) => RegisterCheckboxResult;
  registerRadio: (fieldName: keyof TValues, options: RegisterRadioOptions) => RegisterRadioResult;
  values: FormValues<TValues>;
  errors: FormErrors<TValues>;
  touched: FormTouched<TValues>;
  valid: boolean;
  submitted: boolean;
};
