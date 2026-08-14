import React from 'react';
import { Breadcrumb, BreadcrumbItem } from '../ui/Breadcrumb';
import { Container } from '../ui/Container';

interface PageShellProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
  bgImage?: string;
}

export const PageShell: React.FC<PageShellProps> = ({
  title,
  subtitle,
  breadcrumbs,
  children,
  bgImage,
}) => {
  return (
    <div className="w-full">
      {/* Page Header Banner */}
      <div className="relative bg-navy text-white py-16 sm:py-20 border-b border-gold/20 overflow-hidden">
        {bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{ backgroundImage: `url("${bgImage}")` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/90 to-navy/70" />

        <Container size="wide" className="relative z-10">
          {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-4" />}
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="h-1 w-20 bg-gold mt-6 rounded-full" />
        </Container>
      </div>

      {/* Main Page Content */}
      <div className="py-12 sm:py-16">{children}</div>
    </div>
  );
};
