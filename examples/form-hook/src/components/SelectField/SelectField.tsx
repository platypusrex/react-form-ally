import * as React from 'react';
import { ChangeEvent } from 'react';
import { FormField } from '../FormField/FormField';
import './SelectField.css';

interface SelectFieldProps {
  id: string;
  name: string;
  value?: any;
  options: {
    name: string;
    value: string;
  }[];
  label: string;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  style?: React.CSSProperties;
}

export const SelectField = React.memo<SelectFieldProps>(
  ({ id, name, value, options, label, error, style, onChange }) => (
    <FormField id={id} label={label} error={error} style={style}>
      <select
        value={value}
        className={`select ${error ? 'error' : ''}`}
        name={name}
        id="state-input"
        onChange={onChange}
      >
        <option value=""> -- select an option -- </option>
        {options.map((option) => (
          <option key={option.name} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </FormField>
  )
);
