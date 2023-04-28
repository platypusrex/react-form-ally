import { useRef, useSyncExternalStore } from 'react';
import { createStore } from '../store';
import { FormValues } from '../types';

type State<TFormState extends FormValues<any>> = {
  values: TFormState;
  errors: Partial<Record<keyof TFormState, string>>;
  touched: Partial<Record<keyof TFormState, boolean>>;
  submitted: boolean;
  valid: boolean;
};

export const useFormState = <TFormState extends FormValues<any>>(
  initialState: State<TFormState>
) => {
  const store = useRef(createStore(initialState));
  const state = useSyncExternalStore(
    store.current.subscribe,
    store.current.getSnapshot,
    store.current.getSnapshot
  );

  return { state, store: store.current };
};
