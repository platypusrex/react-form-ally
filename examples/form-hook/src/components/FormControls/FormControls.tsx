import React, { useState } from 'react';
import { SelectField } from '../SelectField';
import { FormField } from '../FormField';
import { TextField } from '../TextField';
import { Button } from '../Button';
import { UseForm } from '../../form-hook/useForm2';
import { FormControlValues } from './useFormControls';

const validationTypes = ['change', 'blur', 'submit'] as const;
const inputTypes = ['controlled', 'uncontrolled'] as const;

type FormControlsProps = {
  handleSubmit: (values: any) => void;
};

export const FormControls: React.FC<UseForm<FormControlValues> & FormControlsProps> = ({
  values,
  registerInput,
  registerCheckbox,
  onSubmit,
  handleSubmit,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const submit = (formValues: any) => {
    handleSubmit(formValues);
    setDrawerVisible(false);
  };

  return (
    <>
      <button className="drawer-toggle" onClick={() => setDrawerVisible(true)}>
        {drawerVisible ? 'Close drawer' : 'Configure form'}
      </button>
      <div className={`drawer-overlay ${drawerVisible ? 'visible' : ''}`} />
      <div className={`drawer ${drawerVisible ? 'visible' : ''}`}>
        <button className="drawer-close" onClick={() => setDrawerVisible(false)}>
          X
        </button>
        <form onSubmit={onSubmit(submit)}>
          <SelectField
            style={{ paddingBottom: 15, marginTop: 15 }}
            label="Input type"
            options={inputTypes.map((type) => ({ value: type, name: type }))}
            {...registerInput('inputType', { id: 'inputType' })}
          />

          <SelectField
            style={{ paddingBottom: 15, marginTop: 15 }}
            label="Validation type"
            options={validationTypes.map((type) => ({ value: type, name: type }))}
            {...registerInput('validationType', { id: 'validationType' })}
          />

          {values.validationType === 'change' && (
            <>
              <FormField id="debounce" label="Debounce" style={{ paddingBottom: '1rem' }}>
                <input
                  style={{ width: 'fit-content' }}
                  {...registerCheckbox('debounce', { type: 'checkbox' })}
                />
              </FormField>
              {values.debounce && (
                <>
                  <TextField
                    label="Debounce in"
                    {...registerInput('debounceIn', { id: 'debounce-in', type: 'number' })}
                  />
                  <TextField
                    label="Debounce out"
                    {...registerInput('debounceOut', { id: 'debounce-out', type: 'number' })}
                  />
                </>
              )}
            </>
          )}
          <Button type="submit">Update config</Button>
        </form>
      </div>
    </>
  );
};
