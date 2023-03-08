import type { FormEvent } from 'react';
import type { FormValues } from './common';

export type SetValue<TValues extends FormValues<any>, K extends keyof TValues> = (
  name: K,
  value: TValues[K],
  shouldValidate?: boolean,
) => void;

export type SetValues<TValues extends FormValues<any>> = (
  values: Partial<TValues>,
  shouldValidation?: boolean
) => void;

export type Reset = () => void;

export type Submit<TValues extends FormValues<any>> = (
  handler: (formValues: TValues) => void
) => (e: FormEvent) => void;
