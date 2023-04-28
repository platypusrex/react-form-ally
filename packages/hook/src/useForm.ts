import { useCallback, useEffect, useRef } from 'react';
import type { ChangeEventHandler, FocusEventHandler, FormEvent } from 'react';
import { useEventCallback, useFieldValidation, useFormState } from './hooks';
import { shouldDebounceValidation, updateUncontrolledField } from './utils';
import type {
  DefaultCallback,
  FormErrors,
  FormState,
  FormTouched,
  FormValues,
  RegisterCheckboxOptions,
  RegisterCheckboxResult,
  RegisterInputOptions,
  RegisterInputResult,
  RegisterRadioOptions,
  RegisterRadioResult,
  SetError,
  SetErrors,
  SetFieldTouched,
  SetTouched,
  SetValue,
  SetValues,
  Submit,
  Validation,
} from './types';

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
  resetValues: DefaultCallback;
  resetErrors: DefaultCallback;
  resetTouched: DefaultCallback;
  setFieldValue: SetValue<TValues, keyof TValues>;
  setFieldsValues: SetValues<TValues>;
  setFieldError: SetError<TValues>;
  setFieldsErrors: SetErrors<TValues>;
  setFieldTouched: SetFieldTouched<TValues>;
  setFieldsTouched: SetTouched<TValues>;
  focusField: (name: keyof TValues) => void;
  registerInput: (fieldName: keyof TValues, options?: RegisterInputOptions) => RegisterInputResult;
  registerCheckbox: (
    fieldName: keyof TValues,
    options?: RegisterCheckboxOptions
  ) => RegisterCheckboxResult;
  registerRadio: (fieldName: keyof TValues, options: RegisterRadioOptions) => RegisterRadioResult;
  values: FormValues<TValues>;
  errors: FormErrors<TValues>;
  touched: FormTouched<TValues>;
  valid: boolean;
  submitted: boolean;
};

