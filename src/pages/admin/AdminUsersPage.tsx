import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { UserAccountRecord } from '../../types/admin';
import { AdminRole, ROLE_DESCRIPTORS } from '../../types/rbac';
import { AdminDataTable, ColumnDef } from '../../components/admin/AdminDataTable';
import { AdminModal, AdminButton, AdminField, AdminSelect, AdminCheckbox } from '../../components/admin/AdminFormControls';
import { PermissionGate } from '../../components/admin/PermissionGate';
import { useAuthorization } from '../../context/AuthorizationContext';
import { ShieldAlert, Plus, Lock } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserAccountRecord[]>([]);
  const [editingUser, setEditingUser] = useState<UserAccountRecord | null>(null);
  const { hasPermission } = useAuthorization();

  useEffect(() => {
    adminService.getUserAccounts().then(setUsers);
  }, []);

  const handleCreateNew = () => {
    setEditingUser({
      id: `usr-${Date.now()}`,
      displayName: 'New Ministry Editor Account',
      email: 'staff.demo@subiccog.org',
      role: 'EDITOR',
      permissions: ['pages.read', 'pages.create', 'pages.update'],
      assignedCampus: 'Subic Central Sanctuary',
      isActive: true,
      lastLoginAt: 'Never',
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.id === editingUser.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = editingUser;
        return next;
      }
      return [editingUser, ...prev];
    });
    setEditingUser(null);
  };

  const columns: ColumnDef<UserAccountRecord>[] = [
    {
      key: 'displayName',
      header: 'User & Email',
      accessor: (u) => (
        <div>
          <span className="font-bold text-slate-900 block">{u.displayName}</span>
          <span className="font-mono text-[11px] text-slate-500">{u.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Canonical Role Designation',
      accessor: (u) => {
        const descriptor = ROLE_DESCRIPTORS[u.role as AdminRole];
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              descriptor?.badgeColor || 'bg-slate-100 text-slate-800'
            }`}
          >
            {u.role}
          </span>
        );
      },
    },
    {
      key: 'assignedCampus',
      header: 'Assigned Location Scope',
      accessor: (u) => <span className="font-medium text-slate-700">{u.assignedCampus}</span>,
    },
    {
      key: 'isActive',
      header: 'Account Status',
      accessor: (u) => (
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
            u.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {u.isActive ? 'Active' : 'Suspended'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Security Architecture Notice */}
      <div className="p-4 bg-navy text-white rounded-2xl border border-slate-800 shadow-md space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Stage 6G Security Directive — Custom Claims Server Authority & Trusted Backend Isolation</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Client React code cannot assign production Firebase custom claims. In Project Nehemiah Stage 6G, custom claims (<code className="font-mono text-gold text-[11px]">role</code>) and account status updates are provisioned exclusively via the isolated trusted backend service (<code className="font-mono text-gold text-[11px]">backend/src/roles/provisioningService.ts</code>) using the Firebase Admin SDK.
        </p>
      </div>

      <AdminDataTable
        title="Admin User Accounts & Technical Role Matrix"
        description="Canonical Role-Based Access Control (RBAC) architecture for Church of God Subic administration."
        data={users}
        columns={columns}
        searchPlaceholder="Search user name, email, or role..."
        headerButton={
          <PermissionGate
            permission="users.manage"
            fallback={
              <button
                disabled
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-200 text-slate-400 cursor-not-allowed flex items-center gap-1.5"
                title="Requires users.manage permission"
              >
                <Lock className="w-3.5 h-3.5" />
                Add User (Restricted)
              </button>
            }
          >
            <AdminButton variant="gold" size="sm" onClick={handleCreateNew}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add User
            </AdminButton>
          </PermissionGate>
        }
        onEdit={hasPermission('users.manage') ? (u) => setEditingUser({ ...u }) : undefined}
      />

      {/* Edit User Modal */}
      {editingUser && (
        <AdminModal
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          title={`User Account: ${editingUser.displayName}`}
          footer={
            <>
              <AdminButton variant="secondary" onClick={() => setEditingUser(null)}>
                Cancel
              </AdminButton>
              <AdminButton variant="gold" onClick={handleSave}>
                Save User Permissions
              </AdminButton>
            </>
          }
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Full Name" required>
                <input
                  type="text"
                  value={editingUser.displayName}
                  onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold"
                />
              </AdminField>

              <AdminField label="Email Address" required>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold"
                />
              </AdminField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminField label="Canonical Technical Role" required>
                <AdminSelect
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as AdminRole })}
                  options={[
                    { value: 'SUPER_ADMIN', label: 'SUPER_ADMIN — Unrestricted system access' },
                    { value: 'ADMIN', label: 'ADMIN — Broad CMS administration' },
                    { value: 'EDITOR', label: 'EDITOR — Public content publishing' },
                    { value: 'MEDIA_ADMIN', label: 'MEDIA_ADMIN — Media & sermon management' },
                    { value: 'PRAYER_ADMIN', label: 'PRAYER_ADMIN — Prayer & contact submissions' },
                    { value: 'MINISTRY_EDITOR', label: 'MINISTRY_EDITOR — Scoped ministry editing' },
                    { value: 'READ_ONLY', label: 'READ_ONLY — Read-only inspector' },
                  ]}
                />
              </AdminField>

              <AdminField label="Primary Location Scope">
                <input
                  type="text"
                  value={editingUser.assignedCampus}
                  onChange={(e) => setEditingUser({ ...editingUser, assignedCampus: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gold"
                />
              </AdminField>
            </div>

            <AdminCheckbox
              label="Account Active"
              description="Uncheck to temporarily suspend access without deleting account record."
              checked={editingUser.isActive}
              onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
            />
          </form>
        </AdminModal>
      )}
    </div>
  );
};
