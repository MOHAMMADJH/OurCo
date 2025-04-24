import React from 'react';

export const Badge: React.FC<{ color?: string; className?: string; children: React.ReactNode }> = ({ color = 'bg-gray-200', className = '', children }) => (
  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${color} ${className}`}>
    {children}
  </span>
);

export default Badge;
