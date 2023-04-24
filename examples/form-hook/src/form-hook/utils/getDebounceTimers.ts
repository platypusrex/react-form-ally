import type { Debounce } from '../types';

type DebounceObject = {
  in: number;
  out: number;
};

export const getDebounceTimers = (fieldDebounce?: Debounce) => {
  fieldDebounce ??= 0;
  if (typeof fieldDebounce === 'number') {
    return { in: fieldDebounce, out: fieldDebounce };
  }

  return Object.keys(fieldDebounce).reduce<DebounceObject>((acc, curr) => {
    acc[curr as keyof DebounceObject] =
      (fieldDebounce as DebounceObject)?.[curr as keyof DebounceObject] ?? 0;
    return acc;
  }, {} as DebounceObject);
};
