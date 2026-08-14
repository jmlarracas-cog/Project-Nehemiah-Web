import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { isLeadershipPreview } from '../../config/environment';

export const LeadershipPreviewBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (!isLeadershipPreview() || dismissed) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Leadership Preview Notice"
      className="bg-navy border-b border-gold/30 text-white py-2 px-4 text-xs font-sans relative z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <span className="shrink-0 bg-gold/20 border border-gold/40 text-gold-300 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-gold" />
            <span>LEADERSHIP PREVIEW</span>
          </span>
          <p className="text-slate-200 text-xs truncate sm:whitespace-normal leading-tight font-medium">
            Content and ministry information are currently being reviewed and verified prior to official public launch.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss leadership preview notice"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
