import type { ChangeEventHandler, FocusEventHandler } from 'react';

export type FormValues<TValues extends { [key: string]: any }> = {
  [K in keyof TValues]: TValues[K];
};

export type RegisterFieldOptions = {
  id?: string;
  required?: boolean;
  disabled?: boolean;
  max?: number | string;
  maxLength?: number;
  min?: number | string;
  minLength?: number;
  pattern?: RegExp;
  placeholder?: string;
  readOnly?: boolean;
};

export type RegisterFieldResult = RegisterFieldOptions & {
  name: string;
  onChange: ChangeEventHandler<any>;
  onBlur: FocusEventHandler<any>;
  value: string | number;
};

export type RegisterField<TValues extends FormValues<any>> = (
  fieldName: keyof TValues,
  options?: RegisterFieldOptions
) => RegisterFieldResult;
