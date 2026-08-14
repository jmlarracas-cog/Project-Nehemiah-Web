import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { SiteSettings } from '../../types';
import { AdminButton, AdminField, AdminCheckbox } from '../../components/admin/AdminFormControls';
import { Sliders, Save, ShieldCheck, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<SiteSettings>({
    churchName: 'Church of God – Subic',
    tagline: 'EXALT JESUS. MAKE DISCIPLES. SERVE OTHERS.',
    subicAddress: '[Pending official address]',
    primaryPhone: '[Pending official phone number]',
    primaryEmail: '[Pending official email address]',
    enableSearchIndex: true,
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load site settings from repository');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const savedData = await adminService.saveSettings(settings);
      setSettings(savedData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save site settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 p-4 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold block uppercase tracking-wider text-[10px] text-amber-800">
            Preview Settings Parameter Architecture
          </span>
          <span>
            Contact information and address values configured here are developer preview parameters pending official church secretariat confirmation.
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">CMS Repository Operation Failure</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 text-gold animate-spin" />
          <span className="text-xs font-semibold text-slate-600">Loading site configuration from repository...</span>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sliders className="w-5 h-5 text-gold" />
                Global Church Site Settings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Core configuration parameters, primary contacts, and search engine parameters.
              </p>
            </div>
            {saved && (
              <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> Settings Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5 text-xs max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminField label="Church Official Entity Name" required>
                <input
                  type="text"
                  value={settings.churchName}
                  onChange={(e) => setSettings({ ...settings, churchName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>

              <AdminField label="Official Tagline / Motto" required>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>
            </div>

            <AdminField label="Main Subic Sanctuary Address" required>
              <input
                type="text"
                value={settings.subicAddress}
                onChange={(e) => setSettings({ ...settings, subicAddress: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminField label="Secretariat Primary Phone" required>
                <input
                  type="text"
                  value={settings.primaryPhone}
                  onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>

              <AdminField label="Secretariat Primary Email" required>
                <input
                  type="email"
                  value={settings.primaryEmail}
                  onChange={(e) => setSettings({ ...settings, primaryEmail: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Search Indexing & Governance Safeguards
              </h3>

              <AdminCheckbox
                label="Enable Global In-Site Search Indexing"
                description="Allows public visitors to search verified published content."
                checked={settings.enableSearchIndex}
                onChange={(e) => setSettings({ ...settings, enableSearchIndex: e.target.checked })}
              />
            </div>

            <div className="pt-2">
              <AdminButton variant="gold" size="md" type="submit" disabled={saving}>
                {saving ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" /> Save Global Configuration
                  </>
                )}
              </AdminButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
