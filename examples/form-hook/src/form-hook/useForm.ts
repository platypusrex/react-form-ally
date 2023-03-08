import {
  ChangeEventHandler,
  FocusEventHandler,
  FormEvent,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { debounce } from './utils';

type FormValues<TValues extends { [key: string]: any }> = {
  [K in keyof TValues]: TValues[K];
};

type BaseFieldValidation = {
  message?: string;
};

type OneOfFieldValidation = BaseFieldValidation & {
  values: (string | number)[];
};

type LengthFieldValidation = BaseFieldValidation & {
  length: number;
};

type EqualsFieldValidation = BaseFieldValidation & {
  value: string | number;
};

type PatternFieldValidation = BaseFieldValidation & {
  regex: RegExp;
};

export type FieldValidation = {
  isRequired?: boolean | BaseFieldValidation;
  isEmail?: boolean | BaseFieldValidation;
  isUrl?: boolean | BaseFieldValidation;
  isOneOf?: OneOfFieldValidation;
  max?: LengthFieldValidation;
  min?: LengthFieldValidation;
  equals?: EqualsFieldValidation;
  pattern?: PatternFieldValidation;
};

export type ValidatorSchema<TValues extends FormValues<any>> = {
  [K in keyof TValues]?: FieldValidation;
};

export type ValidatorResult<TValues extends FormValues<any>> = {
  errors: {
    [K in keyof TValues]?: string;
  };
};

type BaseValidation<TValues extends FormValues<any>> = {
  schema: (values: TValues) => ValidatorResult<TValues>;
};

type ChangeValidation<TValues extends FormValues<any>> = BaseValidation<TValues> & {
  type?: 'change';
  debounce?: number | { in: number; out: number };
};

type BlurValidation<TValues extends FormValues<any>> = BaseValidation<TValues> & {
  type?: 'blur';
};

type SubmitValidation<TValues extends FormValues<any>> = BaseValidation<TValues> & {
  type?: 'submit';
};

type Validation<TValues extends FormValues<any>> =
  | ChangeValidation<TValues>
  | BlurValidation<TValues>
  | SubmitValidation<TValues>;

type UseFormConfig<TValues extends FormValues<any> = FormValues<any>> = {
  initialValues: TValues;
  validation?: Validation<TValues>;
};

type RegisterField = {
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  value: string | number;
};

type RegisterFieldOptions = {
  id?: string;
};

type SetValue<TValues extends FormValues<any>, K extends keyof TValues> = (
  name: K,
  value: TValues[K]
) => void;

type UseForm<TValues extends FormValues<any> = FormValues<any>> = {
  onSubmit: (handler: (formValues: TValues) => void) => (e: FormEvent) => void;
  reset: () => void;
  setValue: SetValue<TValues, keyof TValues>;
  setValues: (values: Partial<TValues>, shouldValidation?: boolean) => void;
  registerField: (fieldName: keyof TValues, options?: RegisterFieldOptions) => RegisterField;
  errors: { [K in keyof FormValues<TValues>]?: string };
  isValid: boolean;
  submitted: boolean;
};

type ChangeAction<TValues extends FormValues<any>> = {
  type: 'change';
  payload: Partial<TValues>;
};

type BlurAction<TValues extends FormValues<any>> = {
  type: 'blur';
  payload: { [K in keyof TValues]: boolean };
};

type ValidateAction<TValues extends FormValues<any>> = {
  type: 'validate';
  payload: { [K in keyof TValues]?: string };
};

type SubmitValidateAction<TValues extends FormValues<any>> = {
  type: 'submit_validate';
  payload: { [K in keyof TValues]?: string };
};

type ClearErrorAction<TValues extends FormValues<any>> = {
  type: 'clear_error';
  payload: keyof TValues;
};

type ResetAction<TValues extends FormValues<any>> = {
  type: 'reset';
  payload: State<TValues>;
};

type SubmitAction = {
  type: 'submit';
};

type Action<TValues extends FormValues<any>> =
  | ChangeAction<TValues>
  | BlurAction<TValues>
  | ValidateAction<TValues>
  | SubmitValidateAction<TValues>
  | ClearErrorAction<TValues>
  | ResetAction<TValues>
  | SubmitAction;

type State<TValues extends FormValues<any>> = {
  values: TValues;
  touched: { [K in keyof TValues]?: boolean };
  errors: { [K in keyof TValues]?: string };
  submitted: boolean;
};

interface DebouncedFunc<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;

  cancel(): void;

  flush(): ReturnType<T> | undefined;
}

export const validator =
  <TValues extends FormValues<any> = FormValues<any>>(schema: ValidatorSchema<TValues>) =>
  (values: TValues): ValidatorResult<TValues> => {
    const errors = {} as { [K in keyof TValues]?: string };
    for (const fieldName in schema) {
      const currentSchema = schema[fieldName] as FieldValidation;
      for (const validation in currentSchema) {
        const key = validation as keyof FieldValidation;
        const config = currentSchema[key] !== 'boolean' ? currentSchema[key] : undefined;
        const validator = validators[key](fieldName, values[fieldName], config);
        if (validator && !validator.valid) {
          errors[fieldName] = validator.message;
        }
      }
    }
    return { errors };
  };

