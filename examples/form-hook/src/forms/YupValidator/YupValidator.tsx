import React from 'react';
import { object, string, InferType } from 'yup';
import { useForm } from '@react-form-ally/hook';
import { yupValidator } from '@react-form-ally/yup-validator';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { FormControls, useFormControls } from '../../components/FormControls';

const POBoxRegex = /\bP(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)\b/i;
const allowedNames = ['Jack', 'Jay', 'Jim', 'Jarod', 'Jason'];

const schema = object({
  name: string()
    .required()
    .test('name match', `name must match one of the following: ${allowedNames.join(', ')}`, (val) =>
      allowedNames.some((name) => name === val)
    ),
  website: string().optional().url(),
  street: string()
    .optional()
    .test('no-po-box', 'P.O. box is not allowed', (value) => !POBoxRegex.test(value!)),
  email: string().email().required(),
  password: string()
    .required()
    .test('password match', 'password must match 123123', (val) => val === '123123'),
});

const initialValues = {
  name: '',
  website: '',
  street: '',
  email: '',
  password: '',
};

export const YupValidator: React.FC = () => {
  const formControls = useFormControls();
  const {
    values: { validationType, debounce, debounceIn, debounceOut },
  } = formControls;

  const { registerInput, errors, onSubmit, onReset, valid, setFieldValue } = useForm<
    InferType<typeof schema>
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
      schema: yupValidator(schema),
    },
  });

  const handleSubmit = (formValues: InferType<typeof schema>) => {
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
        <h1>Yup</h1>
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
        <Button disabled={!valid && validationType !== 'submit'} style={{ marginBottom: 20 }}>
          Submit
        </Button>
        <Button type="reset">Reset</Button>
      </form>
    </div>
  );
};
