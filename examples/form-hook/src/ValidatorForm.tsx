import React, { useEffect } from 'react';
import {
  Debounce,
  useForm,
  ValidationType,
  validator,
  ValidatorSchema,
} from '@react-form-ally/hook';
import { TextField } from './components/TextField';
import { Button } from './components/Button';

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
  street: {
    pattern: {
      regex: /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i,
      message: 'P.O. box is not allowed',
    },
  },
  email: { isRequired: true, isEmail: true },
  password: { isRequired: true, equals: { value: '123123' } },
};

interface ValidationFormProps {
  type: ValidationType;
  debounce: Debounce;
}

export const ValidatorForm: React.FC<ValidationFormProps> = ({ type, debounce }) => {
  const { registerField, errors, onSubmit, onReset, valid, setValues } = useForm<FormValues>({
    initialValues,
    validation: {
      type,
      schema: validator(schema),
      ...(type === 'change' ? { debounce } : {}),
    },
  });

  useEffect(() => {
    setValues({ name: 'Frank' });
  }, []);

  const handleSubmit = (formValues: FormValues) => {
    alert(JSON.stringify(formValues, null, 2));
  };

  return (
    <form className="form" onSubmit={onSubmit(handleSubmit)} onReset={onReset}>
      <h1>Default</h1>
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
