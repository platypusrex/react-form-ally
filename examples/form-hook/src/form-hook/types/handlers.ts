import type { FormEvent } from 'react';
import type { FormValues } from './common';

export type SetValue<TValues extends FormValues<any>, K extends keyof TValues> = (
  name: K,
  value: TValues[K],
  shouldValidate?: boolean
) => void;

export type SetValues<TValues extends FormValues<any>> = (
  values: Partial<TValues>,
  shouldValidation?: boolean
) => void;

export type SetError<TValues extends FormValues<any>> = (
  name: keyof TValues,
  value: string
) => void;

export type SetErrors<TValues extends FormValues<any>> = (
  values: Partial<Record<keyof TValues, string>>
) => void;

export type SetFieldTouched<TValues extends FormValues<any>> = (
  name: keyof TValues,
  value: boolean
) => void;

export type SetTouched<TValues extends FormValues<any>> = (values: {
  [K in keyof TValues]: boolean;
}) => void;

export type DefaultCallback = () => void;

export type Submit<TValues extends FormValues<any>> = (
  handler: (formValues: TValues) => void
) => (e: FormEvent) => void;
