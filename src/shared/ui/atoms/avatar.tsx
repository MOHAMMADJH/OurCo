import React from 'react';

export const Avatar: React.FC<{ src: string; alt?: string; className?: string }> = ({ src, alt = '', className = '' }) => (
  <img
    src={src}
    alt={alt}
    className={`w-10 h-10 rounded-full object-cover border-2 border-white/10 ${className}`}
    onError={e => (e.currentTarget.src = '/default-avatar.png')}
  />
);

export const AvatarFallback: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 ${className}`}>
    ?
  </div>
);

export const AvatarImage: React.FC<{ src: string; alt?: string; className?: string }> = ({ src, alt = '', className = '' }) => (
  <img
    src={src}
    alt={alt}
    className={`w-10 h-10 rounded-full object-cover border-2 border-white/10 ${className}`}
    onError={e => (e.currentTarget.src = '/default-avatar.png')}
  />
);

export default Avatar;
