import { ObjectSchema, ValidationError } from 'yup';

type FormValues = { [key: string]: any };

const parseErrorSchema = <TValues extends FormValues>(yupError: ValidationError) => {
  let errors = {} as Record<keyof TValues, string>;
  const validationErrors = yupError.inner;
  for (let i = 0; i < validationErrors.length; i++) {
    const { path, message } = validationErrors[i];
    const fieldName = path as keyof TValues;
    if (!errors[fieldName]) {
      errors[fieldName] = message;
    }
  }
  return errors;
};

export const yupValidator = <TValues extends FormValues>(
  schema: ObjectSchema<any>
) => (values: TValues) => {
  let errors = {} as Record<keyof TValues, string>;
  try {
    schema.validateSync(values, { abortEarly: false });
  } catch (e: unknown) {
    if (e instanceof ValidationError) {
      errors = parseErrorSchema(e)
    }
  }
  return { errors };
}
