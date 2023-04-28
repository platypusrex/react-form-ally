import { FormValues, Validation } from '../types';

export const shouldDebounceValidation = <TValues extends FormValues<any>>(
  validation?: Validation<TValues>
) =>
  validation?.type === 'change'
    ? typeof validation.debounce === 'number'
      ? !!validation.debounce
      : validation.debounce?.in !== undefined || validation.debounce?.out !== undefined
    : false;
