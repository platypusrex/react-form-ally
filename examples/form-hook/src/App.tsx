import React, { useState } from 'react';
import { useForm, ValidationType } from '@react-form-ally/hook';
import { Button } from './components/Button';
import { SelectField } from './components/SelectField';
import { TextField } from './components/TextField';
import { CustomValidatorForm } from './CustomValidatorForm';
import { ValidatorForm } from './ValidatorForm';
import { ZodValidatorForm } from './ZodValidatorForm';
import { YupValidatorForm } from './YupValidatorForm';
import './App.css';

const validationTypes = ['change', 'blur', 'submit'] as const;

const initialValues = {
  validationType: 'change',
  debounceIn: 500,
  debounceOut: 0,
};
export const App = () => {
  const [activeLink, setActiveLink] = useState<string>('custom');
  const [drawerVisible, toggleDrawer] = useState(false);
  const { values, registerField } = useForm({ initialValues });

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
