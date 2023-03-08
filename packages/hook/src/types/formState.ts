import type { FormValues } from './common';

type ChangeAction<TValues extends FormValues<any>> = {
  type: 'change';
  payload: Partial<TValues>;
};

type BlurAction<TValues extends FormValues<any>> = {
  type: 'blur';
  payload: { [K in keyof TValues]: boolean };
};

type ValidateAction<TValues extends FormValues<any>> = {
  type: 'validate';
  payload: { [K in keyof TValues]?: string };
};

type SubmitValidateAction<TValues extends FormValues<any>> = {
  type: 'submit_validate';
  payload: { [K in keyof TValues]?: string };
};

type ClearErrorAction<TValues extends FormValues<any>> = {
  type: 'clear_error';
  payload: keyof TValues;
};

type ResetAction<TValues extends FormValues<any>> = {
  type: 'reset';
  payload: FormState<TValues>;
};

type SubmitAction = {
  type: 'submit';
};

export type FormAction<TValues extends FormValues<any>> =
  | ChangeAction<TValues>
  | BlurAction<TValues>
  | ValidateAction<TValues>
  | SubmitValidateAction<TValues>
  | ClearErrorAction<TValues>
  | ResetAction<TValues>
  | SubmitAction;

export type FormState<TValues extends FormValues<any>> = {
  values: TValues;
  touched: { [K in keyof TValues]?: boolean };
  errors: { [K in keyof TValues]?: string };
  submitted: boolean;
};
