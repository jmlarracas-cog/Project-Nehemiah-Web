import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { EventItem } from '../../types/event';
import { AdminDataTable, ColumnDef } from '../../components/admin/AdminDataTable';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminModal, AdminButton, AdminField, AdminSelect, AdminCheckbox, AdminStatusSelect, AdminImagePicker } from '../../components/admin/AdminFormControls';
import { VerificationModal } from '../../components/admin/VerificationModal';
import { ContentStatus } from '../../types/about';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);
  const [verifyingItem, setVerifyingItem] = useState<EventItem | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load events repository');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreateNew = () => {
    setError(null);
    setEditingItem({
      id: `evt-${Date.now()}`,
      slug: `event-${Date.now().toString().slice(-4)}`,
      title: 'Special Gathering Title',
      description: 'Comprehensive details regarding the upcoming church gathering.',
      category: 'Worship',
      startDate: new Date().toISOString().slice(0, 10),
      startTime: '9:00 AM',
      location: { name: 'Church Sanctuary', address: '[Pending Official Address — Subic, Zambales]', city: 'Subic' },
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
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
      const saved = await adminService.saveEvent(editingItem);
      setEvents((prev) => {
        const idx = prev.findIndex((ev) => ev.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      setEditingItem(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save event record');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyConfirm = async (newStatus: ContentStatus) => {
    if (!verifyingItem) return;
    try {
      setSaving(true);
      setError(null);
      const updatedItem: EventItem = { ...verifyingItem, status: newStatus };
      const saved = await adminService.saveEvent(updatedItem);
      setEvents((prev) =>
        prev.map((ev) => (ev.id === saved.id ? saved : ev))
      );
      setVerifyingItem(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to update event status');
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnDef<EventItem>[] = [
    {
      key: 'title',
      header: 'Event Title & Category',
      accessor: (e) => (
        <div className="flex items-center gap-3">
          <img src={e.imageUrl} alt={e.title} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200" />
          <div>
            <span className="font-bold text-slate-900 block">{e.title}</span>
            <span className="text-[11px] font-semibold text-slate-500">{e.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'schedule',
      header: 'Date & Time',
      accessor: (e) => (
        <div>
          <span className="font-bold text-slate-800 block">{e.startDate || e.date}</span>
          <span className="text-[11px] text-slate-500">{e.startTime || e.time || 'All Day'}</span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Venue Location',
      accessor: (e) => (
        <span className="text-slate-700 font-medium">
          {typeof e.location === 'string' ? e.location : e.location?.name || 'Subic Campus'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (e) => <StatusBadge status={e.status || 'published'} />,
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
          <span className="text-xs font-semibold text-slate-600">Loading events records from repository...</span>
        </div>
      ) : (
        <AdminDataTable
          title="Events & Calendar Gatherings"
          description="Manage worship services, conferences, youth rallies, outreach drives, and church calendar dates."
          data={events}
          columns={columns}
          searchPlaceholder="Search event titles, venues, categories..."
          headerButton={
            <AdminButton variant="gold" size="sm" onClick={handleCreateNew}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Event
            </AdminButton>
          }
          onEdit={(ev) => {
            setError(null);
            setEditingItem({ ...ev });
          }}
          onVerify={(ev) => {
            setError(null);
            setVerifyingItem(ev);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <AdminModal
          isOpen={Boolean(editingItem)}
          onClose={() => !saving && setEditingItem(null)}
          title={`Edit Event: ${editingItem.title}`}
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
                  'Save Event Record'
                )}
              </AdminButton>
            </>
          }
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <AdminField label="Event Title" required>
              <input
                type="text"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Category" required>
                <input
                  type="text"
                  value={typeof editingItem.category === 'string' ? editingItem.category : 'Gathering'}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>

              <AdminField label="Start Date" required>
                <input
                  type="date"
                  value={editingItem.startDate || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Start Time" required>
                <input
                  type="text"
                  value={editingItem.startTime || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, startTime: e.target.value })}
                  placeholder="e.g. 9:00 AM"
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>

              <AdminField label="Venue Location Name" required>
                <input
                  type="text"
                  value={
                    typeof editingItem.location === 'string'
                      ? editingItem.location
                      : editingItem.location?.name || ''
                  }
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      location: {
                        name: e.target.value,
                        address: '[Pending Official Address — Subic, Zambales]',
                        city: 'Subic',
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl"
                />
              </AdminField>
            </div>

            <AdminImagePicker
              value={editingItem.imageUrl}
              onChange={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
            />

            <AdminField label="Event Description" required>
              <textarea
                rows={4}
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full p-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl"
              />
            </AdminField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminCheckbox
                label="Featured Event"
                description="Show on Home page upcoming events banner"
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
          itemType="Event"
          currentStatus={verifyingItem.status || 'published'}
          onConfirmVerification={handleVerifyConfirm}
        />
      )}
    </div>
  );
};
