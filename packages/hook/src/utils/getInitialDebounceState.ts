import { createStore } from '../store';
import type { BaseValidation, Debounce, DebouncedFunc, DebounceState, FormValues } from '../types';
import { debounce } from './debounce';

function handleValidationStateUpdate(
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

const debounceValidationFn = (timing: number): DebouncedFunc<any> | any => {
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
