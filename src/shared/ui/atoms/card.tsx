import React from 'react';

export const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
  <div className={`rounded-lg shadow-md bg-white/5 border border-white/10 p-6 ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
  <div className={`mb-4 font-bold text-lg ${className}`}>{children}</div>
);

export const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
  <div className={className}>{children}</div>
);

export const CardFooter: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
  <div className={`mt-4 border-t border-white/10 pt-2 ${className}`}>{children}</div>
);

export default Card;
