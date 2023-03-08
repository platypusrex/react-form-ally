import * as React from 'react';
import './FormField.css';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children?: React.ReactElement | string;
  style?: React.CSSProperties;
}

export const FormField = React.memo<FormFieldProps>(
    ({
    id,
    label,
    error,
    style,
    children
  }) => (
    <div className="form-field" style={style}>
      <label className="label" htmlFor={id}>{label}</label>
      {children}
      {error && (
        <div className="error-container">
          <p className="error">{error}</p>
        </div>
      )}
    </div>
  )
);
