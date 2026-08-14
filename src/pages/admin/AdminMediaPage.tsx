import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { MediaAssetRecord, MediaAssetType } from '../../types/media';
import { MediaAssetCard } from '../../components/admin/MediaAssetCard';
import { MediaEditModal } from '../../components/admin/MediaEditModal';
import { AdminDataTable, ColumnDef } from '../../components/admin/AdminDataTable';
import { AdminButton } from '../../components/admin/AdminFormControls';
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  ShieldCheck,
  HardDrive,
  Info,
  Archive,
  FolderOpen,
} from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const [media, setMedia] = useState<MediaAssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAsset, setEditingAsset] = useState<MediaAssetRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, [activeCategory]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await adminService.getMediaAssets({
        category: activeCategory !== 'all' ? activeCategory : undefined,
      });
      setMedia(data);
    } catch (err) {
      console.error('Failed to fetch media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      loadMedia();
      return;
    }
    setLoading(true);
    try {
      const results = await adminService.searchMediaAssets(term);
      setMedia(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    const newAsset: MediaAssetRecord = {
      id: `media-${Date.now()}`,
      filename: `church_asset_${Date.now()}.jpg`,
      title: 'New Media Asset Reference',
      description: 'Media asset metadata reference for church web publishing.',
      assetType: 'image',
      mimeType: 'image/jpeg',
      extension: 'jpg',
      sourceType: 'local',
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
      publicPath: '/images/events/church-event-poster.jpg',
      altText: 'Church worship gathering graphic',
      alt: 'Church worship gathering graphic',
      category: activeCategory !== 'all' ? activeCategory : 'general',
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: 'Church Secretariat',
      status: 'published',
      isOfficialBrandAsset: false,
      usageCount: 0,
    };
    setEditingAsset(newAsset);
    setIsModalOpen(true);
  };

  const handleSaveAsset = async (updatedAsset: MediaAssetRecord) => {
    try {
      await adminService.saveMediaAsset(updatedAsset);
      showToast(`Asset "${updatedAsset.title}" metadata saved successfully.`);
      setIsModalOpen(false);
      setEditingAsset(null);
      loadMedia();
    } catch (err) {
      console.error('Failed to save asset:', err);
      showToast('Error saving asset metadata.');
    }
  };

  const handleArchiveAsset = async (asset: MediaAssetRecord) => {
    if (asset.isOfficialBrandAsset) {
      showToast('Protection Notice: Official Church brand assets cannot be archived.');
      return;
    }
    if (confirm(`Are you sure you want to archive media asset "${asset.title}"?`)) {
      try {
        await adminService.archiveMediaAsset(asset.id);
        showToast(`Asset "${asset.title}" archived.`);
        loadMedia();
      } catch (err) {
        console.error('Failed to archive asset:', err);
        showToast('Error archiving asset.');
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredMedia = media.filter((m) => {
    if (activeCategory !== 'all' && m.category !== activeCategory) return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.filename.toLowerCase().includes(q) ||
      m.altText.toLowerCase().includes(q) ||
      m.url.toLowerCase().includes(q)
    );
  });

  const tableColumns: ColumnDef<MediaAssetRecord>[] = [
    {
      key: 'title',
      header: 'Asset & Preview',
      accessor: (m) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
            <img
              src={m.url}
              alt={m.altText || m.title}
              className={`w-full h-full ${m.isOfficialBrandAsset ? 'object-contain p-1' : 'object-cover'}`}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 block">{m.title || m.filename}</span>
              {m.isOfficialBrandAsset && (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" title="Official Brand Asset" />
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono truncate max-w-xs block">{m.url}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      accessor: (m) => (
        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase tracking-wider font-sans">
          {m.category}
        </span>
      ),
    },
    {
      key: 'assetType',
      header: 'Type',
      accessor: (m) => (
        <span className="text-[11px] font-medium text-slate-600 font-mono">
          {m.assetType}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (m) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
            m.status === 'published'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : m.status === 'pending_verification'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {m.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'uploadedAt',
      header: 'Uploaded Date',
      accessor: (m) => (
        <div>
          <span className="font-medium text-slate-800 block text-xs">{m.uploadedAt}</span>
          <span className="text-[10px] text-slate-400">by {m.uploadedBy}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="p-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <FolderOpen className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Media Library & Asset Management</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Central metadata catalog for church logos, sermon graphics, event flyers, and ministry photo assets.
              </p>
            </div>
          </div>
        </div>

        <AdminButton variant="gold" onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Media Reference
        </AdminButton>
      </div>

      {/* Notice on Local Asset Architecture */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-3">
        <HardDrive className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-800 block">Metadata Storage Foundation (Stage 6I)</span>
          <p className="text-[11px] leading-relaxed text-slate-600">
            The Media Library maintains structured asset records with metadata (alt text, dimensions, asset category, official brand protection flags). Binary file uploads currently reference local/static paths and verified public URLs without requiring cloud storage deployment or Blaze billing.
          </p>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'branding', label: 'Branding & Logos' },
            { id: 'sermons', label: 'Sermons' },
            { id: 'events', label: 'Events' },
            { id: 'ministries', label: 'Ministries' },
            { id: 'churches', label: 'Church Locations' },
            { id: 'leadership', label: 'Leadership' },
            { id: 'documents', label: 'Documents' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input & View Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search title, alt, or filename..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-amber-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid Visual Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-amber-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List Data Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog View Container */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          Loading Media Library assets...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No media assets found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No assets match the selected category filter or search criteria.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMedia.map((asset) => (
            <MediaAssetCard
              key={asset.id}
              asset={asset}
              onEdit={(a) => {
                setEditingAsset(a);
                setIsModalOpen(true);
              }}
              onArchive={handleArchiveAsset}
            />
          ))}
        </div>
      ) : (
        <AdminDataTable
          title="Media Asset Catalog"
          data={filteredMedia}
          columns={tableColumns}
          onEdit={(a) => {
            setEditingAsset(a);
            setIsModalOpen(true);
          }}
          onDelete={handleArchiveAsset}
        />
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <MediaEditModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAsset(null);
          }}
          asset={editingAsset}
          onSave={handleSaveAsset}
        />
      )}
    </div>
  );
};
