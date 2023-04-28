import { useCallback, useEffect, useRef } from 'react';
import { debounce, getDebounceTimers, isEqualObj, shouldDebounceValidation } from '../utils';
import { createStore } from '../store';
import {
  BaseValidation,
  ChangeValidation,
  Debounce,
  DebouncedFunc,
  FormValues,
  Validation,
} from '../types';
import { useFormState } from './useFormState';

export type DebounceState<TValue> = {
  [key in keyof { in: number; out: number }]: {
    [key in keyof TValue]: DebouncedFunc<any>;
  };
};

export function handleValidationStateUpdate(
  name: string,
  value: any,
  updateState: ReturnType<typeof createStore>['setStateAndEmit']
): void {
  updateState((ps) => ({
    ...ps,
    errors: {
      ...ps.errors,
      [name]: value,
    },
  }));
}

export const debounceValidationFn = (timing: number): DebouncedFunc<any> | any => {
  if (timing) {
    return debounce((name, errorMessage, setErrors) => {
      handleValidationStateUpdate(name, errorMessage, setErrors);
    }, timing);
  }

  return (name: any, errorMessage: string, setErrors: any) =>
    handleValidationStateUpdate(name, errorMessage, setErrors);
};

export const getInitialDebounceState = <TValues extends FormValues<any>>(
  debounceTiming: Debounce,
  initialValues: TValues,
  validationSchema?: BaseValidation<TValues>['schema']
): DebounceState<TValues> | undefined => {
  if (!validationSchema) return;

  return Object.keys(debounceTiming).reduce((acc, curr) => {
    const timing = debounceTiming[curr as keyof typeof debounceTiming];
    acc[curr] = Object.keys(initialValues).reduce((acc, curr) => {
      acc[curr] = debounceValidationFn(timing);
      return acc;
    }, {} as any);
    return acc;
  }, {} as any);
};

type ValidateFieldArgs<TValues extends FormValues<any>> = {
  validationSchema: Validation<TValues>['schema'];
  name: keyof TValues;
  value: any;
  debounceFns: DebounceState<TValues> | undefined;
  store: ReturnType<typeof useFormState>['store'];
};

export const validateField = <TValues extends FormValues<any>>({
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

type UseFieldValidationArgs<TValues extends FormValues<any>> = {
  validation?: Validation<TValues>;
  initialValues: TValues;
  store: ReturnType<typeof useFormState>['store'];
};

export const useFieldValidation = <TValues extends FormValues<any>>({
  validation,
  initialValues,
  store,
}: UseFieldValidationArgs<TValues>) => {
  const isMounted = useRef(false);
  const formValidation = validation ?? ({} as Validation<TValues>);
  const { schema: validationSchema } = formValidation;
  const validationObjRef = useRef(validation);
  const debounceTimers = getDebounceTimers((formValidation as ChangeValidation<TValues>).debounce);
  const debounceFns = useRef<DebounceState<TValues> | undefined>(
    getInitialDebounceState<TValues>(debounceTimers, initialValues, validationSchema)
  );

  useEffect(() => {
    const shouldDebounce = shouldDebounceValidation(validation);
    if (validation?.type === 'change' && shouldDebounce && isMounted.current) {
      const validationObj = validationObjRef.current as ChangeValidation<TValues>;
      const persistedTimers = getDebounceTimers(validationObj.debounce);
      if (!isEqualObj(debounceTimers, persistedTimers)) {
        console.log('made it', { debounceTimers, persisted: persistedTimers });
        validationObj.debounce = debounceTimers;
        debounceFns.current = getInitialDebounceState(
          debounceTimers,
          initialValues,
          validationSchema
        );
      }
    }
    isMounted.current = true;
  }, [debounceTimers, initialValues, validation, validationSchema]);

  return useCallback(
    (name: string, value: any) => {
      if (Reflect.has(initialValues, name)) {
        validateField<TValues>({
          validationSchema,
          name,
          value,
          store,
          debounceFns: debounceFns.current,
        });
      }
    },
    [debounceFns, initialValues, store, validationSchema]
  );
};
