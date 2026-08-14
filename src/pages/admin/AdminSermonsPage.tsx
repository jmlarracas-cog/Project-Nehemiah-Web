import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Sermon } from '../../types/sermon';
import { AdminDataTable, ColumnDef } from '../../components/admin/AdminDataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminModal, AdminButton, AdminField, AdminCheckbox, AdminStatusSelect, AdminImagePicker } from '../../components/admin/AdminFormControls';
import { VerificationModal } from '../../components/admin/VerificationModal';
import { ContentStatus } from '../../types/about';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

export const AdminSermonsPage: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Sermon | null>(null);
  const [verifyingItem, setVerifyingItem] = useState<Sermon | null>(null);

  const loadSermons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getSermons();
      setSermons(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load sermons repository');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSermons();
  }, []);

  const handleCreateNew = () => {
    setError(null);
    setEditingItem({
      id: `sermon-${Date.now()}`,
      slug: `sermon-message-${Date.now().toString().slice(-4)}`,
      title: 'New Sunday Sermon Title',
      speaker: { name: 'Senior Pastor', role: 'Main Speaker' },
      series: { title: 'Kingdom First' },
      scripture: { reference: 'Matthew 6:33' },
      date: new Date().toISOString().slice(0, 10),
      duration: '45 mins',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=800',
      description: 'An uplifting sermon message diving into God’s word.',
      featured: false,
      status: 'draft',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSaving(true);
      setError(null);
      const saved = await adminService.saveSermon(editingItem);
      setSermons((prev) => {
        const idx = prev.findIndex((s) => s.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      setEditingItem(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save sermon record');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyConfirm = async (newStatus: ContentStatus) => {
    if (!verifyingItem) return;
    try {
      setSaving(true);
      setError(null);
      const updatedSermon: Sermon = { ...verifyingItem, status: newStatus };
      const saved = await adminService.saveSermon(updatedSermon);
      setSermons((prev) =>
        prev.map((s) => (s.id === saved.id ? saved : s))
      );
      setVerifyingItem(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to update sermon status');
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnDef<Sermon>[] = [
    {
      key: 'title',
      header: 'Sermon Title & Series',
      accessor: (s) => (
        <div className="flex items-center gap-3">
          <img
            src={s.thumbnailUrl}
            alt={s.title}
            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
          />
          <div>
            <span className="font-bold text-slate-900 block">{s.title}</span>
            <span className="text-[11px] text-gold font-bold">
              {typeof s.series === 'string' ? s.series : s.series?.title || 'Standalone Message'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'speaker',
      header: 'Speaker & Scripture',
      accessor: (s) => (
        <div>
          <span className="text-slate-800 font-semibold block">
            {typeof s.speaker === 'string' ? s.speaker : s.speaker?.name || 'Guest Speaker'}
          </span>
          <span className="text-[11px] text-slate-500 italic">
            {typeof s.scripture === 'string' ? s.scripture : s.scripture?.reference}
          </span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Preached Date',
      accessor: (s) => <span className="font-medium text-slate-700">{s.date}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (s) => <StatusBadge status={s.status || 'published'} />,
    },
  ];

  return (
    <div className="space-y-6">
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
          <span className="text-xs font-semibold text-slate-600">Loading sermon records from repository...</span>
        </div>
      ) : (
        <AdminDataTable
          title="Sermons & Media Messages"
          description="Manage Sunday preaching messages, series archives, video stream links, and study notes."
          data={sermons}
          columns={columns}
          searchPlaceholder="Search sermon titles, speakers, scriptures, or series..."
          headerButton={
            <AdminButton variant="gold" size="sm" onClick={handleCreateNew}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Sermon
            </AdminButton>
          }
          onEdit={(s) => {
            setError(null);
            setEditingItem({ ...s });
          }}
          onVerify={(s) => {
            setError(null);
            setVerifyingItem(s);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <AdminModal
          isOpen={Boolean(editingItem)}
          onClose={() => !saving && setEditingItem(null)}
          title={`Edit Sermon: ${editingItem.title}`}
          footer={
            <>
              <AdminButton variant="secondary" onClick={() => setEditingItem(null)} disabled={saving}>
                Cancel
              </AdminButton>
              <AdminButton variant="gold" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                ) : (
                  'Save Sermon Record'
                )}
              </AdminButton>
            </>
          }
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <AdminField label="Sermon Title" required>
              <input
                type="text"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Speaker Name" required>
                <input
                  type="text"
                  value={
                    typeof editingItem.speaker === 'string'
                      ? editingItem.speaker
                      : editingItem.speaker?.name || ''
                  }
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      speaker: { name: e.target.value, role: 'Speaker' },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>

              <AdminField label="Sermon Series">
                <input
                  type="text"
                  value={
                    typeof editingItem.series === 'string'
                      ? editingItem.series
                      : editingItem.series?.title || ''
                  }
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      series: { title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Scripture Passage Reference" required>
                <input
                  type="text"
                  value={
                    typeof editingItem.scripture === 'string'
                      ? editingItem.scripture
                      : editingItem.scripture?.reference || ''
                  }
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      scripture: { reference: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>

              <AdminField label="Preached Date" required>
                <input
                  type="date"
                  value={editingItem.date}
                  onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>
            </div>

            <AdminImagePicker
              value={editingItem.thumbnailUrl}
              onChange={(url) => setEditingItem({ ...editingItem, thumbnailUrl: url })}
            />

            <AdminField label="Video Embed Stream URL (YouTube / Vimeo)">
              <input
                type="text"
                value={editingItem.videoUrl || ''}
                onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2 text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <AdminField label="Sermon Summary / Synopsis" required>
              <textarea
                rows={3}
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full p-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminCheckbox
                label="Featured Message"
                description="Display on Home page hero sermon card"
                checked={Boolean(editingItem.featured)}
                onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
              />

              <AdminStatusSelect
                value={editingItem.status || 'draft'}
                onChange={(val) => setEditingItem({ ...editingItem, status: val })}
              />
            </div>
          </form>
        </AdminModal>
      )}

      {/* Verification Modal */}
      {verifyingItem && (
        <VerificationModal
          isOpen={Boolean(verifyingItem)}
          onClose={() => setVerifyingItem(null)}
          itemTitle={verifyingItem.title}
          itemType="Sermon"
          currentStatus={verifyingItem.status || 'published'}
          onConfirmVerification={handleVerifyConfirm}
        />
      )}
    </div>
  );
};
