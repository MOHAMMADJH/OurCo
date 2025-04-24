import React from 'react';

const Avatar: React.FC<{ src: string; alt?: string; className?: string }> = ({ src, alt = '', className = '' }) => (
  <img
    src={src}
    alt={alt}
    className={`w-10 h-10 rounded-full object-cover border-2 border-white/10 ${className}`}
    onError={e => (e.currentTarget.src = '/default-avatar.png')}
  />
);

export default Avatar;
