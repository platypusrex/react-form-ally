import * as React from 'react';
import { ChangeEvent, FocusEventHandler } from "react";
import { FormField } from '../FormField/FormField';
import './SelectField.css';

interface SelectFieldProps {
  id?: string;
  name: string;
  value?: any;
  options: {
    name: string;
    value: string;
  }[];
  label: string;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: FocusEventHandler;
  style?: React.CSSProperties;
}

export const SelectField = React.forwardRef<any, SelectFieldProps>(
  ({ id, name, value, options, label, error, style, onChange, onBlur }, ref) => (
    <FormField id={id || ''} label={label} error={error} style={style}>
      <select
        ref={ref}
        value={value}
        className={`select ${error ? 'error' : ''}`}
        name={name}
        id={id}
        onBlur={onBlur}
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
