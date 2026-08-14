import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { AdminDashboardMetrics, GovernanceQueueItem } from '../../types/admin';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { VerificationModal } from '../../components/admin/VerificationModal';
import { AdminButton } from '../../components/admin/AdminFormControls';
import { ContentStatus } from '../../types/about';
import {
  FileText,
  BookOpen,
  Calendar,
  HeartHandshake,
  MapPin,
  Heart,
  Inbox,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [queue, setQueue] = useState<GovernanceQueueItem[]>([]);
  const [selectedQueueItem, setSelectedQueueItem] = useState<GovernanceQueueItem | null>(null);

  useEffect(() => {
    adminService.getDashboardMetrics().then(setMetrics);
    adminService.getGovernanceQueue().then(setQueue);
  }, []);

  const handleVerifyConfirm = async (newStatus: ContentStatus, notes: string, verifierName: string) => {
    if (!selectedQueueItem) return;
    try {
      await adminService.verifyQueueItem(selectedQueueItem.id, newStatus, notes, verifierName);
      setQueue((prev) => prev.filter((item) => item.id !== selectedQueueItem.id));
      if (metrics) {
        setMetrics({
          ...metrics,
          totalPendingVerification: Math.max(0, metrics.totalPendingVerification - 1),
          totalPublished: newStatus === 'published' ? metrics.totalPublished + 1 : metrics.totalPublished,
        });
      }
      setSelectedQueueItem(null);
    } catch (err: any) {
      console.error('Failed to verify item from dashboard:', err);
    }
  };

  if (!metrics) return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-navy text-white rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-3 border border-gold/30">
            <Sparkles className="w-3.5 h-3.5" />
            Executive CMS Control Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2 leading-tight">
            Church Governance & Content Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Manage public sermons, events, candidate church locations, leadership rosters, media assets, and private prayer submissions.
          </p>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigate('/admin/pages')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-gold hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Published
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.totalPublished}</p>
          <p className="text-[10px] text-slate-400 mt-1">Live website pages</p>
        </div>

        <div
          onClick={() => onNavigate('/admin/governance')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Pending Queue
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-900">{metrics.totalPendingVerification}</p>
          <p className="text-[10px] text-amber-600 font-semibold mt-1">Requires pastoral review</p>
        </div>

        <div
          onClick={() => onNavigate('/admin/sermons')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-gold hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Sermons
            </span>
            <BookOpen className="w-4 h-4 text-gold" />
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.totalSermons}</p>
          <p className="text-[10px] text-slate-400 mt-1">Video & audio teachings</p>
        </div>

        <div
          onClick={() => onNavigate('/admin/events')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-gold hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Events
            </span>
            <Calendar className="w-4 h-4 text-gold" />
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.totalEvents}</p>
          <p className="text-[10px] text-slate-400 mt-1">Scheduled gatherings</p>
        </div>

        <div
          onClick={() => onNavigate('/admin/prayer')}
          className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
              New Prayers
            </span>
            <Heart className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-900">{metrics.newPrayerRequests}</p>
          <p className="text-[10px] text-rose-600 font-semibold mt-1">Private submissions</p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Quick Admin Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <AdminButton variant="gold" size="sm" onClick={() => onNavigate('/admin/sermons')}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            Add Sermon
          </AdminButton>
          <AdminButton variant="primary" size="sm" onClick={() => onNavigate('/admin/events')}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            Add Event
          </AdminButton>
          <AdminButton variant="secondary" size="sm" onClick={() => onNavigate('/admin/governance')}>
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-gold" />
            Review Queue ({queue.length})
          </AdminButton>
          <AdminButton variant="secondary" size="sm" onClick={() => onNavigate('/admin/prayer')}>
            <Heart className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Prayer Requests
          </AdminButton>
        </div>
      </div>

      {/* Governance Review Queue Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              Content Governance Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Content pending pastoral or secretariat verification before public publishing.
            </p>
          </div>
          <AdminButton variant="ghost" size="sm" onClick={() => onNavigate('/admin/governance')}>
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </AdminButton>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {queue.length > 0 ? (
            queue.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {item.contentType}
                    </span>
                    <StatusBadge status={item.currentStatus} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    Submitted by <span className="font-semibold text-slate-700">{item.submittedBy}</span> on {item.submittedAt}
                  </p>
                  {item.verificationNotes && (
                    <p className="text-[11px] text-amber-800 italic bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                      Note: {item.verificationNotes}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <AdminButton
                    variant="gold"
                    size="sm"
                    onClick={() => setSelectedQueueItem(item)}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Review & Verify
                  </AdminButton>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-800">Governance Queue Clear</p>
              <p className="text-xs text-slate-400">All submitted content has been reviewed and verified.</p>
            </div>
          )}
        </div>
      </div>

      {/* Verification Dialog Modal */}
      {selectedQueueItem && (
        <VerificationModal
          isOpen={Boolean(selectedQueueItem)}
          onClose={() => setSelectedQueueItem(null)}
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
