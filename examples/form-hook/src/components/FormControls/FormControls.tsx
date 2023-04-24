import React, { useState } from 'react';
import { SelectField } from '../SelectField';
import { FormField } from '../FormField';
import { TextField } from '../TextField';
import { UseForm } from '../../form-hook';
import { FormControlValues } from './useFormControls';
import { Button } from "../Button";

const validationTypes = ['change', 'blur', 'submit'] as const;

type FormControlsProps = {
  handleSubmit: (values: any) => void;
};

export const FormControls: React.FC<UseForm<FormControlValues> & FormControlsProps> = ({
  values,
  registerField,
  onSubmit,
  handleSubmit,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

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
        <form onSubmit={onSubmit(handleSubmit)}>
          <SelectField
            style={{ paddingBottom: 15, marginTop: 15 }}
            label="Validation type"
            options={validationTypes.map((type) => ({ value: type, name: type }))}
            {...registerField('validationType', { id: 'validationType' })}
          />

          {values.validationType === 'change' && (
            <>
              <FormField id="debounce" label="Debounce" style={{ paddingBottom: '1rem' }}>
                <input
                  style={{ width: 'fit-content' }}
                  checked={values.debounce}
                  {...registerField('debounce', { type: 'checkbox' })}
                />
              </FormField>
              {values.debounce && (
                <>
                  <TextField
                    label="Debounce in"
                    {...registerField('debounceIn', { id: 'debounce-in', type: 'number' })}
                  />
                  <TextField
                    label="Debounce out"
                    {...registerField('debounceOut', { id: 'debounce-out', type: 'number' })}
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
