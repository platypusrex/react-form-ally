import { z, ZodError } from 'zod';

type FormValues = { [key: string]: any };

const parseErrorSchema = <TValues extends FormValues>(zodErrors: z.ZodIssue[]) => {
  const errors = {} as Record<keyof TValues, string>;
  for (let i = 0; i < zodErrors.length; i++) {
    const error = zodErrors[i];
    const { message, path } = error;
    const fieldName = path[0];

    if (!errors[fieldName]) {
      errors[fieldName as keyof TValues] = message;
    }
  }
  return errors;
};

export const zodValidator =
  <TValues extends FormValues>(schema: z.Schema) =>
  (values: TValues) => {
    let errors = {};
    try {
      schema.parse(values);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        errors = e.isEmpty ? {} : parseErrorSchema<TValues>(e.errors);
      }
    }
    return { errors };
  };
