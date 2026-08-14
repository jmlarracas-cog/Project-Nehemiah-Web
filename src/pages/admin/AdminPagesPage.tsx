import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { ManagedPageRecord } from '../../types/admin';
import { AdminDataTable, ColumnDef } from '../../components/admin/AdminDataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminModal, AdminButton, AdminField, AdminSelect, AdminStatusSelect } from '../../components/admin/AdminFormControls';
import { VerificationModal } from '../../components/admin/VerificationModal';
import { ContentStatus } from '../../types/about';
import { FileText, Plus, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export const AdminPagesPage: React.FC = () => {
  const [pages, setPages] = useState<ManagedPageRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<ManagedPageRecord | null>(null);
  const [verifyingPage, setVerifyingPage] = useState<ManagedPageRecord | null>(null);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getManagedPages();
      setPages(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load site pages repository');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    try {
      setSaving(true);
      setError(null);
      const updatedRecord: ManagedPageRecord = {
        ...editingPage,
        lastModifiedAt: new Date().toISOString().slice(0, 10),
      };
      const saved = await adminService.savePage(updatedRecord);
      setPages((prev) =>
        prev.map((p) => (p.id === saved.id ? saved : p))
      );
      setEditingPage(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save page record');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyConfirm = async (newStatus: ContentStatus, notes: string, verifierName: string) => {
    if (!verifyingPage) return;
    try {
      setSaving(true);
      setError(null);
      const updatedRecord: ManagedPageRecord = {
        ...verifyingPage,
        status: newStatus,
        notes,
        verifiedBy: verifierName,
        verifiedAt: new Date().toISOString().slice(0, 10),
      };
      const saved = await adminService.savePage(updatedRecord);
      setPages((prev) =>
        prev.map((p) => (p.id === saved.id ? saved : p))
      );
      setVerifyingPage(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to verify page record');
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnDef<ManagedPageRecord>[] = [
    {
      key: 'title',
      header: 'Page Title & Path',
      accessor: (p) => (
        <div>
          <span className="font-bold text-slate-900 block">{p.title}</span>
          <span className="font-mono text-[11px] text-slate-400">{p.slug}</span>
        </div>
      ),
    },
    {
      key: 'seoTitle',
      header: 'SEO Meta Title',
      accessor: (p) => <span className="text-slate-600 line-clamp-1">{p.seoTitle}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: 'lastModifiedAt',
      header: 'Last Modified',
      accessor: (p) => (
        <div>
          <span className="text-slate-700 block font-medium">{p.lastModifiedAt}</span>
          <span className="text-[10px] text-slate-400">by {p.lastModifiedBy}</span>
        </div>
      ),
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
          <span className="text-xs font-semibold text-slate-600">Loading site pages from repository...</span>
        </div>
      ) : (
        <AdminDataTable
          title="Managed Site Pages"
          description="Structured content metadata and SEO parameters for core church pages."
          data={pages}
          columns={columns}
          searchPlaceholder="Search page titles, slugs, or SEO keywords..."
          onEdit={(page) => {
            setError(null);
            setEditingPage({ ...page });
          }}
          onVerify={(page) => {
            setError(null);
            setVerifyingPage(page);
          }}
        />
      )}

      {/* Edit Page Modal */}
      {editingPage && (
        <AdminModal
          isOpen={Boolean(editingPage)}
          onClose={() => !saving && setEditingPage(null)}
          title={`Edit Page: ${editingPage.title}`}
          subtitle={`Route path: ${editingPage.slug}`}
          footer={
            <>
              <AdminButton variant="secondary" onClick={() => setEditingPage(null)} disabled={saving}>
                Cancel
              </AdminButton>
              <AdminButton variant="gold" onClick={handleSavePage} disabled={saving}>
                {saving ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </span>
                ) : (
                  'Save Page Metadata'
                )}
              </AdminButton>
            </>
          }
        >
          <form onSubmit={handleSavePage} className="space-y-4">
            <AdminField label="Page Title" required>
              <input
                type="text"
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </AdminField>

            <AdminField label="SEO Title Tag" required helperText="Displayed in browser tab and search engine results.">
              <input
                type="text"
                value={editingPage.seoTitle}
                onChange={(e) => setEditingPage({ ...editingPage, seoTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </AdminField>

            <AdminField label="Meta Description" required helperText="150-160 character preview for search engines.">
              <textarea
                rows={3}
                value={editingPage.metaDescription}
                onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                className="w-full p-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </AdminField>

            <AdminField label="Governance Content Status">
              <AdminStatusSelect
                value={editingPage.status}
                onChange={(val) => setEditingPage({ ...editingPage, status: val })}
              />
            </AdminField>
          </form>
        </AdminModal>
      )}

      {/* Verification Modal */}
      {verifyingPage && (
        <VerificationModal
          isOpen={Boolean(verifyingPage)}
          onClose={() => setVerifyingPage(null)}
          itemTitle={verifyingPage.title}
          itemType="Page"
          currentStatus={verifyingPage.status}
          initialNotes={verifyingPage.notes}
          onConfirmVerification={handleVerifyConfirm}
        />
      )}
    </div>
  );
};
