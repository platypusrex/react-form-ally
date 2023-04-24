import React, { useEffect, useRef } from 'react';
import { validator, ValidatorSchema } from '../../form-hook';
import { useForm2 } from '../../form-hook/useForm2';
import { SelectField } from '../../components/SelectField';
import { FormControls, useFormControls } from '../../components/FormControls';
import { Button } from '../../components/Button';
import styles from './style.module.css';

type FormValues = {
  saveProfile: boolean;
  favoriteFood: string;
  favoriteNumber: string;
};

const initialValues = {
  saveProfile: false,
  favoriteFood: '',
  favoriteNumber: '',
};

const schema: ValidatorSchema<FormValues> = {
  favoriteFood: { isRequired: true },
  favoriteNumber: { isRequired: true },
};

export const CheckboxAndRadio: React.FC = () => {
  const formControls = useFormControls();
  const { onSubmit, onReset, registerInput, registerCheckbox, registerRadio, valid, values } =
    useForm2<FormValues>({
      input: {
        initialValues,
        type: 'uncontrolled',
      },
      validation: {
        type: 'blur',
        ...(formControls.values.validationType === 'change'
          ? {
              debounce: {
                in: formControls.values.debounceIn,
                out: formControls.values.debounceOut,
              },
            }
          : {}),
        schema: validator(schema),
      },
    });

  console.log('rendered', { ...values, valid });

  // useEffect(() => {
  //   onReset();
  //   // @ts-ignore
  // }, [formControls.values.validationType]);

  const handleSubmit = (values: FormValues) => {
    alert(JSON.stringify(values, null, 2));
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
        <h1>Checkbox/Radio</h1>
        <FormControls {...formControls} />
      </div>
      <form className="form" onSubmit={onSubmit(handleSubmit)} onReset={onReset}>
        <div className={styles.inputGroup}>
          <h3>Your favorite food:</h3>
          <label htmlFor="radio-pizza">
            <input
              {...registerRadio('favoriteFood', {
                value: 'pizza',
                type: 'radio',
                id: 'radio-pizza',
              })}
            />
            Pizza
          </label>
          <label htmlFor="radio-french-fries">
            <input
              {...registerRadio('favoriteFood', {
                value: 'frenchFries',
                type: 'radio',
                id: 'radio-french-fries',
              })}
            />
            French Fries
          </label>
          <label htmlFor="radio-burgers">
            <input
              {...registerRadio('favoriteFood', {
                value: 'burgers',
                type: 'radio',
                id: 'radio-burgers',
              })}
            />
            Burgers
          </label>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="save-profile">
            <input {...registerCheckbox('saveProfile', { type: 'checkbox', id: 'save-profile' })} />
            Save profile?
          </label>
        </div>
        <SelectField
          label="Favorite number"
          options={[
            { value: 'one', name: 'One' },
            { value: 'two', name: 'Two' },
            { value: 'three', name: 'Three' },
          ]}
          {...registerInput('favoriteNumber', { id: 'favorite-number' })}
        />
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
