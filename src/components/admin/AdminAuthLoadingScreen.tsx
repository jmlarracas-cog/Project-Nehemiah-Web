/**
 * Project Nehemiah — Admin Authentication Loading Screen
 * Displays a stable, accessible loading indicator while Firebase resolves authentication state.
 */

import React from 'react';
import { officialBrandConfig } from '../../config/brand';
import { Loader2, ShieldCheck } from 'lucide-react';

export const AdminAuthLoadingScreen: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-navy text-white flex flex-col items-center justify-center p-6 select-none"
      role="status"
      aria-live="polite"
      aria-label="Verifying administrative identity"
    >
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-2xl bg-navy border-2 border-gold/40 flex items-center justify-center mx-auto shadow-inner">
            <img
              src={officialBrandConfig.primaryLogo}
              alt="Church of God Subic"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-gold text-navy p-1 rounded-full shadow-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-sm font-extrabold uppercase tracking-widest text-gold">
            PROJECT NEHEMIAH
          </h1>
          <p className="text-xs font-bold text-slate-300">
            ADMINISTRATION SYSTEM
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 pt-2">
          <Loader2 className="w-6 h-6 text-gold animate-spin" />
          <p className="text-xs font-semibold text-slate-400">
            Resolving administrative session...
          </p>
        </div>
      </div>
    </div>
  );
};
