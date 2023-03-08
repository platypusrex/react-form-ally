import type { FormValues, FieldValidation, ValidatorResult, ValidatorSchema } from '../types';
import { validators } from './validators';

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
