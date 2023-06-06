import React from 'react';
import { BackIcon } from '../Icons';

export const Card = ({ children }) => (
  <div className="card border-rad">
    <div className="card-body">{children}</div>
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="d-flex justify-content-between mb-2">{children}</div>
);

export const CardHeaderBlank = () => (
  <div style={{ width: '46px' }} />
);

export const CardTitle = ({ title }) => (
  <h5 className="h5 my-2 text-center">{title}</h5>
);

export const CardBack = ({ onBack }) => (
  <button type="button" className="btn" onClick={onBack}>
    <BackIcon />
  </button>
);

export const ErrorCard = ({ title, message }) => (
  <Card>
    <CardTitle title={title} />
    <p
      className="card-text text-danger"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  </Card>
);

export const SubCard = ({ children }) => (
  <div className="field border-rad p-3">{children}</div>
);
