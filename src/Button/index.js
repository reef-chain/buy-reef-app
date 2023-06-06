import React from 'react';

export const Button = ({
  children,
  onClick = () => {},
  className = '',
  disabled,
}) => (
  <button
    type="button"
    className={`btn btn-reef border-rad ${className}`}
    disabled={disabled}
    onClick={onClick}
  >
    <span>{children}</span>
  </button>
);