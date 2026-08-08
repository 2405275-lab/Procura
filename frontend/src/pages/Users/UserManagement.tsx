import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { UserItem } from '@/services/api';
import { useToast } from '@/components/common/Toast';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  CheckCircle,
  XCircle,
  Key,
  LockKeyhole
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface PredefinedRole {
  name: string;
  permissions: {
    manageUsers: boolean;
    configPolicies: boolean;
    approvePurchases: boolean;
    viewAuditLogs: boolean;
    aiSettings: boolean;
  };
}

const ROLES_PERMISSIONS: PredefinedRole[] = [
  { name: 'Administrator', permissions: { manageUsers: true, configPolicies: true, approvePurchases: true, viewAuditLogs: true, aiSettings: true } },
  { name: 'Procurement Officer', permissions: { manageUsers: false, configPolicies: false, approvePurchases: false, viewAuditLogs: true, aiSettings: false } },
  { name: 'Finance Officer', permissions: { manageUsers: false, configPolicies: false, approvePurchases: true, viewAuditLogs: true, aiSettings: false } },
  { name: 'Manager', permissions: { manageUsers: false, configPolicies: true, approvePurchases: true, viewAuditLogs: true, aiSettings: false } },
  { name: 'Auditor', permissions: { manageUsers: false, configPolicies: false, approvePurchases: false, viewAuditLogs: true, aiSettings: false } },
  { name: 'Viewer', permissions: { manageUsers: false, configPolicies: false, approvePurchases: false, viewAuditLogs: false, aiSettings: false } }
];

export const UserManagement: React.FC = () => {
  const { showToast } = useToast();

  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

  useEffect(() => {
    api.getUsers().then(setUsersList);
  }, []);

  const handleToggleStatus = (id: string, currentStatus: 'Active' | 'Disabled') => {
    const nextStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';
    api.updateUserStatus(id, nextStatus).then((success) => {
      if (success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
        );
        showToast(
          `User account ${nextStatus === 'Active' ? 'activated' : 'deactivated'} successfully.`,
          nextStatus === 'Active' ? 'success' : 'warning'
        );
      }
    });
  };

  const handleResetPassword = (name: string) => {
    showToast(`Password recovery link dispatched to ${name}'s verified mailbox.`, 'success');
  };

  const activeRoleInfo = ROLES_PERMISSIONS[selectedRoleIndex];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">User & Role Management</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Orchestrate system members access levels, manage multi-factor credentials, and review role access matrixes.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch">
        
        {/* USERS TABLE LIST */}
        <div className="xl:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Enterprise Accounts
              </h3>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="p-4 uppercase tracking-wider">Name</th>
                    <th className="p-4 uppercase tracking-wider">Role</th>
                    <th className="p-4 uppercase tracking-wider">Department</th>
                    <th className="p-4 uppercase tracking-wider">Status</th>
                    <th className="p-4 uppercase tracking-wider">MFA</th>
                    <th className="p-4 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{user.role}</td>
                      <td className="p-4">{user.department}</td>
                      <td className="p-4">
                        <Badge variant={user.status === 'Active' ? 'success' : 'neutral'}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={user.mfaEnabled ? 'success' : 'neutral'} className="gap-1">
                          {user.mfaEnabled ? 'Verified' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResetPassword(user.name)}
                            title="Reset password link"
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-800 cursor-pointer"
                          >
                            <Key size={13} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            title={user.status === 'Active' ? 'Deactivate account' : 'Activate account'}
                            className={cn(
                              'p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer',
                              user.status === 'Active' ? 'text-red-450 hover:text-red-650' : 'text-green-600'
                            )}
                          >
                            {user.status === 'Active' ? <LockKeyhole size={13} /> : <CheckCircle size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ROLES MATRIX VIEW */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center gap-1.5">
            <Shield size={16} className="text-primary-650" />
            <h3 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
              Roles & Permissions Matrix
            </h3>
          </div>

          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Selected Role Access</label>
            <select
              value={selectedRoleIndex}
              onChange={(e) => setSelectedRoleIndex(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-850 dark:text-slate-250 focus:outline-none"
            >
              {ROLES_PERMISSIONS.map((role, idx) => (
                <option key={idx} value={idx}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs text-slate-650 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span>Manage Users Database</span>
              {activeRoleInfo.permissions.manageUsers ? <CheckCircle size={14} className="text-green-600" /> : <XCircle size={14} className="text-slate-300" />}
            </div>
            <div className="flex items-center justify-between">
              <span>Configure Policy Audits</span>
              {activeRoleInfo.permissions.configPolicies ? <CheckCircle size={14} className="text-green-600" /> : <XCircle size={14} className="text-slate-300" />}
            </div>
            <div className="flex items-center justify-between">
              <span>Approve Purchases</span>
              {activeRoleInfo.permissions.approvePurchases ? <CheckCircle size={14} className="text-green-600" /> : <XCircle size={14} className="text-slate-300" />}
            </div>
            <div className="flex items-center justify-between">
              <span>View Audit Timeline Log</span>
              {activeRoleInfo.permissions.viewAuditLogs ? <CheckCircle size={14} className="text-green-600" /> : <XCircle size={14} className="text-slate-300" />}
            </div>
            <div className="flex items-center justify-between">
              <span>Configure AI Engines</span>
              {activeRoleInfo.permissions.aiSettings ? <CheckCircle size={14} className="text-green-600" /> : <XCircle size={14} className="text-slate-300" />}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
