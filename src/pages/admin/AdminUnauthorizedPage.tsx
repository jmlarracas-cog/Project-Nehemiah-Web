/**
 * Project Nehemiah — Account Not Authorized Page
 * Rendered when a user completes Google Authentication successfully but lacks administrative role assignment,
 * or lacks specific module permissions for a requested path.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAuthorization } from '../../context/AuthorizationContext';
import { officialBrandConfig } from '../../config/brand';
import {
  ShieldAlert,
  LogOut,
  ExternalLink,
  User,
  Clock,
  ArrowLeft,
  ShieldX,
} from 'lucide-react';

interface AdminUnauthorizedPageProps {
  reasonMessage?: string;
  requiredPermission?: string;
  onNavigate: (path: string) => void;
}

export const AdminUnauthorizedPage: React.FC<AdminUnauthorizedPageProps> = ({
  reasonMessage,
  requiredPermission,
  onNavigate,
}) => {
  const { user, signOut } = useAuth();
  const { role } = useAuthorization();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Main Security Card */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
          {/* Top Amber Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />

          {/* Logo Badge */}
          <div className="relative inline-block mt-2">
            <div className="w-16 h-16 rounded-2xl bg-navy border-2 border-amber-500/50 flex items-center justify-center mx-auto shadow-md p-2">
              <img
                src={officialBrandConfig.primaryLogo}
                alt="Church of God Subic"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-navy p-1.5 rounded-full shadow-md">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          {/* Header Title */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
              {role ? 'MODULE PERMISSION DENIED' : 'AUTHENTICATION SUCCESSFUL'}
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
              {role ? 'ACCESS RESTRICTED' : 'ACCOUNT NOT AUTHORIZED'}
            </h1>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {reasonMessage ||
                'This Google account has been authenticated successfully, but it does not currently have access to Project Nehemiah administration.'}
            </p>
          </div>

          {/* Required Permission Banner */}
          {requiredPermission && (
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-200 text-xs text-left flex items-start gap-2.5">
              <ShieldX className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-300">Required Permission Key:</span>
                <code className="font-mono text-[11px] text-gold">{requiredPermission}</code>
              </div>
            </div>
          )}

          {/* Authenticated User Identity Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-3">
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-navy border border-amber-500/40 text-gold flex items-center justify-center font-bold text-sm">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white block truncate">
                  {user?.displayName || 'Authenticated Google User'}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {user?.email || 'No email provided'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">Assigned Technical Role:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {role || 'Pending Assignment'}
              </span>
            </div>
          </div>

          {/* Information Notice */}
          <p className="text-[11px] text-slate-400 leading-relaxed text-center px-2">
            Administrative roles and permissions are provisioned by church secretariat governance via Firebase custom claims. Please contact your administrator if you require elevated access.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {role ? (
              <button
                type="button"
                onClick={() => onNavigate('/admin/dashboard')}
                className="w-full h-11 bg-gold hover:bg-amber-400 text-navy font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Allowed Dashboard</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-rose-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-gold"
            >
              <ExternalLink className="w-4 h-4 text-gold" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-slate-500 text-center block">
          Church of God – Subic • Security & Governance Architecture
        </p>
      </div>
    </div>
  );
};
