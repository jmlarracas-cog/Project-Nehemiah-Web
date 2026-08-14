import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'normal' | 'narrow' | 'wide';
  id?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'normal',
  id,
}) => {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    normal: 'max-w-7xl',
    wide: 'max-w-[1440px]',
  };

  return (
    <div
      id={id}
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
    >
      {children}
    </div>
  );
};
