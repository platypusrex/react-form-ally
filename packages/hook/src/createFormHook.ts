import { createStore } from './store';
import { getSharedFormState } from './utils';
import { _useFormInternal } from './hooks';
import { FormValues, UseForm, UseFormConfig } from './types';
import { DEFAULT_FORM_STATE } from './constants';

export const createFormHook = <TValues extends FormValues<any> = FormValues<any>>({
  input,
  validation,
}: UseFormConfig<TValues>): (() => UseForm<TValues>) => {
  const { initialValues, ...rest } = getSharedFormState(input, validation);

  const formStore = createStore({
    values: initialValues,
    ...DEFAULT_FORM_STATE,
  });

  return () =>
    _useFormInternal({
      input,
      validation,
      formStore,
      initialValues,
      ...rest,
    });
};
