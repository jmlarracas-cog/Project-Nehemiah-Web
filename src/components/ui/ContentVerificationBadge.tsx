import React from 'react';
import { AlertCircle, FileClock } from 'lucide-react';
import { ContentStatus } from '../../types/about';

interface ContentVerificationBadgeProps {
  status?: ContentStatus;
  label?: string;
  variant?: 'amber' | 'slate' | 'subtle';
  className?: string;
  compact?: boolean;
}

export const ContentVerificationBadge: React.FC<ContentVerificationBadgeProps> = ({
  status = 'pending_verification',
  label = 'DEMO CONTENT — PENDING VERIFICATION',
  variant = 'amber',
  className = '',
  compact = false,
}) => {
  if (status === 'published') return null;

  const variantStyles = {
    amber: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    slate: 'bg-slate-800/80 border-slate-600/50 text-slate-300',
    subtle: 'bg-gold/10 border-gold/25 text-gold',
  };

  if (compact) {
    return (
      <span
        className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-xs ${variantStyles[variant]} ${className}`}
        title="This content is placeholder/demo data awaiting official church verification."
      >
        <AlertCircle className="w-3 h-3 shrink-0" />
        <span>PENDING VERIFICATION</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border backdrop-blur-xs shadow-xs ${variantStyles[variant]} ${className}`}
      title="This content is placeholder/demo data awaiting official church verification."
    >
      <FileClock className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </div>
  );
};
