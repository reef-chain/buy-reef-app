import React from 'react';

export const FlexRow = ({
  children,
  className = '',
}) => (
  <div className={`d-flex flex-row ${className}`}>{children}</div>
);

export const FullRow = ({ children }) => (
  <div className="d-flex flex-row w-100">{children}</div>
);

export const FlexColumn = ({ children }) => (
  <div className="d-flex flex-column">{children}</div>
);

export const FullColumn = ({ children }) => (
  <div className="d-flex flex-column w-100">{children}</div>
);

export const CenterRow = ({ children }) => (
  <div className="my-auto">{children}</div>
);

export const CenterColumn = ({ children }) => (
  <div className="mx-auto">{children}</div>
);

export const ContentCenter = ({ children }) => (
  <div className="d-flex justify-content-center">{children}</div>
);

export const ContentBetween = ({
  children,
}) => (
  <div className="d-flex justify-content-between w-100">{children}</div>
);

export const ContentEnd = ({ children }) => (
  <div className="d-flex justify-content-end w-100">{children}</div>
);

export const Width = ({ children, size }) => (
  <div style={{ minWidth: `${size}px`, maxWidth: `${size}px` }}>{children}</div>
);

export const Margin = ({
  children,
  size = '1',
}) => <div className={`m-${size}`}>{children}</div>;

export const MT = ({ children, size = '1' }) => (
  <div className={`mt-${size}`}>{children}</div>
);
export const ME = ({ children, size = '1' }) => (
  <div className={`me-${size}`}>{children}</div>
);
export const MB = ({ children, size = '1' }) => (
  <div className={`mb-${size}`}>{children}</div>
);
export const MS = ({ children, size = '1' }) => (
  <div className={`ms-${size}`}>{children}</div>
);

export const MX = ({
  children,
  size = 'auto',
}) => <div className={`mx-${size}`}>{children}</div>;

export const PY = ({
  children,
  size = 'auto',
}) => <div className={`py-${size}`}>{children}</div>;

export const PT = ({ children, size = '1' }) => (
  <div className={`pt-${size}`}>{children}</div>
);
export const PE = ({ children, size = '1' }) => (
  <div className={`pe-${size}`}>{children}</div>
);
export const PB = ({ children, size = '1' }) => (
  <div className={`pb-${size}`}>{children}</div>
);
export const PS = ({ children, size = '1' }) => (
  <div className={`ps-${size}`}>{children}</div>
);

export const Border = ({
  children,
  size = '1',
}) => (
  <div className={`border border-rad p-${size}`}>{children}</div>
);

export const ComponentCenter = ({
  children,
}) => (
  <CenterColumn>
    <Width size={500}>{children}</Width>
  </CenterColumn>
);
