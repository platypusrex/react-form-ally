import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from '@react-form-ally/hook';
import { zodValidator } from '@react-form-ally/zod-validator';
import { TextField } from './components/TextField';
import { Button } from './components/Button';

const POBoxRegex = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
const allowedNames = ['Jack', 'Jay', 'Jim', 'Jarod', 'Jason'];

const schema = z.object({
  name: z
    .string()
    .min(1, 'name is required')
    .refine(
      (val) => allowedNames.some((name) => name === val),
      `name has to match one of the following: ${allowedNames.join(', ')}`
    ),
  website: z.string().url().optional().or(z.literal('')),
  street: z
    .custom((val) => !POBoxRegex.test(val as string), { message: 'No PO box allowed' })
    .optional()
    .or(z.literal('')),
  email: z.string().min(1, 'email is required').email(),
  password: z
    .string()
    .min(1, 'password is required')
    .regex(/123123/, 'password has to match 123123'),
});

const initialValues = {
  name: '',
  website: '',
  street: '',
  email: '',
  password: '',
};

interface ZodValidationFormProps {
  type: 'change' | 'blur' | 'submit';
  debounce: number | { in: number; out: number };
}

export const ZodValidatorForm: React.FC<ZodValidationFormProps> = ({ type, debounce }) => {
  const { registerField, errors, onSubmit, onReset, valid, setValue } = useForm<
    z.infer<typeof schema>
  >({
    initialValues,
    validation: {
      type,
      ...(type === 'change' ? { debounce } : {}),
      schema: zodValidator(schema),
    },
  });

  useEffect(() => {
    setValue('name', 'Frank');
  }, []);

  const handleSubmit = (formValues: z.infer<typeof schema>) => {
    alert(JSON.stringify(formValues, null, 2));
  };

  return (
    <form className="form" onSubmit={onSubmit(handleSubmit)} onReset={onReset}>
      <h1>Zod</h1>
      <div className="form-container">
        <TextField
          label="name"
          id="name"
          type="text"
          error={errors.name}
          {...registerField('name')}
        />
        <TextField
          label="website"
          id="website"
          type="url"
          error={errors.website}
          {...registerField('website')}
        />
        <TextField
          label="email"
          id="email"
          type="email"
          error={errors.email}
          {...registerField('email')}
        />
        <TextField
          label="password"
          id="password"
          type="password"
          error={errors.password}
          {...registerField('password')}
        />
        <TextField
          label="street"
          id="street"
          type="text"
          error={errors.street}
          {...registerField('street')}
        />
      </div>
      <Button disabled={!valid && type !== 'submit'} style={{ marginBottom: 20 }}>
        Submit
      </Button>
      <Button type="reset">Reset</Button>
    </form>
  );
};
