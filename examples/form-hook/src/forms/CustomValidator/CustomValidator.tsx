import React, { useEffect } from 'react';
import { useForm } from '@react-form-ally/hook';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { FormControls, useFormControls } from '../../components/FormControls';

const initialValues = {
  name: '',
  website: '',
  street: '',
  email: '',
  password: '',
};

export const CustomValidator: React.FC = () => {
  const formControls = useFormControls();
  const {
    values: { validationType, debounce, debounceIn, debounceOut },
  } = formControls;

  const { registerInput, errors, onSubmit, onReset, valid, setFieldValue } = useForm<
    typeof initialValues
  >({
    input: {
      initialValues,
      type: 'uncontrolled',
    },
    validation: {
      type: validationType,
      ...(validationType === 'change' && debounce
        ? {
            debounce: {
              in: debounceIn ? Number(debounceIn) : 0,
              out: debounceOut ? Number(debounceOut) : 0,
            },
          }
        : {}),
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
    setFieldValue('name', 'Frank');
  }, []);

  const handleSubmit = (formValues: typeof initialValues) => {
    alert(JSON.stringify(formValues, null, 2));
  };

  const handleSubmitFormConfig = () => {
    onReset();
  };

  return (
    <div className="form-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Custom</h1>
        <FormControls handleSubmit={handleSubmitFormConfig} {...formControls} />
      </div>
      <form className="form" onSubmit={onSubmit(handleSubmit)} onReset={onReset}>
        <div className="form-container">
          <TextField
            label="name"
            error={errors.name}
            {...registerInput('name', { type: 'text', id: 'name' })}
          />
          <TextField
            label="website"
            error={errors.website}
            {...registerInput('website', { type: 'url', id: 'website' })}
          />
          <TextField
            label="email"
            error={errors.email}
            {...registerInput('email', { type: 'email', id: 'email' })}
          />
          <TextField
            label="password"
            error={errors.password}
            {...registerInput('password', { type: 'password', id: 'password' })}
          />
          <TextField
            label="street"
            error={errors.street}
            {...registerInput('street', { type: 'text', id: 'street' })}
          />
        </div>
        <Button
          disabled={!valid && formControls.values.validationType !== 'submit'}
          style={{ marginBottom: 20 }}
        >
          Submit
        </Button>
        <Button type="reset">Reset</Button>
      </form>
    </div>
  );
};
