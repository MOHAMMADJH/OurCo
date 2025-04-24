import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => (
  <button
    className={`px-4 py-2 rounded bg-[#FF6B00] text-white font-semibold hover:bg-[#FF8533] transition ${className}`}
    {...props}
  />
);

export default Button;
