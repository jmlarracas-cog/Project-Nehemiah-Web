import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { ChurchLocation } from '../../types/church';
import { AdminDataTable, ColumnDef } from '../../components/admin/AdminDataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminModal, AdminButton, AdminField, AdminSelect, AdminStatusSelect } from '../../components/admin/AdminFormControls';
import { VerificationModal } from '../../components/admin/VerificationModal';
import { ContentStatus } from '../../types/about';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

export const AdminChurchesPage: React.FC = () => {
  const [churches, setChurches] = useState<ChurchLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ChurchLocation | null>(null);
  const [verifyingItem, setVerifyingItem] = useState<ChurchLocation | null>(null);

  const loadChurches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getChurches();
      setChurches(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load churches repository');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChurches();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSaving(true);
      setError(null);
      const saved = await adminService.saveChurch(editingItem);
      setChurches((prev) =>
        prev.map((c) => (c.id === saved.id ? saved : c))
      );
      setEditingItem(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save church location');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyConfirm = async (newStatus: ContentStatus, notes: string, verifierName: string) => {
    if (!verifyingItem) return;
    try {
      setSaving(true);
      setError(null);
      const updatedChurch: ChurchLocation = {
        ...verifyingItem,
        status: newStatus,
        meta: {
          status: newStatus,
          notes,
          verifiedBy: verifierName,
          verifiedAt: new Date().toISOString().slice(0, 10),
        },
      };
      const saved = await adminService.saveChurch(updatedChurch);
      setChurches((prev) =>
        prev.map((c) => (c.id === saved.id ? saved : c))
      );
      setVerifyingItem(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to update church location status');
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnDef<ChurchLocation>[] = [
    {
      key: 'name',
      header: 'Candidate Church Location',
      accessor: (c) => (
        <div>
          <span className="font-bold text-slate-900 block">{c.name}</span>
          <span className="text-[11px] text-slate-500">
            {c.city}, {c.province}
          </span>
        </div>
      ),
    },
    {
      key: 'churchType',
      header: 'Location Type',
      accessor: (c) => (
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
            c.isMainBranch ? 'bg-navy text-gold' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {c.churchType}
        </span>
      ),
    },
    {
      key: 'leadership',
      header: 'Assigned Pastor',
      accessor: (c) => (
        <span className="text-slate-800 font-semibold">{c.leadership?.name || 'Pastoral Staff'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Governance Status',
      accessor: (c) => <StatusBadge status={c.status} />,
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
          <span className="text-xs font-semibold text-slate-600">Loading church locations from repository...</span>
        </div>
      ) : (
        <AdminDataTable
          title="Subic & Zambales Candidate Church Locations"
          description="Manage Subic location record and candidate church locations in Zambales province pending official church governance verification."
          data={churches}
          columns={columns}
          searchPlaceholder="Search church names, municipalities, or pastors..."
          onEdit={(c) => {
            setError(null);
            setEditingItem({ ...c });
          }}
          onVerify={(c) => {
            setError(null);
            setVerifyingItem(c);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <AdminModal
          isOpen={Boolean(editingItem)}
          onClose={() => !saving && setEditingItem(null)}
          title={`Edit Location: ${editingItem.name}`}
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
                  'Save Church Location Record'
                )}
              </AdminButton>
            </>
          }
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Location Name" required>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>

              <AdminField label="Short Name / Code" required>
                <input
                  type="text"
                  value={editingItem.shortName}
                  onChange={(e) => setEditingItem({ ...editingItem, shortName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Municipality / City" required>
                <input
                  type="text"
                  value={editingItem.city}
                  onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>

              <AdminField label="Province" required>
                <input
                  type="text"
                  value={editingItem.province}
                  onChange={(e) => setEditingItem({ ...editingItem, province: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>
            </div>

            <AdminField label="Formatted Physical Address" required>
              <input
                type="text"
                value={editingItem.address?.formattedAddress || ''}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    address: {
                      ...editingItem.address,
                      formattedAddress: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <AdminField label="Assigned Resident Pastor" required>
              <input
                type="text"
                value={editingItem.leadership?.name || ''}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    leadership: {
                      ...editingItem.leadership,
                      name: e.target.value,
                      role: editingItem.leadership?.role || 'Resident Pastor',
                      status: editingItem.status,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <AdminField label="Short Description">
              <textarea
                rows={3}
                value={editingItem.shortDescription}
                onChange={(e) => setEditingItem({ ...editingItem, shortDescription: e.target.value })}
                className="w-full p-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <AdminField label="Governance Content Status">
              <AdminStatusSelect
                value={editingItem.status}
                onChange={(val) => setEditingItem({ ...editingItem, status: val })}
              />
            </AdminField>
          </form>
        </AdminModal>
      )}

      {/* Verification Modal */}
      {verifyingItem && (
        <VerificationModal
          isOpen={Boolean(verifyingItem)}
          onClose={() => setVerifyingItem(null)}
          itemTitle={verifyingItem.name}
          itemType="Church Location"
          currentStatus={verifyingItem.status}
          initialNotes={verifyingItem.meta?.notes}
          onConfirmVerification={handleVerifyConfirm}
        />
      )}
    </div>
  );
};
