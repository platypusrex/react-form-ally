import { FormInput, FormValues, Validation } from '../types';

export const getSharedFormState = <TValues extends FormValues<any> = FormValues<any>>(
  input: FormInput<TValues>,
  validation?: Validation<TValues>
) => {
  const { initialValues, type: _inputType } = input;
  const { schema, type: _validationType } = validation ?? {};

  const isControlled = _inputType === 'controlled';
  const validationType = _validationType ?? 'change';

  const fieldRefs = {} as { [key in keyof TValues]: any };

  return {
    initialValues,
    schema,
    isControlled,
    validationType,
    fieldRefs,
  };
};
