import * as React from 'react';
import './Button.css';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactElement | string;
  variant?: 'button' | 'link';
  type?: 'reset' | 'submit'
  style?: React.CSSProperties;
}

export const Button = React.memo<ButtonProps>(
    ({
    onClick,
    disabled,
    type = 'submit',
    variant,
    style,
    children
  }) => (
    <button
      className={`button ${type} ${variant}`}
      style={style}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
);
