import React, { useEffect } from 'react';
import { TextField } from './components/TextField';
import { Button } from './components/Button';
import { useForm } from './form-hook/useForm';

const initialValues = {
  name: '',
  website: '',
  street: '',
  email: '',
  password: '',
};

interface CustomValidationFormProps {
  type: 'change' | 'blur' | 'submit';
  debounce: number | { in: number; out: number };
}

export const CustomValidatorForm: React.FC<CustomValidationFormProps> = ({ type, debounce }) => {
  const { registerField, errors, onSubmit, reset, isValid, setValue } = useForm<
    typeof initialValues
  >({
    initialValues,
    validation: {
      type,
      ...(type === 'change' ? { debounce } : {}),
      schema: (values) => {
        const requiredKeys = ['name', 'email', 'password'];
        const errors = Object.keys(values).reduce((acc, curr) => {
          if (requiredKeys.includes(curr) && !values[curr as keyof typeof values]) {
            acc[curr] = `${curr} is required`;
          }
          return acc;
        }, {} as any);

        return { errors };
      },
    },
  });

  useEffect(() => {
    setValue('name', 'Frank');
  }, []);

  const handleSubmit = (formValues: typeof initialValues) => {
    alert(JSON.stringify(formValues, null, 2));
  };

  return (
    <form className="form" onSubmit={onSubmit(handleSubmit)} onReset={reset}>
      <h1>Custom</h1>
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
      <Button disabled={!isValid && type !== 'submit'} style={{ marginBottom: 20 }}>
        Submit
      </Button>
      <Button type="reset">Reset</Button>
    </form>
  );
};
