import React, { useEffect, useState } from 'react';
import { useForm, ValidationType } from './form-hook';
import { Button } from './components/Button';
import { SelectField } from './components/SelectField';
import { TextField } from './components/TextField';
import { CustomValidatorForm } from './CustomValidatorForm';
import { ValidatorForm } from './ValidatorForm';
import { ZodValidatorForm } from './ZodValidatorForm';
import { YupValidatorForm } from './YupValidatorForm';
import './App.css';
import { FormField } from './components/FormField';

const validationTypes = ['change', 'blur', 'submit'] as const;

type FormValues = {
  validationType: (typeof validationTypes)[number];
  debounce: boolean;
  debounceIn?: number;
  debounceOut?: number;
};

const initialValues: FormValues = {
  validationType: 'change',
  debounce: false,
};
export const App = () => {
  const [activeLink, setActiveLink] = useState<string>('custom');
  const [drawerVisible, toggleDrawer] = useState(false);
  const { values, registerField, setFieldsValues } = useForm<FormValues>({ initialValues });

  const { id, name, onBlur, onChange } = registerField('debounce');

  useEffect(() => {
    if (values.debounce) {
      const formValues = {} as FormValues;
      if (!values.debounceIn) formValues.debounceIn = 500;
      if (!values.debounceOut) formValues.debounceOut = 0;
      if (Object.keys(formValues).length) {
        console.log(formValues);
        setFieldsValues(formValues);
      }
    }

    if (!values.debounce) {
      const formValues = {} as FormValues;
      if (values.debounceIn !== undefined) formValues.debounceIn = undefined;
      if (values.debounceOut !== undefined) formValues.debounceOut = undefined;
      if (Object.keys(formValues).length) {
        setFieldsValues(formValues);
      }
    }
  }, [values.debounce, values.debounceIn, values.debounceOut]);

  return (
    <div className="container">
      <button className="drawer-toggle" onClick={() => toggleDrawer((prevState) => !prevState)}>
        {drawerVisible ? 'Close drawer' : 'Configure form'}
      </button>
      <div className={`drawer-overlay ${drawerVisible ? 'visible' : ''}`} />
      <div className={`drawer ${drawerVisible ? 'visible' : ''}`}>
        <SelectField
          style={{ paddingBottom: 15, marginTop: 15 }}
          label="Validation type"
          id="validationType"
          {...registerField('validationType')}
          options={validationTypes.map((type) => ({ value: type, name: type }))}
        />

        {values.validationType === 'change' && (
          <>
            <FormField id="debounce" label="Debounce" style={{ paddingBottom: '1rem' }}>
              <input
                style={{ width: 'fit-content' }}
                type="checkbox"
                checked={values.debounce}
                id={id}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
              />
            </FormField>
            {values.debounce && (
              <>
                <TextField
                  type="number"
                  label="Debounce in"
                  id="debounce-in"
                  {...registerField('debounceIn')}
                />
                <TextField
                  type="number"
                  label="Debounce out"
                  id="debounce-out"
                  {...registerField('debounceOut')}
                />
              </>
            )}
          </>
        )}
      </div>
      <div className="button-wrapper space-around">
        <Button variant="link" onClick={() => setActiveLink('custom')}>
          Custom
        </Button>
        <Button variant="link" onClick={() => setActiveLink('default')}>
          Default
        </Button>
        <Button variant="link" onClick={() => setActiveLink('zod')}>
          Zod
        </Button>
        <Button variant="link" onClick={() => setActiveLink('yup')}>
          Yup
        </Button>
      </div>

      {activeLink === 'custom' && (
        <CustomValidatorForm
          type={values.validationType as ValidationType}
          debounce={{ in: Number(values.debounceIn), out: Number(values.debounceOut) }}
        />
      )}
      {activeLink === 'default' && (
        <ValidatorForm
          type={values.validationType as ValidationType}
          debounce={{ in: Number(values.debounceIn), out: Number(values.debounceOut) }}
        />
      )}
      {activeLink === 'zod' && (
        <ZodValidatorForm
          type={values.validationType as ValidationType}
          debounce={{ in: Number(values.debounceIn), out: Number(values.debounceOut) }}
        />
      )}
      {activeLink === 'yup' && (
        <YupValidatorForm
          type={values.validationType as ValidationType}
          debounce={{ in: Number(values.debounceIn), out: Number(values.debounceOut) }}
        />
      )}
    </div>
  );
};
