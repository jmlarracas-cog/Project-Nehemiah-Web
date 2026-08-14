import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { getContactInquiryRepository } from '../../repositories/private';
import { ContactInquiryRecord, ContactInquiryStatus } from '../../types/admin';
import { AdminDataTable, ColumnDef } from '../../components/admin/AdminDataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminModal, AdminButton, AdminField, AdminSelect } from '../../components/admin/AdminFormControls';
import { PermissionGate } from '../../components/admin/PermissionGate';
import { useAuthorization } from '../../context/AuthorizationContext';
import { Lock } from 'lucide-react';

export const AdminContactPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactInquiryRecord[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryRecord | null>(null);
  const { hasPermission } = useAuthorization();

  useEffect(() => {
    adminService.getContactInquiries().then(setInquiries);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    try {
      const repo = getContactInquiryRepository();
      const updated = await repo.updateStatus(
        selectedInquiry.id,
        selectedInquiry.status,
        selectedInquiry.internalNotes,
        selectedInquiry.assignedTo
      );
      setInquiries((prev) => prev.map((i) => (i.id === selectedInquiry.id ? updated : i)));
    } catch {
      setInquiries((prev) =>
        prev.map((i) => (i.id === selectedInquiry.id ? selectedInquiry : i))
      );
    } finally {
      setSelectedInquiry(null);
    }
  };

  const columns: ColumnDef<ContactInquiryRecord>[] = [
    {
      key: 'referenceId',
      header: 'Ref ID & Date',
      accessor: (i) => (
        <div>
          <span className="font-mono font-bold text-navy block">{i.referenceId}</span>
          <span className="text-[10px] text-slate-400">{i.createdAt}</span>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Sender Details',
      accessor: (i) => (
        <div>
          <span className="font-bold text-slate-900 block">{i.name}</span>
          <span className="text-[11px] text-slate-500 font-mono">{i.email}</span>
        </div>
      ),
    },
    {
      key: 'topic',
      header: 'Inquiry Topic',
      accessor: (i) => (
        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
          {i.topic}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (i) => <StatusBadge status={i.status} />,
    },
    {
      key: 'assignedTo',
      header: 'Assigned Department',
      accessor: (i) => <span className="font-semibold text-slate-700">{i.assignedTo || 'Secretariat'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminDataTable
        title="Visitor Contact Inquiries"
        description="Questions, service requests, and general messages submitted via the contact form."
        data={inquiries}
        columns={columns}
        searchPlaceholder="Search reference IDs, senders, topics..."
        onView={(i) => setSelectedInquiry({ ...i })}
        onEdit={hasPermission('contact.update') ? (i) => setSelectedInquiry({ ...i }) : undefined}
      />

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <AdminModal
          isOpen={Boolean(selectedInquiry)}
          onClose={() => setSelectedInquiry(null)}
          title={`Contact Inquiry [${selectedInquiry.referenceId}]`}
          subtitle={`Submitted on ${selectedInquiry.createdAt}`}
          footer={
            <>
              <AdminButton variant="secondary" onClick={() => setSelectedInquiry(null)}>
                Cancel
              </AdminButton>
              <PermissionGate
                permission="contact.update"
                fallback={
                  <button
                    disabled
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-200 text-slate-400 cursor-not-allowed flex items-center gap-1"
                    title="Requires contact.update permission"
                  >
                    <Lock className="w-3.5 h-3.5" /> Read-Only Mode
                  </button>
                }
              >
                <AdminButton variant="gold" onClick={handleUpdate}>
                  Save Inquiry Status
                </AdminButton>
              </PermissionGate>
            </>
          }
        >
          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Sender Name</span>
                <span className="font-bold text-slate-900">{selectedInquiry.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Inquiry Topic</span>
                <span className="font-semibold text-slate-800">{selectedInquiry.topic}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
                <span className="font-mono text-slate-700">{selectedInquiry.email}</span>
              </div>
              {selectedInquiry.phone && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone Contact</span>
                  <span className="font-mono text-slate-700">{selectedInquiry.phone}</span>
                </div>
              )}
            </div>

            <AdminField label="Inquiry Message Body">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-slate-800 leading-relaxed text-xs">
                {selectedInquiry.message}
              </div>
            </AdminField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Inquiry Processing Status" required>
                <AdminSelect
                  value={selectedInquiry.status}
                  disabled={!hasPermission('contact.update')}
                  onChange={(e) =>
                    setSelectedInquiry({
                      ...selectedInquiry,
                      status: e.target.value as ContactInquiryStatus,
                    })
                  }
                  options={[
                    { value: 'new', label: 'New / Unprocessed' },
                    { value: 'in_progress', label: 'In Progress / Assigned' },
                    { value: 'responded', label: 'Responded / Closed' },
                    { value: 'archived', label: 'Archived' },
                  ]}
                />
              </AdminField>

              <AdminField label="Assigned Secretariat Lead">
                <input
                  type="text"
                  value={selectedInquiry.assignedTo || ''}
                  disabled={!hasPermission('contact.update')}
                  onChange={(e) =>
                    setSelectedInquiry({ ...selectedInquiry, assignedTo: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold disabled:bg-slate-100 disabled:text-slate-500"
                />
              </AdminField>
            </div>

            <AdminField label="Internal Handling Notes">
              <textarea
                rows={3}
                value={selectedInquiry.internalNotes || ''}
                disabled={!hasPermission('contact.update')}
                onChange={(e) =>
                  setSelectedInquiry({ ...selectedInquiry, internalNotes: e.target.value })
                }
                placeholder="Log internal follow-up, assigned department, or response summary..."
                className="w-full p-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold disabled:bg-slate-100 disabled:text-slate-500"
              />
            </AdminField>
          </form>
        </AdminModal>
      )}
    </div>
  );
};
