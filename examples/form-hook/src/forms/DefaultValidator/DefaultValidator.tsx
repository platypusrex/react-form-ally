import React from 'react';
import { validator, ValidatorSchema } from '../../form-hook';
import { useForm2 } from '../../form-hook/useForm2';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';

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
  const { registerInput, errors, valid, values, onSubmit, onReset } = useForm2<FormValues>({
    input: {
      initialValues,
      type: 'uncontrolled',
    },
    validation: {
      type: 'change',
      debounce: {
        in: 1000,
        out: 0,
      },
      schema: validator(schema),
    },
  });

  const handleSubmit = (formValues: FormValues) => {
    alert(JSON.stringify(formValues, null, 2));
  };

  console.log('rendered', values, errors);

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
      </div>
      <form className="form" onSubmit={onSubmit(handleSubmit)} onReset={onReset}>
        <div className="form-container">
          <TextField
            label="name"
            id="name"
            type="text"
            error={errors.name}
            {...registerInput('name')}
          />
          <TextField
            label="website"
            id="website"
            type="url"
            error={errors.website}
            {...registerInput('website')}
          />
          <TextField
            label="email"
            id="email"
            type="email"
            error={errors.email}
            {...registerInput('email')}
          />
          <TextField
            label="password"
            id="password"
            type="password"
            error={errors.password}
            {...registerInput('password')}
          />
          <TextField
            label="street"
            id="street"
            type="text"
            error={errors.street}
            {...registerInput('street')}
          />
        </div>
        <Button disabled={!valid} style={{ marginBottom: 20 }}>
          Submit
        </Button>
        <Button type="reset">Reset</Button>
      </form>
    </div>
  );
};
