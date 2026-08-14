import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'surface' | 'navy' | 'outline';
  hoverEffect?: boolean;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'surface',
  hoverEffect = true,
  id,
}) => {
  const variantClasses = {
    surface: 'bg-white text-slate-900 border border-slate-100 shadow-md',
    navy: 'bg-navy text-white border border-slate-800 shadow-lg',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-900',
  };

  const hoverClasses = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
    : '';

  return (
    <div
      id={id}
      className={`rounded-md overflow-hidden ${variantClasses[variant]} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};
