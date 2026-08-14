/**
 * Project Nehemiah — Admin Login Page
 * Dedicated, secure authentication landing page for Church of God – Subic administrative personnel.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { officialBrandConfig } from '../../config/brand';
import {
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Code,
  ArrowRight,
  Loader2,
  Lock,
} from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const {
    authAvailable,
    authError,
    signInWithGoogle,
    signInWithGoogleRedirect,
    enableMockAdminSession,
    clearAuthError,
  } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    clearAuthError();
    setIsSubmitting(true);
    try {
      const success = await signInWithGoogle();
      if (success) {
        onNavigate('/admin/dashboard');
      }
    } catch {
      // Errors handled inside signInWithGoogle
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRedirectSignIn = async () => {
    clearAuthError();
    setIsSubmitting(true);
    await signInWithGoogleRedirect();
  };

  const handleMockAdminSignIn = () => {
    clearAuthError();
    enableMockAdminSession();
    onNavigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-gold selection:text-navy">
      <div className="max-w-md w-full space-y-8">
        {/* Header Branding Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
          {/* Top Decorative Gold Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold via-amber-300 to-gold" />

          {/* Logo Badge */}
          <div className="relative inline-block mt-2">
            <div className="w-20 h-20 rounded-2xl bg-navy border-2 border-gold/50 flex items-center justify-center mx-auto shadow-lg p-2">
              <img
                src={officialBrandConfig.primaryLogo}
                alt="Church of God Subic"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gold text-navy p-1.5 rounded-full shadow-md">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Title block */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-gold block">
              PROJECT NEHEMIAH
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              ADMINISTRATION
            </h1>
            <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xs mx-auto">
              Authorized administration access for Church of God – Subic pastoral team, secretariat, and department heads.
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <div
              className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs font-medium text-left flex items-start gap-2.5 animate-in fade-in duration-200"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{authError}</div>
            </div>
          )}

          {/* Firebase Authentication Option */}
          <div className="space-y-3 pt-2">
            {authAvailable ? (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full h-12 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 focus:outline-hidden focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-navy" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      {/* Google G Icon */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Secondary Redirect Fallback for strict mobile popups */}
                <button
                  type="button"
                  onClick={handleGoogleRedirectSignIn}
                  className="text-[11px] font-semibold text-slate-400 hover:text-gold transition-colors block mx-auto underline cursor-pointer focus:outline-hidden"
                >
                  Having popup issues? Use Redirect Sign-In
                </button>
              </>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-200 text-xs text-left space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Firebase Authentication Pending</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Firebase Authentication is not currently configured for this environment.
                </p>
              </div>
            )}
          </div>

          {/* Development Preview Mode Option */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Code className="w-3.5 h-3.5" />
                Development Mode
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px]">
                DEV PREVIEW
              </span>
            </div>

            <button
              type="button"
              onClick={handleMockAdminSignIn}
              className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            >
              <span>Continue with Development Preview (Mock Mode)</span>
              <span className="text-[10px] text-amber-300 font-black">[DEV ONLY]</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              Mock Admin Mode provides local UI preview access without requiring live Firebase credentials.
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-gold transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>

          <p className="text-[10px] text-slate-500 block">
            Church of God – Subic • Project Nehemiah Stage 6B
          </p>
        </div>
      </div>
    </div>
  );
};
