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
  const { registerField, errors, onSubmit, onReset, valid } = useForm<InferType<typeof schema>>({
    initialValues,
    validation: {
      // @ts-ignore
      type: formControls.values.validationType,
      ...(formControls.values.validationType === 'change'
        ? { debounce: { in: formControls.values.debounceIn, out: formControls.values.debounceOut } }
        : {}),
      schema: yupValidator(schema),
    },
  });

  const handleSubmit = (formValues: InferType<typeof schema>) => {
    alert(JSON.stringify(formValues, null, 2));
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
