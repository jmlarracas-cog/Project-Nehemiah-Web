import React, { useState } from 'react';
import { MediaAssetRecord } from '../../types/media';
import {
  ShieldCheck,
  Copy,
  Check,
  FileText,
  Edit2,
  Archive,
  AlertTriangle,
  Globe,
  HardDrive,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface MediaAssetCardProps {
  asset: MediaAssetRecord;
  onEdit: (asset: MediaAssetRecord) => void;
  onArchive: (asset: MediaAssetRecord) => void;
  onView?: (asset: MediaAssetRecord) => void;
}

export const MediaAssetCard: React.FC<MediaAssetCardProps> = ({
  asset,
  onEdit,
  onArchive,
  onView,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    const path = asset.publicPath || asset.url;
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLogoOrBrand = asset.isOfficialBrandAsset || asset.assetType === 'logo' || asset.category === 'branding';
  const isDocument = asset.assetType === 'document' || asset.mimeType === 'application/pdf';
  const hasMissingAltText = (!asset.altText || asset.altText.trim() === '') && asset.status === 'published';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group relative">
      {/* Top Preview Canvas */}
      <div className="relative h-44 bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
        {/* Background checkerboard pattern for transparent vector logos */}
        {isLogoOrBrand && (
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(#94a3b8 0.75px, transparent 0.75px), radial-gradient(#94a3b8 0.75px, #f8fafc 0.75px)',
              backgroundSize: '12px 12px',
              backgroundPosition: '0 0, 6px 6px',
            }}
          />
        )}

        {isDocument ? (
          <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-2 shadow-xs">
              <FileText className="w-7 h-7" />
            </div>
            <span className="font-bold text-xs text-slate-800 line-clamp-1">{asset.filename}</span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">{asset.extension.toUpperCase()} • {asset.fileSize || 'PDF Document'}</span>
          </div>
        ) : (
          <img
            src={asset.url}
            alt={asset.altText || asset.title}
            className={`w-full h-full ${
              isLogoOrBrand ? 'object-contain p-4' : 'object-cover group-hover:scale-105 transition-transform duration-300'
            }`}
          />
        )}

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[80%]">
          {asset.isOfficialBrandAsset && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] shadow-xs">
              <ShieldCheck className="w-3 h-3" /> Official Brand
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/85 text-white font-medium text-[10px] backdrop-blur-xs">
            {asset.assetType.replace('_', ' ')}
          </span>
        </div>

        {/* Source Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/90 text-slate-700 text-[10px] font-mono border border-slate-200/80 shadow-xs">
            {asset.sourceType === 'local' ? (
              <>
                <HardDrive className="w-2.5 h-2.5 text-slate-500" /> Local
              </>
            ) : (
              <>
                <Globe className="w-2.5 h-2.5 text-blue-500" /> External
              </>
            )}
          </span>
        </div>

        {/* Missing Alt Text Warning */}
        {hasMissingAltText && (
          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-amber-500/90 text-slate-950 font-semibold text-[10px] rounded-md backdrop-blur-xs flex items-center gap-1 shadow-xs">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span className="truncate">Missing accessibility alt text</span>
          </div>
        )}
      </div>

      {/* Card Body Information */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-amber-600 transition-colors">
              {asset.title || asset.filename}
            </h3>
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider shrink-0 ${
                asset.status === 'published'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : asset.status === 'pending_verification'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {asset.status.replace('_', ' ')}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-normal">
            {asset.description || asset.altText || 'No asset description added.'}
          </p>
        </div>

        {/* Technical Properties Footer */}
        <div className="space-y-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
          <div className="flex items-center justify-between">
            <span className="truncate text-slate-400">Dimensions / Size:</span>
            <span className="text-slate-700 font-medium">{asset.dimensions || 'N/A'} ({asset.fileSize || 'N/A'})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="truncate text-slate-400">Category Tag:</span>
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-semibold uppercase font-sans">
              {asset.category}
            </span>
          </div>

          {typeof asset.usageCount === 'number' && asset.usageCount > 0 && (
            <div className="flex items-center gap-1 text-slate-500 font-sans text-[10px]">
              <Layers className="w-3 h-3 text-amber-500" />
              <span>Referenced in <strong>{asset.usageCount}</strong> church CMS location{asset.usageCount > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Card Actions Footer Toolbar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Copy Public URL / Asset Path"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-500" />
                <span>Copy Path</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1">
            {onView && (
              <button
                type="button"
                onClick={() => onView(asset)}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="View Full Preview"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onEdit(asset)}
              className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Asset Metadata"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => !asset.isOfficialBrandAsset && onArchive(asset)}
              disabled={asset.isOfficialBrandAsset}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                asset.isOfficialBrandAsset
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
              }`}
              title={
                asset.isOfficialBrandAsset
                  ? 'Official brand assets cannot be archived or deleted'
                  : 'Archive Asset Metadata'
              }
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
