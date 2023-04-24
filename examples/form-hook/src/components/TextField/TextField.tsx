import * as React from 'react';
import { ChangeEvent, FocusEventHandler } from 'react';
import { FormField } from '../FormField';
import './TextField.css';

interface TextFieldProps {
  id?: string;
  name: string;
  value?: string | number;
  type?: string;
  label: string;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

export const TextField = React.forwardRef<any, TextFieldProps>(
  ({ id = '', name, value, type = 'text', label, error, onChange, onBlur }, ref) => (
    <FormField id={id} label={label} error={error}>
      <input
        ref={ref}
        className={`text-input ${error ? 'error' : ''}`}
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FormField>
  )
);
