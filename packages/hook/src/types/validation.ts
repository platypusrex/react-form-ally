import type { FormValues } from './common';

export type BaseFieldValidation = {
  message?: string;
};

export type OneOfFieldValidation = BaseFieldValidation & {
  values: (string | number)[];
};

export type LengthFieldValidation = BaseFieldValidation & {
  length: number;
};

export type EqualsFieldValidation = BaseFieldValidation & {
  value: string | number;
};

export type PatternFieldValidation = BaseFieldValidation & {
  regex: RegExp;
};

export type FieldValidation = {
  isRequired?: boolean | BaseFieldValidation;
  isEmail?: boolean | BaseFieldValidation;
  isUrl?: boolean | BaseFieldValidation;
  isOneOf?: OneOfFieldValidation;
  max?: LengthFieldValidation;
  min?: LengthFieldValidation;
  equals?: EqualsFieldValidation;
  pattern?: PatternFieldValidation;
};

export type ValidatorSchema<TValues extends FormValues<any>> = {
  [K in keyof TValues]?: FieldValidation;
};

export type ValidatorResult<TValues extends FormValues<any>> = {
  errors: {
    [K in keyof TValues]?: string;
  };
};

export type DebounceObject = {
  in: number;
  out: number;
};

export type Debounce = number | DebounceObject;

export type DebouncedFunc<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): ReturnType<T> | undefined;

  cancel(): void;

  flush(): ReturnType<T> | undefined;
};

export type DebounceState<TValue> = {
  [key in keyof { in: number; out: number }]: {
    [key in keyof TValue]: DebouncedFunc<any>;
  };
};

export type ValidationType = 'change' | 'blur' | 'submit';

export type BaseValidation<TValues extends FormValues<any>> = {
  schema: (values: TValues) => ValidatorResult<TValues>;
};

export type ChangeValidation<TValues extends FormValues<any>> = BaseValidation<TValues> & {
  type?: Extract<ValidationType, 'change'>;
  debounce?: Debounce;
};

export type BlurValidation<TValues extends FormValues<any>> = BaseValidation<TValues> & {
  type?: Extract<ValidationType, 'blur'>;
};

export type SubmitValidation<TValues extends FormValues<any>> = BaseValidation<TValues> & {
  type?: Extract<ValidationType, 'submit'>;
};

export type Validation<TValues extends FormValues<any>> =
  | ChangeValidation<TValues>
  | BlurValidation<TValues>
  | SubmitValidation<TValues>;
