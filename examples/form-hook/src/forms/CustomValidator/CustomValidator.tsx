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
  const { registerField, errors, onSubmit, onReset, valid, setFieldValue } = useForm<
    typeof initialValues
  >({
    initialValues,
    validation: {
      // @ts-ignore
      type: formControls.values.validationType,
      ...(formControls.values.validationType === 'change'
        ? { debounce: { in: formControls.values.debounceIn, out: formControls.values.debounceOut } }
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

  return (
    <div className="form-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Custom</h1>
        <FormControls {...formControls} />
      </div>
      <form className="form" onSubmit={onSubmit(handleSubmit)} onReset={onReset}>
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
