import { useCallback, useMemo, useReducer } from 'react';
import type { ChangeEventHandler, FocusEventHandler, FormEvent } from 'react';
import { useDebouncedValidation, useEventCallback } from './hooks';
import { getValidationType } from './utils';
import type {
  DefaultCallback,
  FormAction,
  FormErrors,
  FormState,
  FormTouched,
  FormValues,
  RegisterField,
  SetError,
  SetErrors,
  SetFieldTouched,
  SetTouched,
  SetValue,
  SetValues,
  Submit,
  Validation,
} from './types';

const reducer = <TValues extends FormValues<any>>(
  state: FormState<TValues>,
  action: FormAction<TValues>
) => {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        values: { ...state.values, ...action.payload },
      };
    case 'blur':
      return {
        ...state,
        touched: { ...state.touched, ...action.payload },
      };
    case 'validate':
      return {
        ...state,
        errors: { ...state.errors, ...action.payload },
      };
    case 'submit_validate':
      return {
        ...state,
        errors: action.payload,
      };
    case 'reset':
      return { ...state, ...action.payload };
    case 'submit':
      return { ...state, submitted: true };
    case 'reset_values':
      return { ...state, values: action.payload };
    case 'reset_errors':
      return { ...state, errors: {} };
    case 'reset_touched':
      return { ...state, touched: {} };
    default:
      return state;
  }
};

const initialState = {
  submitted: false,
  touched: {},
  errors: {},
};

export type UseFormConfig<TValues extends FormValues<any> = FormValues<any>> = {
  initialValues: TValues;
  validation?: Validation<TValues>;
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
  registerField: RegisterField<TValues>;
  values: FormValues<TValues>;
  errors: FormErrors<TValues>;
  touched: FormTouched<TValues>;
  valid: boolean;
  submitted: boolean;
};

export const useForm = <TValues extends FormValues<any> = FormValues<any>>({
  initialValues,
  validation,
}: UseFormConfig<TValues>): UseForm<TValues> => {
  const [{ values, errors, touched, submitted }, dispatch] = useReducer(reducer, {
    values: initialValues,
    ...initialState,
  });

  /* --------------Field validation-------------- */
  const debounceFns = useDebouncedValidation(validation, dispatch);

  const validateField = (name: keyof TValues, value: any) => {
    const formValues = { [name]: value } as TValues;
    const { errors } = validation?.schema(formValues) ?? {};
    return errors?.[name];
  };

  const handleBlurValidateField = (fieldName: keyof TValues, value: any) => {
    const error = validateField(fieldName, value);
    dispatch({ type: 'validate', payload: { [fieldName]: error } });
  };

  const handleChangeValidateField = (fieldName: keyof TValues, value: any) => {
    const error = validateField(fieldName, value);

    const validationInFn = debounceFns.current?.in;
    const validationOutFn = debounceFns.current?.out;

    if (error) {
      validationInFn?.(fieldName, error);
      if (validationOutFn && 'cancel' in validationOutFn) {
        validationOutFn?.cancel();
      }
    }

    if (!error) {
      errors[fieldName as keyof typeof errors] && validationOutFn?.(fieldName, undefined);
      if (validationInFn && 'cancel' in validationInFn) {
        validationInFn?.cancel();
      }
    }
  };

  const valid = useMemo(() => {
    if (!validation) return true;
    const { errors } = validation.schema(values);
    return !Object.entries(errors).length;
  }, [validation, values]);

  /* --------------Form handlers-------------- */
  const onReset = useEventCallback(() => {
    dispatch({
      type: 'reset',
      payload: { ...initialState, values: initialValues },
    });
  });

  const onSubmit = useEventCallback((handler: (formValues: TValues) => void) => (e: FormEvent) => {
    e.preventDefault();

    if (validation && getValidationType(validation.type) === 'submit') {
      const { errors: validationErrors } = validation.schema(values);
      dispatch({ type: 'submit_validate', payload: validationErrors });
      if (Object.keys(validationErrors).length) return;
    }

    dispatch({ type: 'submit' });
    handler(values);
  });

  const onChange: ChangeEventHandler<HTMLInputElement> = useEventCallback((e) => {
    const { value, type, name } = e.target ?? {};
    const currentValue = type === 'number' && !!value ? Number(value) : value;
    dispatch({ type: 'change', payload: { [name]: currentValue } });
    if (validation && getValidationType(validation.type) === 'change') {
      handleChangeValidateField(name, value);
    }
  });

  const onBlur: FocusEventHandler<HTMLInputElement> = useEventCallback((e) => {
    const name = e.target.name;
    if (validation && getValidationType(validation.type) === 'blur') {
      handleBlurValidateField(name, values[name]);
    }
    if (touched[name as keyof typeof touched]) return;
    dispatch({ type: 'blur', payload: { [name]: true } });
  });

  /* --------------Form and field utils-------------- */
  const resetValues = useCallback(() => {
    dispatch({ type: 'reset_values', payload: initialValues });
  }, [initialValues]);

  const resetErrors = useCallback(() => {
    dispatch({ type: 'reset_errors' });
  }, []);

  const resetTouched = useCallback(() => {
    dispatch({ type: 'reset_touched' });
  }, []);

  const setFieldValue: SetValue<TValues, keyof TValues> = useCallback(
    (name, value, shouldValidate = true) => {
      const formValue = { [name]: value } as TValues;
      dispatch({ type: 'change', payload: formValue });
      if (validation && shouldValidate) {
        const { errors: validationErrors } = validation.schema(formValue);
        validationErrors?.[name] &&
          dispatch({ type: 'validate', payload: { [name]: validationErrors[name] } });
      }
    },
    [validation]
  );
  const setFieldsValues: SetValues<TValues> = useCallback(
    (values, shouldValidation = true) => {
      dispatch({ type: 'change', payload: values });

      if (shouldValidation && validation) {
        const { errors: validationErrors } = validation.schema(values as TValues);
        const errorKeys = Object.keys(validationErrors);
        if (errorKeys.length) {
          const fieldNames = Object.keys(values);
          const newErrors = fieldNames.reduce((acc, curr) => {
            if (errorKeys.find((key) => fieldNames.includes(key))) {
              acc[curr as keyof TValues] = validationErrors[curr] as string;
            }
            return acc;
          }, {} as Record<keyof TValues, string>);
          dispatch({ type: 'validate', payload: newErrors });
        }
      }
    },
    [validation]
  );

  const setFieldError: SetError<TValues> = useCallback((name, value) => {
    dispatch({ type: 'validate', payload: { [name]: value } });
  }, []);

  const setFieldsErrors: SetErrors<TValues> = useCallback((errors) => {
    dispatch({ type: 'validate', payload: errors });
  }, []);

  const setFieldTouched: SetFieldTouched<TValues> = useCallback((name, value) => {
    dispatch({ type: 'blur', payload: { [name]: value } });
  }, []);

  const setFieldsTouched: SetTouched<TValues> = useCallback((touched) => {
    dispatch({ type: 'blur', payload: touched });
  }, []);

  const registerField: RegisterField<TValues> = useCallback(
    (fieldName, options) => ({
      name: fieldName as string,
      value: values[fieldName],
      onChange,
      onBlur,
      ...options,
    }),
    [onBlur, onChange, values]
  );

  return {
    onSubmit,
    onReset,
    values,
    errors,
    touched,
    submitted,
    valid,
    resetErrors,
    resetTouched,
    resetValues,
    setFieldValue,
    setFieldsValues,
    setFieldError,
    setFieldsErrors,
    setFieldTouched,
    setFieldsTouched,
    registerField,
  };
};
