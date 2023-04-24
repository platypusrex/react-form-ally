import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { Debounce, FormErrors, FormValues } from '../types';
import { getDebounceTimers, debounce } from '../utils';
import { DebouncedFunc } from '../types';

export type DebounceState<TValue> = {
  [key in keyof Debounce]: {
    [key in keyof TValue]: any;
  };
};

type ValidateFieldArgs<TValues extends FormValues<any>> = {
  validationSchema?: any; //ValidationSchema<TValues>;
  debouncers?: {
    in: Record<keyof TValues, any>;
    out: Record<keyof TValues, any>;
  };
  name: string;
  value: any;
  errors: FormErrors<TValues>;
  setErrors: Dispatch<SetStateAction<FormErrors<TValues>>>;
};
export const validateField = <TValues extends FormValues<any>>({
  validationSchema,
  name,
  value,
  errors,
  setErrors,
  debouncers,
}: ValidateFieldArgs<TValues>): void => {
  if (!validationSchema || !debouncers) {
    return;
  }

  const fieldName = name as keyof TValues;
  const debounceIn = debouncers.in[fieldName];
  const debounceOut = debouncers.out[fieldName];

  validationSchema
    .validateAt(name, {
      [fieldName]: value,
    })
    .then(() => {
      if (errors[fieldName]) {
        debounceOut(name, undefined, setErrors);
      }

      if (debounceIn.cancel) {
        debounceIn.cancel();
      }
    })
    .catch((err: any) => {
      if (errors[fieldName] !== err.message) {
        debounceIn(name, err.message, setErrors);
      }

      if (debounceOut.cancel) {
        debounceOut.cancel();
      }
    });
};

export const getInitialValidationState = <TValues extends FormValues<any>>(
  validationSchema?: any //ValidationSchema<TValues>
): { [key in keyof TValues]: undefined } => {
  const fields = validationSchema?.describe().fields;

  if (!fields) {
    // @ts-ignore
    return {};
  }

  return Object.keys(fields).reduce((acc, curr) => {
    const field = curr as keyof TValues;
    acc[field] = undefined;
    return acc;
  }, {} as { [key in keyof TValues]: undefined });
};

export function handleValidationStateUpdate<TState>(
  name: string,
  value: any,
  updateState: Dispatch<SetStateAction<TState>>
): void {
  updateState((prevState) => ({
    ...prevState,
    [name]: value,
  }));
}

export const getInitialDebounceState = <TValues extends FormValues<any>>(
  debounceTiming: Debounce,
  validationSchema?: any //ValidationSchema<TValues>
): DebounceState<TValues> | undefined => {
  if (!validationSchema) {
    return;
  }

  return Object.keys(debounceTiming).reduce((acc, curr) => {
    const timing = debounceTiming[curr as keyof typeof debounceTiming];
    acc[curr] = Object.keys(validationSchema.describe().fields).reduce((acc, curr) => {
      acc[curr] = debounceValidationFn(timing);
      return acc;
    }, {} as any);
    return acc;
  }, {} as any);
};

export const debounceValidationFn = (timing: number): DebouncedFunc<any> | any =>
  timing
    ? debounce((name, errorMessage, setErrors) => {
        handleValidationStateUpdate(name, errorMessage, setErrors);
      }, timing)
    : (name: any, errorMessage: string, setErrors: any) =>
        handleValidationStateUpdate(name, errorMessage, setErrors);

export interface UseValidation {
  handleFieldValidation: (name: string, value: any) => void;
}

export const useValidation = <TValues extends FormValues<any>>(
  validation?: any //ChangeValidation<TValues>
): UseValidation => {
  const { schema: validationSchema, debounce } = validation ?? {};
  const schemaRef = useRef(validationSchema);
  const debounceTimers = useRef<Debounce>(getDebounceTimers(debounce) ?? 0);
  const initialValidationState = getInitialValidationState<TValues>(validationSchema);
  const initialDebounceState = getInitialDebounceState<TValues>(
    debounceTimers.current,
    validationSchema
  );

  const [errors, setErrors] = useState<FormErrors<TValues>>(initialValidationState);

  const debouncers = useRef<DebounceState<TValues> | undefined>(initialDebounceState);

  useEffect(() => {
    // diff validationSchema against schema stored in ref
    // if the schema has changed since initial render, reset debouncers and update validationSchema
    const fields = validationSchema ? Object.keys(validationSchema.fields) : [];
    const fieldsRef = schemaRef.current ? Object.keys(schemaRef.current.fields) : [];
    if (!fields.every((val, i) => val === fieldsRef[i])) {
      debouncers.current = getInitialDebounceState(debounceTimers.current, validationSchema);
      schemaRef.current = validationSchema;
    }
  }, [validationSchema]);

  const handleFieldValidation = useCallback(
    (name: string, value: any) => {
      if (Reflect.has(initialValidationState, name)) {
        validateField<TValues>({
          validationSchema,
          name,
          value,
          errors,
          setErrors,
          // @ts-ignore
          debouncers: debouncers.current,
        });
      }
    },
    [errors, initialValidationState, validationSchema]
  );

  return { handleFieldValidation };
};
