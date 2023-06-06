import React from 'react';

const Container = ({
  vertical,
  className,
  children,
  flow
}) => (
  <div
    className={`
      uik-container
      ${!!vertical ? 'uik-container--vertical' : ''}
      ${flow === 'start' ? 'uik-container--flow-start' : ''}
      ${flow === 'end' ? 'uik-container--flow-end' : ''}
      ${flow === 'spaceAround' ? 'uik-container--flow-space-around' : ''}
      ${flow === 'spaceBetween' ? 'uik-container--flow-space-between' : ''}
      ${flow === 'stretch' ? 'uik-container--flow-stretch' : ''}
      ${className || ''}
    `}
  >
    { children }
  </div>
)

export default Container