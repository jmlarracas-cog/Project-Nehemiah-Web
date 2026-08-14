import React, { useState, useEffect } from 'react';
import { MediaAssetRecord } from '../../types/media';
import { adminService } from '../../services/adminService';
import { validateAssetUrl } from '../../utils/mediaUrlValidation';
import { AdminModal, AdminButton } from './AdminFormControls';
import { Search, Image as ImageIcon, Check, Filter, ExternalLink, HardDrive } from 'lucide-react';

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, altText?: string, asset?: MediaAssetRecord) => void;
  selectedUrl?: string;
  categoryFilter?: string;
  title?: string;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedUrl,
  categoryFilter = 'all',
  title = 'Select Media Asset',
}) => {
  const [assets, setAssets] = useState<MediaAssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(categoryFilter);
  const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');
  const [customUrl, setCustomUrl] = useState(selectedUrl || '');
  const [customAlt, setCustomAlt] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetRecord | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAssets();
    }
  }, [isOpen, activeCategory]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await adminService.getMediaAssets({
        category: activeCategory !== 'all' ? activeCategory : undefined,
      });
      setAssets(data);

      // Preselect matching asset if URL matches
      if (selectedUrl) {
        const match = data.find((a) => a.url === selectedUrl || a.publicPath === selectedUrl);
        if (match) setSelectedAsset(match);
      }
    } catch (err) {
      console.error('Failed to load media assets for picker:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter((a) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.filename.toLowerCase().includes(q) ||
      a.altText.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  });

  const customUrlValidation = validateAssetUrl(customUrl);

  const handleConfirmSelect = () => {
    if (activeTab === 'custom') {
      if (!customUrlValidation.isValid) return;
      onSelect(customUrl.trim(), customAlt.trim() || undefined);
    } else if (selectedAsset) {
      onSelect(selectedAsset.url || selectedAsset.publicPath || '', selectedAsset.altText, selectedAsset);
    }
    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <AdminButton variant="secondary" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton
            variant="gold"
            onClick={handleConfirmSelect}
            disabled={activeTab === 'library' ? !selectedAsset : !customUrlValidation.isValid}
          >
            Confirm Asset Selection
          </AdminButton>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Top Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'library'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Media Library Assets ({filteredAssets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'custom'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Custom Direct URL / Relative Path
          </button>
        </div>

        {activeTab === 'library' ? (
          <>
            {/* Search and Category Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search assets by title or keyword..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-amber-500"
              >
                <option value="all">All Categories</option>
                <option value="branding">Branding & Logos</option>
                <option value="sermons">Sermons</option>
                <option value="events">Events</option>
                <option value="ministries">Ministries</option>
                <option value="churches">Church Locations</option>
                <option value="leadership">Leadership</option>
                <option value="documents">Documents</option>
              </select>
            </div>

            {/* Asset Grid */}
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Loading media library records...
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No matching media assets found in library.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1">
                {filteredAssets.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  const isLogo = asset.isOfficialBrandAsset || asset.assetType === 'logo';

                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`relative rounded-xl border p-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="h-24 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center relative">
                        <img
                          src={asset.url}
                          alt={asset.altText || asset.title}
                          className={`w-full h-full ${isLogo ? 'object-contain p-2' : 'object-cover'}`}
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        <span className="font-bold text-slate-800 text-[11px] block truncate">
                          {asset.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate font-mono">
                          {asset.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3 py-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Direct Asset URL / Relative Path
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://... or /assets/images/my-image.jpg"
                className={`w-full px-3 py-2 border rounded-xl text-xs font-mono outline-none ${
                  customUrl && !customUrlValidation.isValid
                    ? 'border-red-300 bg-red-50/50 text-red-900 focus:border-red-500'
                    : 'border-slate-200 focus:border-amber-500'
                }`}
              />
              {customUrl && !customUrlValidation.isValid && (
                <p className="mt-1 text-[10px] text-red-600 font-medium">{customUrlValidation.error}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Image Alt Text
              </label>
              <input
                type="text"
                value={customAlt}
                onChange={(e) => setCustomAlt(e.target.value)}
                placeholder="Describe image content..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}
      </div>
    </AdminModal>
  );
};
