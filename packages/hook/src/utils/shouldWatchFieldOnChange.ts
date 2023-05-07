import { FormInput, FormValues, WatchConfig } from '../types';
import { createStore } from '../store';

export const shouldWatchFieldOnChange = <TValues extends FormValues<any>>(
  input: FormInput<TValues>,
  name: keyof TValues,
  value: any,
  store: ReturnType<typeof createStore>
) => {
  if (input.type !== 'uncontrolled' || !input.watch) return false;

  if (Array.isArray(input.watch)) {
    let result;
    for (const watchField of input.watch) {
      result =
        typeof watchField === 'string'
          ? watchField === name
          : (watchField as Partial<WatchConfig<TValues, keyof TValues>>)[name]?.(
              value,
              store.getSnapshot().values[name]
            );
    }
    return result;
  } else {
    return input.watch[name]?.(value, store.getSnapshot().values[name]);
  }
};
