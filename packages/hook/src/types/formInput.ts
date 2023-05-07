import { FormValues } from './common';

export type FormInputType = 'controlled' | 'uncontrolled';

export type BaseFormInput<TValues extends FormValues<any>> = {
  initialValues: TValues;
};

export type ControlledFormInput<TValues extends FormValues<any>> = BaseFormInput<TValues> & {
  type?: Extract<FormInputType, 'controlled'>;
};

export type WatchConfig<TValues extends FormValues<any>, K extends keyof TValues> = {
  [key in K]: (value: TValues[key], prevValue: TValues[key]) => boolean;
};

export type UncontrolledFormInput<TValues extends FormValues<any>> = BaseFormInput<TValues> & {
  type?: Extract<FormInputType, 'uncontrolled'>;
  watch?:
    | (keyof TValues | Partial<WatchConfig<TValues, keyof TValues>>)[]
    | Partial<WatchConfig<TValues, keyof TValues>>;
};

export type FormInput<TValues extends FormValues<any>> =
  | ControlledFormInput<TValues>
  | UncontrolledFormInput<TValues>;
