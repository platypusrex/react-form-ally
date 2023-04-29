import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from '@react-form-ally/hook';
import { zodValidator } from '@react-form-ally/zod-validator';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { FormControls, useFormControls } from '../../components/FormControls';

const POBoxRegex = /(P(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box))/i;
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
    .custom((val) => !POBoxRegex.test(val as string), 'No PO box allowed')
    .optional()
    .or(z.literal('')),
  email: z.string().min(1, 'email is required').email(),
  password: z
    .string()
    .min(1, 'password is required')
    .regex(/\b123123\b/, 'password has to match 123123'),
});

const initialValues = {
  name: '',
  website: '',
  street: '',
  email: '',
  password: '',
};

export const ZodValidator: React.FC = () => {
  const formControls = useFormControls();
  const {
    values: { validationType, debounce, debounceIn, debounceOut },
  } = formControls;

  const { registerInput, errors, onSubmit, onReset, valid, setFieldValue } = useForm<
    z.infer<typeof schema>
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
      schema: zodValidator(schema),
    },
  });

  useEffect(() => {
    setFieldValue('name', 'Frank');
  }, []);

  const handleSubmit = (formValues: z.infer<typeof schema>) => {
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
        <h1>Zod</h1>
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
