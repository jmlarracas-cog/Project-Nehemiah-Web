import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
  id?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  eyebrow,
  centered = false,
  light = false,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`mb-12 ${centered ? 'text-center' : 'text-left'} ${className}`}
    >
      {eyebrow && (
        <span
          className={`inline-block text-xs font-bold uppercase tracking-widest mb-2 ${
            light ? 'text-gold-light' : 'text-gold'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 ${
          light ? 'text-white' : 'text-navy'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base sm:text-lg max-w-2xl font-normal leading-relaxed ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-gray-300' : 'text-slate-600'}`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`h-1 w-20 bg-gold mt-4 rounded-full ${
          centered ? 'mx-auto' : ''
        }`}
      />
    </div>
  );
};
