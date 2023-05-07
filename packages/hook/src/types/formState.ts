import type { FormValues } from './common';

export type FormState<TValues extends FormValues<any>> = {
  values: TValues;
  touched: { [K in keyof TValues]?: boolean };
  errors: { [K in keyof TValues]?: string };
  submitted: boolean;
};
