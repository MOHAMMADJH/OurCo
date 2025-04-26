import React from 'react';

interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
}

interface AvatarImageProps {
  src: string;
  alt?: string;
  className?: string;
}

interface AvatarFallbackProps {
  className?: string;
  children: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  className = '', 
  children 
}) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

export const AvatarImage: React.FC<AvatarImageProps> = ({ 
  src, 
  alt = '', 
  className = '' 
}) => (
  <img
    src={src}
    alt={alt}
    className={`h-full w-full object-cover ${className}`}
    onError={e => (e.currentTarget.src = '/default-avatar.png')}
  />
);

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ 
  className = '', 
  children 
}) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-gray-600 ${className}`}>
    {children}
  </div>
);

export default Avatar;
