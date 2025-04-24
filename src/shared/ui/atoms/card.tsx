import React from 'react';

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
  <div className={`rounded-lg shadow-md bg-white/5 border border-white/10 p-6 ${className}`}>
    {children}
  </div>
);

export default Card;