// eslint-disable-next-line @typescript-eslint/ban-types
const validators: Record<keyof FieldValidation, Function> = {
  isRequired: (name: string, value: any, config?: BaseFieldValidation) => {
    if (!!value) return;
    return {
      valid: false,
      message: config?.message ?? `${name} is required.`,
    };
  },
  isEmail: (name: string, value: any, config?: BaseFieldValidation) => {
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!value || EMAIL_REGEX.test(value)) return;
    return {
      valid: false,
      message: config?.message ?? `${name} is not a valid email address.`,
    };
  },
  isUrl: (name: string, value: any, config?: BaseFieldValidation) => {
    const URL_REGEX =
      /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    if (!value || URL_REGEX.test(value)) return;
    return {
      valid: false,
      message: config?.message ?? `${name} is not a valid url.`,
    };
  },
  isOneOf: (name: string, value: any, config: OneOfFieldValidation) => {
    if (!value || config.values.includes(value)) return;
    return {
      valid: false,
      message: config.message ?? `${name} must match one of ${config.values.join(', ')}`,
    };
  },
  max: (name: string, value: any, config: LengthFieldValidation) => {
    if (!value || value.length <= config.length) return;
    return {
      valid: false,
      message: config?.message ?? `${name} must be no more than ${config.length} characters.`,
    };
  },
  min: (name: string, value: any, config: LengthFieldValidation) => {
    if (!value || value.length >= config.length) return;
    return {
      valid: false,
      message: config?.message ?? `${name} must be at least ${config.length} characters.`,
    };
  },
  equals: (name: string, value: any, config: EqualsFieldValidation) => {
    if (!value || value === config.value) return;
    return {
      valid: false,
      message: config?.message ?? `${value} is not equal to ${config.value}`,
    };
  },
  pattern: (name: string, value: any, config: PatternFieldValidation) => {
    if (!value || !config.regex.test(value)) return;
    return {
      valid: false,
      message: config?.message ?? `${name} is not valid.`,
    };
  },
};

const reducer = <TValues extends FormValues<any>>(
  state: State<TValues>,
  action: Action<TValues>
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
    case 'clear_error':
      delete state.errors[action.payload];
      return state;
    case 'reset':
      return { ...state, ...action.payload };
    case 'submit':
      return { ...state, submitted: true };
    default:
      return state;
  }
};

const initialState = {
  submitted: false,
  touched: {},
  errors: {},
};

export const useForm = <TValues extends FormValues<any> = FormValues<any>>({
  initialValues,
  validation,
}: UseFormConfig<TValues>): UseForm<TValues> => {
  const [{ values, errors, touched, submitted }, dispatch] = useReducer(reducer, {
    values: initialValues,
    ...initialState,
  });

  const getDebounceTimers = (fieldDebounce?: ChangeValidation<any>['debounce']) => {
    if (!fieldDebounce) return null;
    return typeof fieldDebounce === 'number'
      ? { in: fieldDebounce, out: fieldDebounce }
      : fieldDebounce;
  };

  const getFieldValidationDebounceFns = (
    validation?: Validation<TValues>
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): undefined | { in: DebouncedFunc<any> | Function; out: DebouncedFunc<any> | Function } => {
    if (!validation || validation.type !== 'change') return;

    const validationFn = (fieldName: keyof TValues, error: any) => {
      dispatch({ type: 'validate', payload: { [fieldName]: error } });
    };

    const { debounce: fieldDebounce } = validation;
    const debounceTimers = getDebounceTimers(fieldDebounce);

    return {
      in: debounceTimers ? debounce(validationFn, debounceTimers.in) : validationFn,
      out: debounceTimers ? debounce(validationFn, debounceTimers.out) : validationFn,
    };
  };

  const debounceFns = useRef(getFieldValidationDebounceFns(validation));

  const isValid = useMemo(() => {
    if (!validation) return true;
    const { errors } = validation.schema(values);
    return !Object.entries(errors).length;
  }, [values]);

  const reset = useCallback(() => {
    dispatch({
      type: 'reset',
      payload: { ...initialState, values: initialValues },
    });
  }, []);

  const setValues = (values: Partial<TValues>, shouldValidation = true) => {
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
  };

  const setValue = <K extends keyof TValues>(name: K, value: TValues[K]) => {
    dispatch({ type: 'change', payload: { [name]: value } });
  };

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
      errors[fieldName] && validationOutFn?.(fieldName, undefined);
      if (validationInFn && 'cancel' in validationInFn) {
        validationInFn?.cancel();
      }
    }
  };

  const onSubmit = useCallback(
    (handler: (formValues: TValues) => void) => (e: FormEvent) => {
      e.preventDefault();

      if (validation && validation.type === 'submit') {
        const { errors: validationErrors } = validation.schema(values);
        dispatch({ type: 'submit_validate', payload: validationErrors });
        if (Object.keys(validationErrors).length) return;
      }

      dispatch({ type: 'submit' });
      handler(values);
    },
    [values]
  );

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    dispatch({ type: 'change', payload: { [e.target.name]: value } });
    if (validation && validation.type === 'change') {
      handleChangeValidateField(e.target.name, value);
    }
  };

  const onBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    const name = e.target.name;
    if (validation && validation.type === 'blur') {
      handleBlurValidateField(name, values[name]);
    }
    if (touched[name]) return;
    dispatch({ type: 'blur', payload: { [name]: true } });
  };

  const registerField = (fieldName: keyof TValues) => ({
    name: fieldName as string,
    value: values[fieldName],
    onChange,
    onBlur,
  });

  return {
    onSubmit,
    reset,
    setValues,
    setValue,
    errors,
    isValid,
    submitted,
    registerField,
  };
};
