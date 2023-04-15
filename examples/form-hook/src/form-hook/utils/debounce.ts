import { DebouncedFunc } from '../types';

export function debounce<TFunc extends (...args: any[]) => any = (...args: any[]) => any>(
  fn: (...args: any[]) => any,
  wait?: number
): DebouncedFunc<TFunc> {
  let timeout: number | null = null;
  let debouncedFn: ((...args: any[]) => any) | null = null;

  function clear() {
    if (timeout) {
      clearTimeout(timeout);

      debouncedFn = null;
      timeout = null;
    }
  }

  function flush() {
    const call = debouncedFn;
    clear();

    if (call) {
      call();
    }
  }

  function debounceWrapper(this: typeof debounceWrapper) {
    if (!wait) {
      // eslint-disable-next-line prefer-rest-params
      return fn.apply(this, arguments as any);
    }

    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    clear();

    debouncedFn = () => {
      fn.apply(this, args as any);
    };

    // @ts-ignore
    timeout = setTimeout(function () {
      timeout = null;

      const call = debouncedFn;
      debouncedFn = null;

      return call?.();
    }, wait);
  }

  debounceWrapper.cancel = clear;
  debounceWrapper.flush = flush;

  return debounceWrapper as DebouncedFunc<TFunc>;
}
