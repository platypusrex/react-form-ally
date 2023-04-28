import { BaseValidation, DebounceState, FormValues } from '../types';
import { useFormState } from '../hooks';

type ValidateFieldArgs<TValues extends FormValues<any>> = {
  validationSchema: BaseValidation<TValues>['schema'];
  name: keyof TValues;
  value: any;
  debounceFns: DebounceState<TValues> | undefined;
  store: ReturnType<typeof useFormState>['store'];
};

export const validateDebouncedField = <TValues extends FormValues<any>>({
  validationSchema,
  name,
  value,
  store,
  debounceFns,
}: ValidateFieldArgs<TValues>): void => {
  if (!validationSchema || !debounceFns) return;

  const state = store.getSnapshot();
  const formValues = { [name]: value } as TValues;
  const { errors } = validationSchema?.(formValues) ?? {};
  const error = errors?.[name];

  const debounceIn = debounceFns.in[name];
  const debounceOut = debounceFns.out[name];

  if (error) {
    debounceIn(name, error, store.setStateAndEmit);
    if (debounceOut && 'cancel' in debounceOut) {
      debounceOut?.cancel();
    }
  }

  if (!error) {
    error !== state.errors[name] && debounceOut(name, undefined, store.setStateAndEmit);
    if (debounceIn && 'cancel' in debounceIn) {
      debounceIn?.cancel();
    }
  }
};
