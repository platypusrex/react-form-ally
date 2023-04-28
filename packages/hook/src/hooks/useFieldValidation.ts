import { useCallback, useEffect, useRef } from 'react';
import {
  getDebounceTimers,
  getInitialDebounceState,
  isEqualObj,
  shouldDebounceValidation,
  validateDebouncedField,
} from '../utils';
import { ChangeValidation, DebounceState, FormValues, Validation } from '../types';
import { useFormState } from './useFormState';

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
        validateDebouncedField<TValues>({
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
