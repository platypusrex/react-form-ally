import React, { useEffect } from 'react';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { UserRegistrationForm, userRegistrationForm } from '../../sharedForms';

export const StepFormOne: React.FC = () => {
  const { registerInput, errors, onSubmit, onReset, valid, setFieldValue } = userRegistrationForm();

  useEffect(() => {
    setFieldValue('name', 'Frank');
  }, []);

  const handleSubmit = (formValues: UserRegistrationForm) => {
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
        <h1>Zod</h1>
      </div>
      <form className="form" onSubmit={onSubmit(handleSubmit)} onReset={onReset}>
        <div className="form-container">
          <TextField
            label="name"
            error={errors.name}
            {...registerInput('name', { type: 'text', id: 'name' })}
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
        </div>
        <Button disabled={!valid} href="/step-form-two" style={{ marginBottom: 20 }}>
          Next
        </Button>
      </form>
    </div>
  );
};
