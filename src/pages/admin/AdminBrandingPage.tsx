import React, { useState } from 'react';
import { officialBrandConfig } from '../../config/brand';
import { AdminButton, AdminField, AdminImagePicker } from '../../components/admin/AdminFormControls';
import { Palette, CheckCircle2 } from 'lucide-react';

export const AdminBrandingPage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [navy, setNavy] = useState('#001529');
  const [gold, setGold] = useState('#D4AF37');
  const [logo, setLogo] = useState(officialBrandConfig.primaryLogo);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Palette className="w-5 h-5 text-gold" />
              Church Brand Identity & Visual Tokens
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official Navy/Gold color system, logo assets, and design system governance.
            </p>
          </div>
          {saved && (
            <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> Identity Tokens Verified!
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs max-w-3xl">
          {/* Logo Asset */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Official Church Logo Artwork
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-navy rounded-xl border border-slate-800">
                <img src={logo} alt="Church Logo Preview" className="w-16 h-16 object-contain" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Church of God – Subic Logo</span>
                <span className="text-[10px] text-slate-500">Vector PNG / SVG with transparent background</span>
              </div>
            </div>

            <AdminImagePicker
              value={logo}
              onChange={(url) => setLogo(url || officialBrandConfig.primaryLogo)}
              label="Update Official Logo Asset"
              objectFit="contain"
            />
          </div>

          {/* Color Tokens Preview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Primary Brand Color Palette
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminField label="Deep Navy Primary (#001529)" required>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: navy }}
                  />
                  <input
                    type="text"
                    value={navy}
                    onChange={(e) => setNavy(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </AdminField>

              <AdminField label="Refined Gold Accent (#D4AF37)" required>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: gold }}
                  />
                  <input
                    type="text"
                    value={gold}
                    onChange={(e) => setGold(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </AdminField>
            </div>
          </div>

          <div>
            <AdminButton variant="gold" size="md" type="submit">
              Save Brand System
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  );
};
