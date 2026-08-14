import React, { useState } from 'react';
import { AdminModal, AdminButton, AdminField, AdminSelect } from './AdminFormControls';
import { StatusBadge } from './StatusBadge';
import { ContentStatus } from '../../types/about';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemType: string;
  currentStatus: ContentStatus;
  initialNotes?: string;
  onConfirmVerification: (newStatus: ContentStatus, notes: string, verifierName: string) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  itemTitle,
  itemType,
  currentStatus,
  initialNotes = '',
  onConfirmVerification,
}) => {
  const [targetStatus, setTargetStatus] = useState<ContentStatus>('published');
  const [verifierName, setVerifierName] = useState('Church Secretariat');
  const [notes, setNotes] = useState(initialNotes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmVerification(targetStatus, notes, verifierName);
    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Content Governance & Verification Review"
      subtitle={`Reviewing ${itemType}: "${itemTitle}"`}
      maxWidth="md"
      footer={
        <>
          <AdminButton variant="secondary" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton variant="gold" onClick={handleSubmit}>
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            Apply Governance Decision
          </AdminButton>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Current State Summary */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Current Record Status
            </span>
            <StatusBadge status={currentStatus} />
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Content Type
            </span>
            <span className="font-semibold text-slate-800 capitalize">{itemType}</span>
          </div>
        </div>

        {/* Verification Target Status */}
        <AdminField label="Governance Action / Target Status" required>
          <AdminSelect
            value={targetStatus}
            onChange={(e) => setTargetStatus(e.target.value as ContentStatus)}
            options={[
              { value: 'published', label: 'Approve & Publish (Show on Public Site)' },
              { value: 'pending_verification', label: 'Keep in Pending Verification Queue' },
              { value: 'draft', label: 'Return to Draft (Needs Content Revisions)' },
              { value: 'archived', label: 'Archive Record (Hide from Public Site)' },
            ]}
          />
        </AdminField>

        {/* Verifier Name */}
        <AdminField label="Verified By (Official Role or Name)" required>
          <input
            type="text"
            value={verifierName}
            onChange={(e) => setVerifierName(e.target.value)}
            className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
            placeholder="e.g. Pastor Executive Admin or Church Secretariat"
          />
        </AdminField>

        {/* Verification Notes */}
        <AdminField
          label="Verification Audit Notes & Checklist"
          helperText="Document scripture reference checks, leadership sign-offs, or revision requests."
        >
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Scripture passage verified against NIV text. Location coordinates checked on Google Maps..."
            className="w-full p-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </AdminField>

        {/* Governance Notice */}
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2 text-[11px] leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Publishing content immediately updates the public website index and global search. Ensure all dates, venues, and scripture references are verified.
          </span>
        </div>
      </form>
    </AdminModal>
  );
};
