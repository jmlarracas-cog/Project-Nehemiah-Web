import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { getPrayerSubmissionRepository } from '../../repositories/private';
import { PrayerSubmissionRecord, PrayerSubmissionStatus } from '../../types/admin';
import { AdminDataTable, ColumnDef } from '../../components/admin/AdminDataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminModal, AdminButton, AdminField, AdminSelect } from '../../components/admin/AdminFormControls';
import { PermissionGate } from '../../components/admin/PermissionGate';
import { useAuthorization } from '../../context/AuthorizationContext';
import { Lock } from 'lucide-react';

export const AdminPrayerPage: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerSubmissionRecord[]>([]);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerSubmissionRecord | null>(null);
  const { hasPermission } = useAuthorization();

  useEffect(() => {
    adminService.getPrayerSubmissions().then(setPrayers);
  }, []);

  const handleUpdateStatus = async (newStatus: PrayerSubmissionStatus, notes?: string, assignedTo?: string) => {
    if (!selectedPrayer) return;

    try {
      const repo = getPrayerSubmissionRepository();
      const updated = await repo.updateStatus(selectedPrayer.id, newStatus, notes, assignedTo);
      setPrayers((prev) => prev.map((p) => (p.id === selectedPrayer.id ? updated : p)));
    } catch {
      // Fallback local state update if error
      setPrayers((prev) =>
        prev.map((p) =>
          p.id === selectedPrayer.id
            ? {
                ...p,
                status: newStatus,
                internalNotes: notes ?? p.internalNotes,
                assignedTo: assignedTo ?? p.assignedTo,
              }
            : p
        )
      );
    } finally {
      setSelectedPrayer(null);
    }
  };

  const columns: ColumnDef<PrayerSubmissionRecord>[] = [
    {
      key: 'referenceId',
      header: 'Ref ID & Date',
      accessor: (p) => (
        <div>
          <span className="font-mono font-bold text-navy block">{p.referenceId}</span>
          <span className="text-[10px] text-slate-400">{p.createdAt}</span>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Submitter Info',
      accessor: (p) => (
        <div>
          <span className="font-bold text-slate-900 block">
            {p.isAnonymous ? 'Anonymous Member' : p.name}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            Contact: {p.contactPreference}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Prayer Category',
      accessor: (p) => (
        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px] uppercase tracking-wider">
          {p.category}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Intercession Status',
      accessor: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: 'assignedTo',
      header: 'Assigned Care Lead',
      accessor: (p) => (
        <span className="text-slate-700 font-semibold">{p.assignedTo || 'Unassigned'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <div className="bg-purple-950 text-purple-100 p-5 rounded-2xl border border-purple-800 flex items-start gap-3 shadow-xs">
        <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Private Ministry Submission Boundary
          </h3>
          <p className="text-xs text-purple-200 mt-0.5 leading-relaxed">
            Prayer request submissions are restricted to authorized prayer ministry personnel (<code className="font-mono text-gold text-[11px]">PRAYER_ADMIN</code> / <code className="font-mono text-gold text-[11px]">SUPER_ADMIN</code>). Submissions are never indexed in public site search or exposed to unauthorized accounts.
          </p>
        </div>
      </div>

      <AdminDataTable
        title="Intercessory Prayer Submissions"
        description="Private ministry submissions logged via the prayer request submission portal."
        data={prayers}
        columns={columns}
        searchPlaceholder="Search reference IDs, categories, or assigned leads..."
        onView={(p) => setSelectedPrayer({ ...p })}
        onEdit={hasPermission('prayer.update') ? (p) => setSelectedPrayer({ ...p }) : undefined}
      />

      {/* Prayer Details & Care Modal */}
      {selectedPrayer && (
        <AdminModal
          isOpen={Boolean(selectedPrayer)}
          onClose={() => setSelectedPrayer(null)}
          title={`Private Prayer Request Submission — ${selectedPrayer.referenceId}`}
          subtitle={`Submitted on ${selectedPrayer.createdAt}`}
          footer={
            <>
              <AdminButton variant="secondary" onClick={() => setSelectedPrayer(null)}>
                Close
              </AdminButton>
              <PermissionGate
                permission="prayer.update"
                fallback={
                  <button
                    disabled
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-200 text-slate-400 cursor-not-allowed flex items-center gap-1"
                    title="Requires prayer.update permission"
                  >
                    <Lock className="w-3.5 h-3.5" /> Read-Only Mode
                  </button>
                }
              >
                <AdminButton
                  variant="gold"
                  onClick={() =>
                    handleUpdateStatus(
                      selectedPrayer.status,
                      selectedPrayer.internalNotes,
                      selectedPrayer.assignedTo
                    )
                  }
                >
                  Save Pastoral Care Status
                </AdminButton>
              </PermissionGate>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Submitter Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Submitter Name</span>
                <span className="font-bold text-slate-900">{selectedPrayer.isAnonymous ? 'Anonymous' : selectedPrayer.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Contact Preference</span>
                <span className="font-semibold text-slate-800 capitalize">{selectedPrayer.contactPreference}</span>
              </div>
              {selectedPrayer.email && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
                  <span className="font-mono text-slate-700">{selectedPrayer.email}</span>
                </div>
              )}
              {selectedPrayer.phone && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone Contact</span>
                  <span className="font-mono text-slate-700">{selectedPrayer.phone}</span>
                </div>
              )}
            </div>

            {/* Request Content */}
            <AdminField label="Prayer Intent / Request Text">
              <div className="p-4 bg-purple-50/50 border border-purple-200/80 rounded-xl font-serif text-slate-800 text-sm leading-relaxed italic">
                "{selectedPrayer.request}"
              </div>
            </AdminField>

            {/* Status Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Intercession Workflow Status" required>
                <AdminSelect
                  value={selectedPrayer.status}
                  disabled={!hasPermission('prayer.update')}
                  onChange={(e) =>
                    setSelectedPrayer({
                      ...selectedPrayer,
                      status: e.target.value as PrayerSubmissionStatus,
                    })
                  }
                  options={[
                    { value: 'new', label: 'New Submission' },
                    { value: 'praying', label: 'In Active Prayer (Assigned)' },
                    { value: 'followed_up', label: 'Pastoral Follow-Up Completed' },
                    { value: 'archived', label: 'Archived / Closed' },
                  ]}
                />
              </AdminField>

              <AdminField label="Assigned Pastoral Lead">
                <input
                  type="text"
                  value={selectedPrayer.assignedTo || ''}
                  disabled={!hasPermission('prayer.update')}
                  onChange={(e) =>
                    setSelectedPrayer({ ...selectedPrayer, assignedTo: e.target.value })
                  }
                  placeholder="e.g. Pastoral Care Team Lead"
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold disabled:bg-slate-100 disabled:text-slate-500"
                />
              </AdminField>
            </div>

            {/* Internal Notes */}
            <AdminField label="Internal Pastoral Care Notes (Private)">
              <textarea
                rows={3}
                value={selectedPrayer.internalNotes || ''}
                disabled={!hasPermission('prayer.update')}
                onChange={(e) =>
                  setSelectedPrayer({ ...selectedPrayer, internalNotes: e.target.value })
                }
                placeholder="Log internal follow-up phone calls, encouragement texts, or prayer list assignment..."
                className="w-full p-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold disabled:bg-slate-100 disabled:text-slate-500"
              />
            </AdminField>
          </div>
        </AdminModal>
      )}
    </div>
  );
};
