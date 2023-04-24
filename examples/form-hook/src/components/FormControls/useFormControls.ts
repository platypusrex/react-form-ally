import { useForm } from '../../form-hook';

const validationTypes = ['change', 'blur', 'submit'] as const;

export type FormControlValues = {
  validationType: (typeof validationTypes)[number];
  debounce: boolean;
  debounceIn?: number;
  debounceOut?: number;
};

const initialValues = {
  validationType: 'change',
  debounce: false,
  debounceIn: undefined,
  debounceOut: undefined,
} as const;

export const useFormControls = () =>
  useForm<FormControlValues>({
    initialValues,
    validation: {
      type: 'submit',
      schema: () => ({ errors: {} }),
    },
  });
