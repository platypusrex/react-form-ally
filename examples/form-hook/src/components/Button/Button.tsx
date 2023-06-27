import * as React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactElement | string;
  variant?: 'button' | 'link';
  type?: 'reset' | 'submit';
  href?: string;
  style?: React.CSSProperties;
}

export const Button = React.memo<ButtonProps>(
  ({ onClick, disabled, type = 'submit', variant, href, style, children }) => {
    if (href && !disabled) {
      return (
        <Link className={`button ${type} ${variant}`} to={href}>
          {children}
        </Link>
      );
    }

    return (
      <button
        className={`button ${type} ${variant}`}
        style={style}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    );
  }
);
