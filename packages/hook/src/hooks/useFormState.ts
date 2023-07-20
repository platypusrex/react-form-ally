import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { createStore } from '../store';
import { FormValues } from '../types';

type State<TValues extends FormValues<any>> = {
  values: TValues;
  errors: Partial<Record<keyof TValues, string>>;
  touched: Partial<Record<keyof TValues, boolean>>;
  submitted: boolean;
  valid: boolean;
};

type UseFormState<TFormState extends FormValues<any>> = {
  state: State<TFormState>;
  store: ReturnType<typeof createStore>;
};

export const useFormState = <TValues extends FormValues<any>>(
  store: ReturnType<typeof createStore>
): UseFormState<TValues> => {
  const state = useSyncExternalStore<State<TValues>>(
    store.subscribe,
    // @ts-ignore
    store.getSnapshot,
    store.getSnapshot
  );
  return { state, store };
};
