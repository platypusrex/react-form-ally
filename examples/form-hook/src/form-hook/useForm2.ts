import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { ChangeEventHandler, FocusEventHandler, FormEvent } from 'react';
import { useEventCallback, useFormState } from './hooks';
import { debounce, getDebounceTimers, getValidationType, isEqualObj } from './utils';
import { createStore } from './store';
import type {
  ChangeValidation,
  DebounceValidationFn,
  DefaultCallback,
  FormErrors,
  FormTouched,
  FormValues,
  RegisterField,
  RegisterRadioField,
  Submit,
  Validation,
  ValidationFn,
} from './types';
import { useFieldValidation } from './hooks/useFieldValidation';

export const useDebouncedValidation = <TValues extends FormValues<any>>(
  validation: Validation<TValues> | undefined,
  store: ReturnType<typeof createStore<TValues>>
) => {
  const { setStateAndEmit, getSnapshot } = store;
  const getFieldValidationDebounceFns = useCallback(
    (
      validation?: Validation<TValues>
    ): undefined | { [key in keyof TValues]: DebounceValidationFn<TValues> } => {
      if (!validation || getValidationType(validation.type) !== 'change') return;

      const validationFn: ValidationFn<TValues> = (fieldName, error) => {
        setStateAndEmit((prevState) => ({
          ...prevState,
          errors: {
            ...prevState.errors,
            [fieldName]: error,
          },
        }));
      };

      const { debounce: fieldDebounce } = validation as ChangeValidation<TValues>;
      const debounceTimers = getDebounceTimers(fieldDebounce);

      const keys = ['in', 'out'] as const;
      const fns = keys.reduce((acc, curr) => {
        acc[curr] = debounceTimers ? debounce(validationFn, debounceTimers[curr]) : validationFn;
        return acc;
      }, {} as DebounceValidationFn<TValues>);

      const fieldKeys = Object.keys(getSnapshot().values);
      const debounceFns = {} as { [key in keyof TValues]: DebounceValidationFn<TValues> };
      for (const key of fieldKeys) {
        if (key) {
          // @ts-ignore
          debounceFns[key as any] = fns;
        }
      }
      return debounceFns;
    },
    [getSnapshot, setStateAndEmit]
  );

  // the debounce fns need to be stored in a ref or the debounced validation fns are recreated
  // each time a form field change event occurs
  const debounceFns = useRef<undefined | Record<keyof TValues, DebounceValidationFn<TValues>>>(
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

const initialState = {
  submitted: false,
  touched: {},
  errors: {},
  valid: false,
};

export type UseFormConfig<TValues extends FormValues<any> = FormValues<any>> = {
  validation?: Validation<TValues>;
  input: {
    initialValues: TValues;
    type?: 'controlled' | 'uncontrolled';
  };
};

export type UseForm<TValues extends FormValues<any> = FormValues<any>> = {
  onSubmit: Submit<TValues>;
  onReset: DefaultCallback;
  registerInput: RegisterField<TValues>;
  registerCheckbox: RegisterField<TValues>;
  registerRadio: RegisterRadioField<TValues>;
  values: FormValues<TValues>;
  errors: FormErrors<TValues>;
  touched: FormTouched<TValues>;
  valid: boolean;
  submitted: boolean;
};

export const useForm2 = <TValues extends FormValues<any> = FormValues<any>>({
  input,
  validation,
}: UseFormConfig<TValues>): UseForm<TValues> => {
  const { initialValues, type: _inputType } = input;
  const { schema, type: _validationType } = validation ?? {};

  const isControlled = _inputType === 'controlled';
  const validationType = _validationType ?? 'change';

  const { state, store } = useFormState<TValues>({
    values: initialValues,
    ...initialState,
  });

  const fieldRefs = useRef({} as { [key in keyof TValues]: any });
  const handleFieldValidation = useFieldValidation({
    validation,
    initialValues,
    store,
  });
  // const debounceFns = useDebouncedValidation<TValues>(validation, store as any);

  const validateField = (name: keyof TValues, value: any) => {
    const formValues = { [name]: value } as TValues;
    const { errors } = schema?.(formValues) ?? {};
    return errors?.[name];
  };

  // this only seems to work if the user is updating a single field at a time
  // it completely bombs when using form auto-completion (validation with errors are cancelled if multiple fields set simultaneously)
  // const handleChangeValidateField = (fieldName: keyof TValues, value: string) => {
  //   const error = validateField(fieldName, value);
  //
  //   const validationInFn = debounceFns.current?.[fieldName].in;
  //   const validationOutFn = debounceFns.current?.[fieldName].out;
  //
  //   if (error) {
  //     validationInFn?.(fieldName, error);
  //     if (validationOutFn && 'cancel' in validationOutFn) {
  //       validationOutFn?.cancel();
  //     }
  //   }
  //
  //   if (!error) {
  //     state.errors[fieldName as keyof typeof state.errors] &&
  //       validationOutFn?.(fieldName, undefined);
  //     if (validationInFn && 'cancel' in validationInFn) {
  //       validationInFn?.cancel();
  //     }
  //   }
  // };

  // const handleValidateForm = useCallback(
  //   (values: TValues) => {
  //     if (!validation) return true;
  //     return schema?.(values)?.errors ?? {};
  //   },
  //   [schema, validation]
  // );

  const validateForm = useCallback(
    (values: TValues): { valid: boolean; errors: Partial<Record<keyof TValues, string>> } => {
      if (!validation) return { valid: true, errors: {} };
      const errors = schema?.(values)?.errors ?? {};
      return { errors, valid: !Object.keys(errors).length };
    },
    [schema, validation]
  );

  // const valid = useMemo(() => {
  //   return !handleValidateForm(state.values);
  // }, [handleValidateForm, state.values]);

  /* --------------Form handlers-------------- */
  const onReset = useEventCallback(() => {
    store.setState({ ...initialState, values: initialValues }).emit();
  });

  const onSubmit = useEventCallback((handler: (formValues: TValues) => void) => (e: FormEvent) => {
    e.preventDefault();

    const getFormValues = () => {
      if (isControlled) return state.values;

      const values = {} as { [key in keyof TValues]: any };
      const refs = Object.entries(fieldRefs.current) as [keyof TValues, HTMLInputElement][];
      for (const [key, input] of refs) {
        if (Array.isArray(input)) {
          for (const node of input) {
            if (node.checked) values[key] = node.value;
          }
        } else {
          values[key] = input.type === 'checkbox' ? input.checked : input.value;
        }
      }
      return values;
    };

    const values = getFormValues();

    if (validationType === 'submit' && schema) {
      const { errors } = schema(values);
      store
        .setState((ps) => ({
          ...ps,
          errors,
          submitted: true,
        }))
        .emit();
      if (Object.keys(errors).length) return;
    }

    handler(values);
  });

  const onChange: ChangeEventHandler<HTMLInputElement> = useEventCallback((e) => {
    const { name, value, checked, type } = e.target;
    let shouldEmit = isControlled;

    let formValue: string | boolean = value;
    if (type === 'checkbox') formValue = checked;
    const currentValues = { ...store.getSnapshot().values, [name]: formValue };

    store.setState((ps) => ({
      ...ps,
      values: currentValues,
    }));

    const { valid, errors } = validateForm(currentValues);
    if (valid !== state.valid) {
      store.setState((ps) => ({
        ...ps,
        valid,
      }));
      shouldEmit = true;
    }

    const shouldDebounce =
      validation && validation.type === 'change'
        ? typeof validation.debounce === 'number'
          ? !!validation.debounce
          : validation.debounce?.in || validation.debounce?.out
        : false;

    if (validationType === 'change' && !shouldDebounce && errors[name] !== state.errors[name]) {
      store.setState((ps) => ({
        ...ps,
        errors: { ...ps.errors, [name]: errors[name] },
      }));
      shouldEmit = true;
    }

    if (shouldEmit) store.emit();

    if (shouldDebounce) {
      handleFieldValidation(name, value);
    }
  });

  const onBlur: FocusEventHandler<HTMLInputElement> = useEventCallback((e) => {
    const { name } = e.target;
    let shouldEmit = false;

    // if the field has not been touched, update the store touch state field value
    // and prep for publishing
    if (!state.touched[name]) {
      store.setState((ps) => ({
        ...ps,
        touched: { ...ps.touched, [name]: true },
      }));
      shouldEmit = true;
    }

    // if validating onBlur and we have a new error, update the store and error state for field
    // then prep for publishing
    if (validationType === 'blur') {
      const error = validateField(name, e.target.value);
      if (error !== state.errors[name]) {
        store.setState((ps) => ({
          ...ps,
          errors: {
            ...ps.errors,
            [name as keyof TValues]: error,
          },
        }));
        shouldEmit = true;
      }
    }

    // if either the touched or error state has changed, publish the new values
    if (shouldEmit) store.emit();
  });

  const registerInput: RegisterField<TValues> = (fieldName, options) => {
    const ref = (node: HTMLInputElement | HTMLSelectElement) => {
      if (node && !fieldRefs.current[fieldName]) {
        fieldRefs.current[fieldName] = node;
        node.value = state.values[fieldName];
      }
    };

    const valueAttribute = isControlled ? 'value' : 'defaultValue';
    return {
      name: fieldName as string,
      [valueAttribute]: state.values[fieldName] ?? '',
      ref,
      onChange,
      onBlur,
      ...options,
    };
  };

  const registerCheckbox: RegisterField<TValues> = (fieldName, options) => {
    const ref = (node: HTMLInputElement) => {
      if (node && !fieldRefs.current[fieldName]) {
        fieldRefs.current[fieldName] = node;
        node.checked = state.values[fieldName];
      }
    };

    const valueAttribute = isControlled ? 'checked' : 'defaultChecked';
    return {
      name: fieldName as string,
      [valueAttribute]: state.values[fieldName],
      ref,
      onChange,
      onBlur,
      ...options,
    };
  };

  const registerRadio: RegisterRadioField<TValues> = (fieldName, options) => {
    const ref = (node: HTMLInputElement) => {
      if (node) {
        if (fieldRefs.current?.[fieldName]?.find((n: any) => n === node)) return;
        fieldRefs.current[fieldName] = !fieldRefs.current[fieldName]
          ? [node]
          : [...fieldRefs.current[fieldName], node];
        node.checked = state.values[fieldName] === node.value;
      }
    };

    const valueAttribute = isControlled ? 'checked' : 'defaultChecked';
    return {
      name: fieldName as string,
      [valueAttribute]: state.values[fieldName] === options.value,
      ref,
      onChange,
      onBlur,
      ...options,
    };
  };

  // validate any form field populated with a value by default on initial render
  useEffect(() => {
    const { valid } = validateForm(state.values);
    if (!valid) {
      store.setState((ps) => ({ ...ps, valid })).emit();
    }
    // eslint-disable-next-line
  }, []);

  return {
    ...state,
    onSubmit,
    onReset,
    registerInput,
    registerCheckbox,
    registerRadio,
  };
};
