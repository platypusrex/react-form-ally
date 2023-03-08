export function debounce(fn: (...args: any[]) => any, wait?: number, callFirst?: boolean) {
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
      return fn.apply(this, arguments as any);
    }

    const context = this;
    const args = arguments;
    const callNow = callFirst && !timeout;
    clear();

    debouncedFn = () => {
      fn.apply(context, args as any);
    };

    timeout = setTimeout(function () {
      timeout = null;

      if (!callNow) {
        const call = debouncedFn;
        debouncedFn = null;

        return call?.();
      }
    }, wait);

    if (callNow) {
      return debouncedFn();
    }
  }

  debounceWrapper.cancel = clear;
  debounceWrapper.flush = flush;

  return debounceWrapper;
}
