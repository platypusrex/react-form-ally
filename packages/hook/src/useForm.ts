import { useRef } from 'react';
import { _useFormInternal } from './hooks';
import { getSharedFormState } from './utils';
import { createStore } from './store';
import { DEFAULT_FORM_STATE } from './constants';
import type { FormValues, UseForm, UseFormConfig } from './types';

export const useForm = <TValues extends FormValues<any> = FormValues<any>>({
  input,
  validation,
}: UseFormConfig<TValues>): UseForm<TValues> => {
  const { initialValues, ...rest } = getSharedFormState(input, validation);
  const store = useRef(createStore({ values: initialValues, ...DEFAULT_FORM_STATE }));

  return _useFormInternal({
    input,
    validation,
    initialValues,
    formStore: store.current,
    ...rest,
  });
};
