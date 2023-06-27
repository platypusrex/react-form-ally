import React from 'react';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { UserRegistrationForm, userRegistrationForm } from '../../sharedForms';
import styles from '../CheckboxAndRadio/style.module.css';

export const StepFormTwo: React.FC = () => {
  const { registerInput, registerCheckbox, errors, onSubmit, onReset, valid } =
    userRegistrationForm();

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
        <Button variant="link" href="/step-form-one">
          Back
        </Button>
      </div>
      <form className="form" onSubmit={onSubmit(handleSubmit)} onReset={onReset}>
        <TextField
          label="website"
          error={errors.website}
          {...registerInput('website', { type: 'url', id: 'website' })}
        />
        <TextField
          label="street"
          error={errors.street}
          {...registerInput('street', { type: 'text', id: 'street' })}
        />
        <div className={styles.inputGroup}>
          <label htmlFor="save-profile">
            <input {...registerCheckbox('saveProfile', { type: 'checkbox', id: 'save-profile' })} />
            Save profile?
          </label>
        </div>
        <Button disabled={!valid} style={{ marginBottom: 20 }}>
          Submit
        </Button>
        <Button type="reset">Reset</Button>
      </form>
    </div>
  );
};
