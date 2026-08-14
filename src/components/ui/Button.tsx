import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  id,
  onClick,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 whitespace-nowrap';

  const variants = {
    primary: 'bg-gold text-primary hover:bg-gold-light shadow-md hover:shadow-lg',
    secondary: 'bg-navy text-white hover:bg-navy-dark shadow-md',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-navy',
    ghost: 'text-primary hover:bg-black/5 hover:text-gold',
    dark: 'bg-navy-dark text-gold border border-gold/30 hover:bg-navy hover:border-gold',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const renderContent = () => (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon className={`${iconSizes[size]} mr-2 shrink-0`} />
      )}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && (
        <Icon className={`${iconSizes[size]} ml-2 shrink-0`} />
      )}
    </>
  );

  if (href) {
    return (
      <a
        id={id}
        href={href}
        className={combinedClasses}
        onClick={(e) => {
          if (onClick) onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }}
      >
        {renderContent()}
      </a>
    );
  }

  return (
    <button id={id} className={combinedClasses} onClick={onClick} {...props}>
      {renderContent()}
    </button>
  );
};
