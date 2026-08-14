import React, { useState } from 'react';
import { MediaAssetRecord, MediaAssetType, MediaSourceType } from '../../types/media';
import { ContentStatus } from '../../types/about';
import { validateAssetUrl } from '../../utils/mediaUrlValidation';
import { AdminModal, AdminButton, AdminField, AdminSelect } from './AdminFormControls';
import {
  ShieldCheck,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Info,
  Lock,
  Globe,
  HardDrive,
} from 'lucide-react';

interface MediaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: MediaAssetRecord | null;
  onSave: (updatedAsset: MediaAssetRecord) => void;
}

export const MediaEditModal: React.FC<MediaEditModalProps> = ({
  isOpen,
  onClose,
  asset,
  onSave,
}) => {
  if (!asset) return null;

  const [formData, setFormData] = useState<MediaAssetRecord>({ ...asset });
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleUrlChange = (newUrl: string) => {
    const validation = validateAssetUrl(newUrl);
    setUrlError(validation.isValid ? null : validation.error || 'Invalid asset URL');
    setFormData((prev) => ({
      ...prev,
      url: newUrl,
      publicPath: newUrl.startsWith('/') ? newUrl : prev.publicPath,
      sourceType: newUrl.startsWith('http') ? 'public_url' : 'local',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlError) return;
    onSave(formData);
  };

  const isLogo = formData.isOfficialBrandAsset || formData.assetType === 'logo';

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={asset.id ? `Edit Media Asset Metadata` : `Add Media Asset Reference`}
      footer={
        <>
          <AdminButton variant="secondary" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton variant="gold" onClick={handleSubmit} disabled={Boolean(urlError)}>
            Save Asset Metadata
          </AdminButton>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Official Brand Protected Notice */}
        {formData.isOfficialBrandAsset && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-xs">Official Church Brand Asset</span>
              <span className="text-[11px] text-amber-800 leading-relaxed block mt-0.5">
                This asset is marked as an authoritative official brand element (Church seal/logo). Core artwork paths are protected against accidental archiving or deletion.
              </span>
            </div>
          </div>
        )}

        {/* Live Preview Container */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
            {formData.assetType === 'document' ? (
              <FileText className="w-8 h-8 text-amber-600" />
            ) : (
              <img
                src={formData.url}
                alt={formData.altText || formData.title}
                className={`w-full h-full ${isLogo ? 'object-contain p-2' : 'object-cover'}`}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-slate-900 block truncate">{formData.title || 'Untitled Asset'}</span>
            <span className="text-[10px] text-slate-500 font-mono block truncate">{formData.url}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-semibold uppercase">
                {formData.category}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {formData.dimensions || 'Dimensions unset'} • {formData.fileSize || 'Size unset'}
              </span>
            </div>
          </div>
        </div>

        {/* Asset Title */}
        <AdminField label="Asset Title" required>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            placeholder="e.g., Atmosphere of Faith Preaching Stage Graphic"
          />
        </AdminField>

        {/* Alt Text & Governance Notice */}
        <AdminField label="Accessibility Alt Text (Mandatory for Public Site)" required>
          <input
            type="text"
            value={formData.altText}
            onChange={(e) => setFormData({ ...formData, altText: e.target.value, alt: e.target.value })}
            className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            placeholder="e.g., Church worship gathering stage with navy and gold lighting"
          />
          <div className="mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-600 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>
              <strong>Alt Text Governance:</strong> Alt text must describe visual content accurately. Do not fabricate identity claims for unverified pastoral figures or candidate church locations.
            </span>
          </div>
        </AdminField>

        {/* Asset Category & Type Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AdminField label="Category Group" required>
            <AdminSelect
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'branding', label: 'Branding & Logos' },
                { value: 'sermons', label: 'Sermon Thumbnails' },
                { value: 'events', label: 'Event Posters & Banners' },
                { value: 'ministries', label: 'Ministry Photos' },
                { value: 'churches', label: 'Church Location Photos' },
                { value: 'leadership', label: 'Leadership Portraits' },
                { value: 'documents', label: 'PDF Documents & Bylaws' },
                { value: 'general', label: 'General Stock Media' },
              ]}
            />
          </AdminField>

          <AdminField label="Specific Asset Type" required>
            <AdminSelect
              value={formData.assetType}
              onChange={(e) => setFormData({ ...formData, assetType: e.target.value as MediaAssetType })}
              options={[
                { value: 'logo', label: 'Logo / Crest / Emblem' },
                { value: 'sermon_thumbnail', label: 'Sermon Thumbnail' },
                { value: 'event_graphic', label: 'Event Graphic Poster' },
                { value: 'ministry_image', label: 'Ministry Header Image' },
                { value: 'leadership_photo', label: 'Leadership Portrait Photo' },
                { value: 'church_photo', label: 'Church Sanctuary Photo' },
                { value: 'hero_image', label: 'Website Hero Banner' },
                { value: 'document', label: 'PDF / Resource Document' },
                { value: 'image', label: 'General Image' },
              ]}
            />
          </AdminField>
        </div>

        {/* Source URL & Security Validation */}
        <AdminField label="Public Asset URL / Local Path" required>
          <input
            type="text"
            value={formData.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={`w-full px-3 py-2 text-xs font-mono text-slate-800 bg-white border rounded-xl outline-none ${
              urlError ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-amber-500'
            }`}
            placeholder="https://... or /assets/images/..."
          />
          {urlError && (
            <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> {urlError}
            </p>
          )}
        </AdminField>

        {/* Caption & Description */}
        <AdminField label="Caption / Context Description">
          <textarea
            rows={2}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none"
            placeholder="Brief contextual note about this media asset..."
          />
        </AdminField>

        {/* Status Dropdown */}
        <AdminField label="Publishing Status" required>
          <AdminSelect
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
            options={[
              { value: 'published', label: 'Published (Available on Public Site)' },
              { value: 'pending_verification', label: 'Pending Verification (Draft)' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived (Internal Only)' },
            ]}
          />
        </AdminField>

        {/* Read-Only Infrastructure Parameters */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[10px] font-mono text-slate-600">
          <div className="flex items-center gap-1 text-slate-700 font-bold font-sans text-xs mb-1">
            <Lock className="w-3.5 h-3.5 text-slate-400" /> Infrastructure Metadata (Read-Only)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-400 block">MIME Type:</span>
              <span className="font-semibold text-slate-800">{formData.mimeType || 'image/jpeg'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Storage Path Placeholder:</span>
              <span className="font-semibold text-slate-800">storage/media/{formData.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Source Provider:</span>
              <span className="font-semibold text-slate-800 uppercase">{formData.sourceType}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Uploaded Date:</span>
              <span className="font-semibold text-slate-800">{formData.uploadedAt}</span>
            </div>
          </div>
        </div>
      </form>
    </AdminModal>
  );
};
