import type { ChangeEventHandler, FocusEventHandler } from 'react';
import { FormValues } from './common';

export type RegisterFieldOptions = {
  id?: string;
  required?: boolean;
  disabled?: boolean;
};

export type RegisterInputOptions = RegisterFieldOptions & {
  max?: number | string;
  maxLength?: number;
  min?: number | string;
  minLength?: number;
  pattern?: string;
  placeholder?: string;
  readOnly?: boolean;
  type?: 'text' | 'email' | 'number' | 'password' | 'tel' | 'url';
};

export type RegisterRadioOptions = RegisterFieldOptions & {
  type?: 'radio';
  value: string;
};

export type RegisterCheckboxOptions = RegisterFieldOptions & {
  type?: 'checkbox';
  value?: string;
};

export type RegisterFieldResult = RegisterFieldOptions & {
  name: string;
  ref: (node: HTMLInputElement) => void;
  onChange: ChangeEventHandler<any>;
  onBlur: FocusEventHandler<any>;
};

export type RegisterInputResult = RegisterFieldResult &
  RegisterInputOptions & {
    value?: string | number;
    defaultValue?: string | number;
  };

export type RegisterCheckboxResult = RegisterFieldResult &
  RegisterCheckboxOptions & {
    checked?: boolean;
    defaultChecked?: boolean;
  };

export type RegisterRadioResult = RegisterFieldResult &
  RegisterRadioOptions & {
    checked?: boolean;
    defaultChecked?: boolean;
  };

export type RegisterField<TValues extends FormValues<any>> = (
  fieldName: keyof TValues,
  options?: RegisterFieldOptions
) => RegisterFieldResult;
