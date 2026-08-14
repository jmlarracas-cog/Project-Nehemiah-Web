import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { GovernanceQueueItem } from '../../types/admin';
import { AdminDataTable, ColumnDef } from '../../components/admin/AdminDataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { VerificationModal } from '../../components/admin/VerificationModal';
import { ContentStatus } from '../../types/about';
import { ShieldCheck, CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';

export const AdminGovernancePage: React.FC = () => {
  const [queue, setQueue] = useState<GovernanceQueueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQueueItem, setSelectedQueueItem] = useState<GovernanceQueueItem | null>(null);

  const loadQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getGovernanceQueue();
      setQueue(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load governance queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleVerifyConfirm = async (newStatus: ContentStatus, notes: string, verifierName: string) => {
    if (!selectedQueueItem) return;

    try {
      setSaving(true);
      setError(null);
      await adminService.verifyQueueItem(selectedQueueItem.id, newStatus, notes, verifierName);
      setQueue((prev) => prev.filter((i) => i.id !== selectedQueueItem.id));
      setSelectedQueueItem(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to update governance review item');
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnDef<GovernanceQueueItem>[] = [
    {
      key: 'title',
      header: 'Submitted Title & Content Type',
      accessor: (item) => (
        <div>
          <span className="font-bold text-slate-900 block">{item.title}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {item.contentType}
          </span>
        </div>
      ),
    },
    {
      key: 'submittedBy',
      header: 'Submitter & Date',
      accessor: (item) => (
        <div>
          <span className="font-semibold text-slate-800 block">{item.submittedBy}</span>
          <span className="text-[10px] text-slate-400">{item.submittedAt}</span>
        </div>
      ),
    },
    {
      key: 'currentStatus',
      header: 'Current Status',
      accessor: (item) => <StatusBadge status={item.currentStatus} />,
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
          <span className="text-xs font-semibold text-slate-600">Loading governance queue from repository...</span>
        </div>
      ) : (
        <AdminDataTable
          title="Central Content Governance & Review Queue"
          description="Review, verify scripture accuracy, and approve submitted draft items across all site modules."
          data={queue}
          columns={columns}
          searchPlaceholder="Search queue by title, content type, or submitter..."
          onVerify={(item) => {
            setError(null);
            setSelectedQueueItem(item);
          }}
        />
      )}

      {selectedQueueItem && (
        <VerificationModal
          isOpen={Boolean(selectedQueueItem)}
          onClose={() => !saving && setSelectedQueueItem(null)}
          itemTitle={selectedQueueItem.title}
          itemType={selectedQueueItem.contentType}
          currentStatus={selectedQueueItem.currentStatus}
          initialNotes={selectedQueueItem.verificationNotes}
          onConfirmVerification={handleVerifyConfirm}
        />
      )}
    </div>
  );
};
