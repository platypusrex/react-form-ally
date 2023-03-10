import { useCallback, useEffect, useRef } from 'react';
import type { Dispatch } from 'react';
import { isEqualObj, debounce, getDebounceTimers } from '../utils';
import type {
  ChangeValidation,
  DebounceValidationFn,
  FormAction,
  FormValues,
  Validation,
  ValidationFn
} from "../types";
import { getValidationType } from "../utils/getValidationType";

export const useDebouncedValidation = <TValues extends FormValues<any>>(
  validation: Validation<TValues> | undefined,
  dispatch: Dispatch<FormAction<FormValues<any>>>
) => {
  const getFieldValidationDebounceFns = useCallback(
    (validation?: Validation<TValues>): undefined | DebounceValidationFn<TValues> => {
      if (!validation || getValidationType(validation.type) !== 'change') return;

      const validationFn: ValidationFn<TValues> = (fieldName, error) => {
        dispatch({ type: 'validate', payload: { [fieldName]: error } });
      };

      const { debounce: fieldDebounce } = validation as ChangeValidation<TValues>;
      const debounceTimers = getDebounceTimers(fieldDebounce);

      return {
        in: debounceTimers ? debounce(validationFn, debounceTimers.in) : validationFn,
        out: debounceTimers ? debounce(validationFn, debounceTimers.out) : validationFn,
      };
    },
    [dispatch]
  );

  // the debounce fns need to be stored in a ref or the debounced validation fns are recreated
  // each time a form field change event occurs
  const debounceFns = useRef<undefined | DebounceValidationFn<TValues>>(
    getFieldValidationDebounceFns(validation)
  );

  // This also means we need to manually track whether the debounce validation configs
  // have changed in any given render cycle, if they have we need to update our current debounce validation fns
  // with the new debounce config values
  const debounceTimers = useRef(validation?.type === 'change' && validation.debounce);
  useEffect(() => {
    if (validation?.type === 'change' && debounceTimers.current) {
      const { debounce } = validation;
      const timers = getDebounceTimers(debounce) ?? {};
      const currentTimers = getDebounceTimers(debounceTimers.current) ?? {};

      if (!isEqualObj(currentTimers, timers)) {
        debounceFns.current = getFieldValidationDebounceFns(validation);
        debounceTimers.current = validation.debounce;
      }
    }
    // @ts-ignore
  }, [getFieldValidationDebounceFns, validation, validation?.debounce, validation?.type]);

  return debounceFns;
};
