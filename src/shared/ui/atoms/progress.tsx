import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, max = 100, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
    <div
      className="bg-[#FF6B00] h-2.5 rounded-full"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

export default Progress;