export const useForm = <TValues extends FormValues<any> = FormValues<any>>({
  input,
  validation,
}: UseFormConfig<TValues>): UseForm<TValues> => {
  /* --------------form state initialization-------------- */
  const { initialValues, type: _inputType } = input;
  const { schema, type: _validationType } = validation ?? {};

  const isControlled = _inputType === 'controlled';
  const validationType = _validationType ?? 'change';

  const { state, store } = useFormState<TValues>({
    values: initialValues,
    ...initialState,
  });

  const fieldRefs = useRef({} as { [key in keyof TValues]: any });

  /* --------------form validation utils-------------- */
  const handleFieldValidation = useFieldValidation({
    validation,
    initialValues,
    store,
  });

  const validateField = useCallback(
    (name: keyof TValues, value: any): string | undefined => {
      const formValues = { [name]: value } as TValues;
      const { errors } = schema?.(formValues) ?? {};
      return errors?.[name];
    },
    [schema]
  );

  const validateForm = useCallback(
    (values: TValues): { valid: boolean; errors: Partial<Record<keyof TValues, string>> } => {
      if (!validation) return { valid: true, errors: {} };
      const errors = schema?.(values)?.errors ?? {};
      return { errors, valid: !Object.keys(errors).length };
    },
    [schema, validation]
  );

  /* --------------form handlers-------------- */
  const onReset = useEventCallback(() => {
    store.setState({ ...initialState, values: initialValues }).emit();
    if (!isControlled) {
      const refs = Object.entries(fieldRefs.current) as [keyof TValues, HTMLInputElement][];
      for (const [key, input] of refs) {
        if (Array.isArray(input)) {
          for (const node of input) {
            if (node.checked) node.checked = initialValues[key];
          }
        } else if (input.type === 'checkbox') {
          input.checked = initialValues[key];
        } else {
          input.value = initialValues[key];
        }
      }
    }
  });

  const onSubmit = useEventCallback((handler: (formValues: TValues) => void) => (e: FormEvent) => {
    e.preventDefault();

    const values = store.getSnapshot().values;
    let shouldEmit = false;

    const touched = (Object.keys(values) as (keyof TValues)[]).reduce((acc, curr) => {
      const hasValue = values[curr] !== '' && values[curr] !== undefined;
      if (hasValue && !state.touched[curr]) acc[curr] = true;
      return acc;
    }, {} as FormState<TValues>['touched']);

    if (Object.keys(touched).length) {
      store.setState((ps) => ({
        ...ps,
        touched: { ...ps.touched, ...touched },
      }));
      shouldEmit = true;
    }

    if (validationType === 'submit' && schema) {
      const { errors } = schema(values);
      shouldEmit = true;

      store.setState((ps) => ({
        ...ps,
        errors,
        submitted: true,
      }));

      if (Object.keys(errors).length) {
        shouldEmit && store.emit();
        return;
      }
    }

    if (shouldEmit) store.emit();
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
    if (valid !== store.getSnapshot().valid) {
      store.setState((ps) => ({
        ...ps,
        valid,
      }));
      shouldEmit = true;
    }

    const shouldDebounce = shouldDebounceValidation(validation);
    if (validationType === 'change' && !shouldDebounce && errors[name] !== state.errors[name]) {
      store.setState((ps) => ({
        ...ps,
        errors: { ...ps.errors, [name]: errors[name] },
      }));
      shouldEmit = true;
    }

    if (shouldEmit) store.emit();
    if (shouldDebounce) handleFieldValidation(name, value);
  });

  const onBlur: FocusEventHandler<HTMLInputElement> = useEventCallback((e) => {
    const { name } = e.target;
    let shouldEmit = false;
    const { touched, errors } = store.getSnapshot();

    // if the field has not been touched, update the store touch state field value
    // and prep for publishing
    if (!touched[name]) {
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
      if (error !== errors[name]) {
        store.setState((ps) => ({
          ...ps,
          errors: { ...ps.errors, [name as keyof TValues]: error },
        }));
        shouldEmit = true;
      }
    }

    // if either the touched or error state has changed, publish the new values
    if (shouldEmit) store.emit();
  });

  /* --------------form utils-------------- */
  const resetValues = useCallback(() => {
    store.setState((ps) => ({ ...ps, values: initialValues })).emit();

    if (!isControlled) {
      for (const key in initialValues) {
        updateUncontrolledField(fieldRefs.current, key, initialValues[key]);
      }
    }
  }, [initialValues, isControlled, store]);

  const resetErrors = useCallback(() => {
    store.setState((ps) => ({ ...ps, errors: {} })).emit();
  }, [store]);

  const resetTouched = useCallback(() => {
    store.setState((ps) => ({ ...ps, touched: {} })).emit();
  }, [store]);

  const setFieldValue: SetValue<TValues, keyof TValues> = useCallback(
    (name, value, shouldValidate = true) => {
      if (!isControlled) {
        updateUncontrolledField(fieldRefs.current, name, value);
      }

      store.setState((ps) => ({
        ...ps,
        values: { ...ps.values, [name]: value },
        touched: { ...ps.touched, [name]: true },
      }));

      if (validation && shouldValidate) {
        const error = validateField(name, value);
        store.setState((ps) => ({
          ...ps,
          errors: { ...ps.errors, [name]: error },
        }));
      }

      store.emit();
    },
    [isControlled, store, validateField, validation]
  );

  const setFieldsValues: SetValues<TValues> = useCallback(
    (values, shouldValidation = true) => {
      if (!isControlled) {
        for (const key in values) {
          updateUncontrolledField(fieldRefs.current, key, values[key]);
        }
      }

      const touched = Object.keys(values).reduce((acc, curr) => {
        acc[curr as keyof TValues] = true;
        return acc;
      }, {} as FormState<TValues>['touched']);

      store.setState((ps) => ({
        ...ps,
        values: { ...ps.values, ...values },
        touched: { ...ps.touched, ...touched },
      }));

      if (shouldValidation && validation) {
        const { errors: validationErrors } = validation.schema(values as TValues);
        const errorKeys = Object.keys(validationErrors);
        const fieldNames = Object.keys(values);
        const errors = fieldNames.reduce((acc, curr) => {
          if (errorKeys.find((key) => fieldNames.includes(key))) {
            acc[curr as keyof TValues] = validationErrors[curr] as string;
          }
          return acc;
        }, {} as Record<keyof TValues, string>);

        store.setState((ps) => ({
          ...ps,
          errors: { ...ps.errors, ...errors },
        }));
      }

      store.emit();
    },
    [isControlled, store, validation]
  );

  const setFieldError: SetError<TValues> = useCallback(
    (name, value) => {
      store.setState((ps) => ({ ...ps, errors: { ...ps.errors, [name]: value } })).emit();
    },
    [store]
  );

  const setFieldsErrors: SetErrors<TValues> = useCallback(
    (errors) => {
      store.setState((ps) => ({ ...ps, errors: { ...ps.errors, ...errors } })).emit();
    },
    [store]
  );

  const setFieldTouched: SetFieldTouched<TValues> = useCallback(
    (name, value = true) => {
      store.setState((ps) => ({ ...ps, touched: { ...ps.touched, [name]: value } })).emit();
    },
    [store]
  );

  const setFieldsTouched: SetTouched<TValues> = useCallback(
    (touched) => {
      store.setState((ps) => ({ ...ps, touched: { ...ps.touched, ...touched } })).emit();
    },
    [store]
  );

  /* --------------form field utils/registration fns-------------- */
  const focusField = (name: keyof TValues) => {
    fieldRefs.current[name].focus();
  };

  const registerInput = (
    fieldName: keyof TValues,
    options?: RegisterInputOptions
  ): RegisterInputResult => {
    const ref = (node: HTMLInputElement | HTMLSelectElement) => {
      if (node && !fieldRefs.current[fieldName]) {
        fieldRefs.current[fieldName] = node;
        node.value = store.getSnapshot().values[fieldName];
      }
    };

    const valueAttribute = isControlled ? 'value' : 'defaultValue';
    return {
      name: fieldName as string,
      [valueAttribute]: store.getSnapshot().values[fieldName] ?? '',
      ref,
      onChange,
      onBlur,
      ...options,
    };
  };

  const registerCheckbox = (
    fieldName: keyof TValues,
    options?: RegisterCheckboxOptions
  ): RegisterCheckboxResult => {
    const ref = (node: HTMLInputElement) => {
      if (node && !fieldRefs.current[fieldName]) {
        fieldRefs.current[fieldName] = node;
        node.checked = store.getSnapshot().values[fieldName];
      }
    };

    const valueAttribute = isControlled ? 'checked' : 'defaultChecked';
    return {
      name: fieldName as string,
      [valueAttribute]: store.getSnapshot().values[fieldName],
      ref,
      onChange,
      onBlur,
      ...options,
    };
  };

  const registerRadio = (
    fieldName: keyof TValues,
    options: RegisterRadioOptions
  ): RegisterRadioResult => {
    const ref = (node: HTMLInputElement) => {
      if (node) {
        if (fieldRefs.current?.[fieldName]?.find((n: any) => n === node)) return;
        fieldRefs.current[fieldName] = !fieldRefs.current[fieldName]
          ? [node]
          : [...fieldRefs.current[fieldName], node];
        node.checked = store.getSnapshot().values[fieldName] === node.value;
      }
    };

    const valueAttribute = isControlled ? 'checked' : 'defaultChecked';
    return {
      name: fieldName as string,
      [valueAttribute]: store.getSnapshot().values[fieldName] === options.value,
      ref,
      onChange,
      onBlur,
      ...options,
    };
  };

  // validate any form field populated with a value by default on initial render
  useEffect(() => {
    const { valid } = validateForm(initialValues);
    if (!valid) {
      store.setState((ps) => ({ ...ps, valid })).emit();
    }
    // eslint-disable-next-line
  }, []);

  return {
    ...state,
    onSubmit,
    onReset,
    resetValues,
    resetErrors,
    resetTouched,
    setFieldValue,
    setFieldsValues,
    setFieldError,
    setFieldsErrors,
    setFieldTouched,
    setFieldsTouched,
    focusField,
    registerInput,
    registerCheckbox,
    registerRadio,
  };
};
