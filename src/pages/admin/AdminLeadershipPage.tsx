import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { LeadershipMember } from '../../types/about';
import { AdminDataTable, ColumnDef } from '../../components/admin/AdminDataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminModal, AdminButton, AdminField, AdminStatusSelect, AdminImagePicker } from '../../components/admin/AdminFormControls';
import { VerificationModal } from '../../components/admin/VerificationModal';
import { ContentStatus } from '../../types/about';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

export const AdminLeadershipPage: React.FC = () => {
  const [leadership, setLeadership] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<LeadershipMember | null>(null);

  const loadLeadership = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getLeadership();
      setLeadership(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load leadership roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeadership();
  }, []);

  const handleCreateNew = () => {
    setError(null);
    setEditingItem({
      id: `lead-${Date.now()}`,
      name: 'Pastor / Director Name',
      title: 'Senior Leadership Title',
      role: 'Department Oversight',
      bio: 'Dedicated servant leader overseeing church ministries and community care.',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
      email: 'pastor@subiccog.org',
      displayOrder: leadership.length + 1,
      status: 'draft',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSaving(true);
      setError(null);
      const saved = await adminService.saveLeadership(editingItem);
      setLeadership((prev) => {
        const idx = prev.findIndex((l) => l.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      setEditingItem(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save leadership record');
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnDef<LeadershipMember>[] = [
    {
      key: 'name',
      header: 'Leader Name & Role',
      accessor: (l) => (
        <div className="flex items-center gap-3">
          <img src={l.imageUrl} alt={l.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
          <div>
            <span className="font-bold text-slate-900 block">{l.name}</span>
            <span className="text-[11px] font-semibold text-gold">{l.title}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact Email',
      accessor: (l) => <span className="font-mono text-slate-600">{l.email || 'N/A'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (l) => <StatusBadge status={l.status || 'published'} />,
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
          <span className="text-xs font-semibold text-slate-600">Loading leadership roster from repository...</span>
        </div>
      ) : (
        <AdminDataTable
          title="Leadership Roster [Demo / Pending Verification]"
          description="Manage leadership profiles. Unverified demo or placeholder profiles are identified and queued for official secretariat confirmation."
          data={leadership}
          columns={columns}
          searchPlaceholder="Search pastor names, titles, roles..."
          headerButton={
            <AdminButton variant="gold" size="sm" onClick={handleCreateNew}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Leader
            </AdminButton>
          }
          onEdit={(l) => {
            setError(null);
            setEditingItem({ ...l });
          }}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <AdminModal
          isOpen={Boolean(editingItem)}
          onClose={() => !saving && setEditingItem(null)}
          title={`Edit Leader: ${editingItem.name}`}
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
                  'Save Leader Record'
                )}
              </AdminButton>
            </>
          }
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Full Name" required>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>

              <AdminField label="Official Title" required>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Contact Email">
                <input
                  type="email"
                  value={editingItem.email || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>

              <AdminField label="Display Order Sequence">
                <input
                  type="number"
                  value={editingItem.displayOrder}
                  onChange={(e) => setEditingItem({ ...editingItem, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>
            </div>

            <AdminImagePicker
              value={editingItem.imageUrl}
              onChange={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
            />

            <AdminField label="Biography & Pastoral Focus" required>
              <textarea
                rows={4}
                value={editingItem.bio}
                onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                className="w-full p-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <AdminStatusSelect
              value={editingItem.status || 'draft'}
              onChange={(val) => setEditingItem({ ...editingItem, status: val })}
            />
          </form>
        </AdminModal>
      )}
    </div>
  );
};
