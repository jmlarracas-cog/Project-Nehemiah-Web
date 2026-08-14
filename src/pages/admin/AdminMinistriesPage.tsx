import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Ministry } from '../../types/ministry';
import { AdminDataTable, ColumnDef } from '../../components/admin/AdminDataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminModal, AdminButton, AdminField, AdminSelect, AdminCheckbox, AdminStatusSelect, AdminImagePicker } from '../../components/admin/AdminFormControls';
import { VerificationModal } from '../../components/admin/VerificationModal';
import { ContentStatus } from '../../types/about';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

export const AdminMinistriesPage: React.FC = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Ministry | null>(null);
  const [verifyingItem, setVerifyingItem] = useState<Ministry | null>(null);

  const loadMinistries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getMinistries();
      setMinistries(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load ministries repository');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMinistries();
  }, []);

  const handleCreateNew = () => {
    setError(null);
    setEditingItem({
      id: `min-${Date.now()}`,
      slug: `ministry-${Date.now().toString().slice(-4)}`,
      name: 'New Ministry Department',
      tagline: 'Empowering believers through dedicated ministry',
      description: 'Detailed description of the new ministry department and core activities.',
      category: 'Discipleship',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
      leader: { name: 'Ministry Director', position: 'Department Lead' },
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
      const saved = await adminService.saveMinistry(editingItem);
      setMinistries((prev) => {
        const idx = prev.findIndex((m) => m.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      setEditingItem(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save ministry record');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyConfirm = async (newStatus: ContentStatus) => {
    if (!verifyingItem) return;
    try {
      setSaving(true);
      setError(null);
      const updatedItem: Ministry = { ...verifyingItem, status: newStatus };
      const saved = await adminService.saveMinistry(updatedItem);
      setMinistries((prev) =>
        prev.map((m) => (m.id === saved.id ? saved : m))
      );
      setVerifyingItem(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to update ministry status');
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnDef<Ministry>[] = [
    {
      key: 'name',
      header: 'Ministry Name & Tagline',
      accessor: (m) => (
        <div className="flex items-center gap-3">
          <img src={m.imageUrl} alt={m.name} className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200" />
          <div>
            <span className="font-bold text-slate-900 block">{m.name}</span>
            <span className="text-[11px] text-slate-500 line-clamp-1">{m.tagline}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      accessor: (m) => (
        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
          {m.category || 'General'}
        </span>
      ),
    },
    {
      key: 'leader',
      header: 'Department Leader',
      accessor: (m) => (
        <span className="text-slate-700 font-medium">
          {typeof m.leader === 'string' ? m.leader : m.leader?.name || 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (m) => <StatusBadge status={m.status || 'published'} />,
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
          <span className="text-xs font-semibold text-slate-600">Loading ministry records from repository...</span>
        </div>
      ) : (
        <AdminDataTable
          title="Department Ministries"
          description="Manage church ministries, age-group departments, leaders, and meeting schedules."
          data={ministries}
          columns={columns}
          searchPlaceholder="Search ministries, tags, or leaders..."
          headerButton={
            <AdminButton variant="gold" size="sm" onClick={handleCreateNew}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Ministry
            </AdminButton>
          }
          onEdit={(m) => {
            setError(null);
            setEditingItem({ ...m });
          }}
          onVerify={(m) => {
            setError(null);
            setVerifyingItem(m);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <AdminModal
          isOpen={Boolean(editingItem)}
          onClose={() => !saving && setEditingItem(null)}
          title={editingItem.id.startsWith('min-') ? 'Create Ministry' : `Edit Ministry: ${editingItem.name}`}
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
                  'Save Ministry Details'
                )}
              </AdminButton>
            </>
          }
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Ministry Name" required>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>

              <AdminField label="Slug URL" required>
                <input
                  type="text"
                  value={editingItem.slug}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>
            </div>

            <AdminField label="Tagline / Short Summary" required>
              <input
                type="text"
                value={editingItem.tagline || ''}
                onChange={(e) => setEditingItem({ ...editingItem, tagline: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <AdminField label="Category">
              <AdminSelect
                value={editingItem.category || 'Discipleship'}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                options={[
                  { value: 'Discipleship', label: 'Discipleship & Word' },
                  { value: 'Next Generation', label: 'Next Generation (Kids & Youth)' },
                  { value: 'Worship', label: 'Worship & Arts' },
                  { value: 'Outreach', label: 'Outreach & Missions' },
                  { value: 'Relationships', label: 'Family & Relationships' },
                ]}
              />
            </AdminField>

            <AdminImagePicker
              value={editingItem.imageUrl}
              onChange={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
            />

            <AdminField label="Full Description" required>
              <textarea
                rows={4}
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full p-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminCheckbox
                label="Featured Ministry"
                description="Highlight on Home page"
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
          itemTitle={verifyingItem.name}
          itemType="Ministry"
          currentStatus={verifyingItem.status || 'published'}
          onConfirmVerification={handleVerifyConfirm}
        />
      )}
    </div>
  );
};
