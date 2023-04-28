import React, { useEffect } from 'react';
import { useForm, validator, ValidatorSchema } from '@react-form-ally/hook';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { FormControls, useFormControls } from '../../components/FormControls';

type FormValues = {
  name: string;
  website?: string;
  street?: string;
  email: string;
  password: string;
};

const initialValues = {
  name: '',
  website: '',
  street: '',
  email: '',
  password: '',
};

const schema: ValidatorSchema<FormValues> = {
  name: {
    isRequired: { message: 'You must provide your name' },
    isOneOf: { values: ['Jack', 'Jay', 'Jim', 'Jarod', 'Jason'] },
  },
  website: { isUrl: true },
  street: { isRequired: true },
  email: { isRequired: true, isEmail: true },
  password: { isRequired: true, equals: { value: '123123' } },
};

export const DefaultValidator: React.FC = () => {
  const formControls = useFormControls();
  const {
    values: { validationType, debounce, debounceIn, debounceOut },
  } = formControls;

  const { registerInput, errors, valid, onSubmit, onReset, setFieldsValues, focusField } =
    useForm<FormValues>({
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
        schema: validator(schema),
      },
    });

  useEffect(() => {
    focusField('name');
    setFieldsValues({ name: 'Frank', password: 'password' });
  }, []);

  const handleSubmit = (formValues: FormValues) => {
    alert(JSON.stringify(formValues, null, 2));
  };

  const handleSubmitFormConfig = () => {
    onReset();
  };

  return (
    <div className="form-page">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '2.2rem',
        }}
      >
        <h1>Default</h1>
        <FormControls handleSubmit={handleSubmitFormConfig} {...formControls} />
      </div>
      <form className="form" onSubmit={onSubmit(handleSubmit)} onReset={onReset}>
        <div className="form-container">
          <TextField
            label="name"
            error={errors.name}
            {...registerInput('name', { id: 'name', type: 'text' })}
          />
          <TextField
            label="website"
            error={errors.website}
            {...registerInput('website', { id: 'website', type: 'url' })}
          />
          <TextField
            label="email"
            error={errors.email}
            {...registerInput('email', { id: 'email', type: 'email' })}
          />
          <TextField
            label="password"
            error={errors.password}
            {...registerInput('password', { id: 'password', type: 'password' })}
          />
          <TextField
            label="street"
            error={errors.street}
            {...registerInput('street', { id: 'street', type: 'text' })}
          />
        </div>
        <Button disabled={!valid && validationType !== 'submit'} style={{ marginBottom: 20 }}>
          Submit
        </Button>
        <Button type="reset">Reset</Button>
      </form>
    </div>
  );
};
