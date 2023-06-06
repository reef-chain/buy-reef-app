import React, { BaseSyntheticEvent, useEffect, useState } from 'react';


export const Input = ({
  value,
  disabled,
  maxLength,
  placeholder,
  className = '',
  onChange = (_) => {},
}) => (
  <input
    value={value}
    disabled={disabled}
    maxLength={maxLength}
    placeholder={placeholder}
    className="field-input ms-2 flex-grow-1 text-end"
    onChange={(event) => onChange(event.target.value)}
  />
);

export const InputAmount = ({
  amount,
  onAmountChange,
  min = 0.0,
  max,
  placeholder = '',
  disabled = false,
  onValidityChange,
}) => {
  const mathDecimals = !amount ? '' : amount.replaceAll(',', '.');
  const [amt, setAmt] = useState(mathDecimals);

  const checkAmountValidity = (amount) => {
    if (onValidityChange === undefined) {
      return;
    }

    if (amount.length === 0) {
      onValidityChange({ valid: true });
      return;
    }

    const amountNr = +amount;
    if (min != null && amountNr < min) {
      onValidityChange({ valid: false, errorMessage: `Amount is too low. The lowest allowed value is ${min}.` });
      return;
    }

    if (max != null && amountNr > max) {
      onValidityChange({ valid: false, errorMessage: `Amount is too big. The largest allowed value is ${max}.` });
      return;
    }

    onValidityChange({ valid: true });
  };

  const inputChange = (event) => {
    const newVal = event.target.value;
    setAmt(newVal);
    onAmountChange(newVal);
    checkAmountValidity(newVal);
  };

  useEffect(() => {
    setAmt(amount);
    checkAmountValidity(amount);
  }, [amount]);

  return (
    <input
      type="number"
      min={min ?? 0.0}
      max={max}
      disabled={disabled}
      value={amt}
      placeholder={placeholder}
      className="field-input ms-2 flex-grow-1 text-end"
      onChange={inputChange}
    />
  );
};

export const InputGroup = ({ children }) => (
  <div className="input-group">{children}</div>
);

export const InputTextGroup = ({
  children,
}) => (
  <div className="input-group-text field-input border-rad ps-1">{children}</div>
);

export const NumberInput = ({
  value,
  min,
  max,
  step,
  placeholder,
  onChange,
  disableDecimals,
  className = '',
}) => {
  const keyDown = (e) => {
    if (!disableDecimals) {
      return;
    }
    if (
      e.nativeEvent.key === '.'
      || e.nativeEvent.key === ','
    ) {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  return (
    <input
      min={min}
      max={max}
      step={step}
      type="number"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={keyDown}
      className={className || 'form-control field-input border-rad text-end'}
    />
  );
};

export const PercentageRangeAmount = ({
  value,
  disabled,
  onChange,
}) => (
  <input
    min={0}
    max={100}
    type="range"
    className="form-range"
    value={value}
    disabled={disabled}
    onChange={(event) => onChange(parseInt(event.target.value, 10))}
  />
);

export const CheckboxInput = ({
  checked,
  disabled,
  onChange,
  id,
  labelText,
}) => (
  <div className="form-check">
    <input
      className="form-check-input"
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event)}
      disabled={disabled}
    />
    <label htmlFor={id} className="form-check-label">
      {labelText}
    </label>
  </div>
);
