import { useState, useEffect } from 'react';
import { useToast } from '@/components/common/Toast';
import { api } from '@/services/api';
import type { OrgSettings } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Plus,
  Trash2,
  Download
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const AdminPanel: React.FC = () => {
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'organization' | 'departments' | 'ai-config'>('organization');
  const [orgData, setOrgData] = useState<OrgSettings | null>(null);

  // Departments List State
  const [depts, setDepts] = useState<string[]>(['Finance', 'Procurement', 'HR', 'IT', 'Legal', 'Operations']);
  const [newDeptName, setNewDeptName] = useState('');
  const [searchDept, setSearchDept] = useState('');

  useEffect(() => {
    api.getOrgSettings().then(setOrgData);
  }, []);

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgData) return;
    api.saveOrgSettings(orgData).then(() => {
      showToast('Organization settings updated successfully.', 'success');
    });
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    if (depts.includes(newDeptName.trim())) {
      showToast('Department already exists.', 'warning');
      return;
    }
    setDepts((prev) => [...prev, newDeptName.trim()]);
    setNewDeptName('');
    showToast(`Department "${newDeptName}" registered.`, 'success');
  };

  const handleDeleteDept = (name: string) => {
    if (confirm(`Remove department "${name}" from system directories?`)) {
      setDepts((prev) => prev.filter((d) => d !== name));
      showToast(`Department "${name}" removed.`, 'warning');
    }
  };

  const handleExportConfig = () => {
    showToast('Exporting active system parameters to JSON payload.', 'info');
  };

  const filteredDepts = depts.filter((d) => d.toLowerCase().includes(searchDept.toLowerCase()));

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Enterprise Administration Panel</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure corporate master tables, department lists, system directories, and database parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* SIDEBAR TABS LIST */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col gap-2">
          <button
            onClick={() => setActiveSubTab('organization')}
            className={cn(
              'w-full text-xs font-semibold py-2 px-3 rounded-lg text-left transition-colors cursor-pointer',
              activeSubTab === 'organization' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            Organization Profile
          </button>
          <button
            onClick={() => setActiveSubTab('departments')}
            className={cn(
              'w-full text-xs font-semibold py-2 px-3 rounded-lg text-left transition-colors cursor-pointer',
              activeSubTab === 'departments' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            Departments Directory
          </button>
          <button
            onClick={() => setActiveSubTab('ai-config')}
            className={cn(
              'w-full text-xs font-semibold py-2 px-3 rounded-lg text-left transition-colors cursor-pointer',
              activeSubTab === 'ai-config' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            AI Agent Engines
          </button>
        </div>

        {/* DETAILS CONFIG VIEW */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          
          {/* TAB 1: Organization settings */}
          {activeSubTab === 'organization' && orgData && (
            <form onSubmit={handleSaveOrg} className="space-y-5">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Organization Parameters</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleExportConfig} className="text-xs gap-1.5 py-1">
                  <Download size={13} />
                  Export JSON Config
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Company Corporate Name"
                  value={orgData.companyName}
                  onChange={(e) => setOrgData({ ...orgData, companyName: e.target.value })}
                  className="text-xs"
                />
                <Input
                  label="Corporate Tax GSTIN"
                  value={orgData.gstNumber}
                  onChange={(e) => setOrgData({ ...orgData, gstNumber: e.target.value })}
                  className="text-xs"
                />
                <Input
                  label="Company Email Gateway"
                  value={orgData.email}
                  onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                  className="text-xs"
                />
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Company Base Currency</label>
                  <select
                    value={orgData.currency}
                    onChange={(e) => setOrgData({ ...orgData, currency: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-850 dark:text-slate-250 focus:outline-none"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="EUR">EUR (€) - Euro</option>
                  </select>
                </div>
              </div>

              <Input
                label="Registered Headquarters Address"
                value={orgData.address}
                onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
                className="text-xs"
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" className="text-xs font-semibold py-2 px-4">
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: Departments directory */}
          {activeSubTab === 'departments' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Manage Departments</h3>
              </div>

              {/* Add department form */}
              <form onSubmit={handleAddDept} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter new department name..."
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary-500"
                />
                <Button type="submit" className="text-xs font-semibold gap-1 py-2 px-4 cursor-pointer">
                  <Plus size={14} />
                  Add Dept
                </Button>
              </form>

              {/* Departments list table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800">
                  <input
                    type="text"
                    placeholder="Search departments directory..."
                    value={searchDept}
                    onChange={(e) => setSearchDept(e.target.value)}
                    className="w-full max-w-xs px-2.5 py-1 text-[10px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                  />
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredDepts.map((dept, idx) => (
                    <div key={idx} className="p-3.5 flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-850 dark:text-slate-200">{dept}</span>
                      <button
                        onClick={() => handleDeleteDept(dept)}
                        className="text-slate-400 hover:text-red-650 cursor-pointer"
                        title="Remove department"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI Configuration */}
          {activeSubTab === 'ai-config' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Agent Configuration</h3>
              </div>

              <div className="space-y-4 text-xs font-normal">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-250">OCR Parser Accuracy Threshold</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed">
                    Bids parsed with confidence levels below this threshold will automatically flag "Waiting Verification" exceptions.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <input type="range" min="50" max="95" defaultValue="80" className="flex-1 accent-primary-600" />
                    <span className="font-bold text-slate-700">80% Conf.</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-250">Risk Classification Sensitivity</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-normal">
                    AI classification weight for policy violations. High sensitivity automatically increases bidder risk profiles.
                  </p>
                  <div className="flex items-center gap-4 pt-1 font-semibold">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="sensitivity" defaultChecked className="accent-primary-600" />
                      Standard
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="sensitivity" className="accent-primary-600" />
                      High Risk Avoidance
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
