import { useForm } from '@react-form-ally/hook';

const validationTypes = ['change', 'blur', 'submit'] as const;
const inputTypes = ['uncontrolled', 'controlled'] as const;

export type FormControlValues = {
  inputType: (typeof inputTypes)[number];
  validationType: (typeof validationTypes)[number];
  debounce: boolean;
  debounceIn?: number;
  debounceOut?: number;
};

const initialValues = {
  inputType: 'uncontrolled',
  validationType: 'change',
  debounce: false,
  debounceIn: undefined,
  debounceOut: undefined,
} as const;

export const useFormControls = () =>
  useForm<FormControlValues>({
    input: {
      initialValues,
      type: 'uncontrolled',
    },
  });
