import { ChangeEvent } from 'react';

export type FormValues<TValues extends { [key: string]: any }> = {
  [K in keyof TValues]: TValues[K];
};

export type FormErrors<TValues extends FormValues<any>> = {
  [K in keyof TValues]?: string;
};

export type FormTouched<TValues extends FormValues<any>> = {
  [K in keyof TValues]?: boolean;
};

export interface NameAndValue {
  name: string;
  value: any;
}

export type InputChangeEvent = ChangeEvent<any>;

export type OnChangeEvent = InputChangeEvent | NameAndValue;
