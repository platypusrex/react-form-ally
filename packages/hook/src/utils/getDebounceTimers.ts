import type { Debounce } from '../types';

export const getDebounceTimers = (fieldDebounce?: Debounce) => {
  if (!fieldDebounce) return null;
  return typeof fieldDebounce === 'number'
    ? { in: fieldDebounce, out: fieldDebounce }
    : fieldDebounce;
};
