import { useState } from 'react';
import { useToast } from '@/components/common/Toast';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Key,
  Lock,
  Plus,
  Trash2
} from 'lucide-react';

export const SecurityCenter: React.FC = () => {
  const { showToast } = useToast();

  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [apiKey, setApiKey] = useState('');

  const handleGenerateKey = () => {
    const key = `vd_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(key);
    showToast('API access key created successfully.', 'success');
  };

  const handleRevokeKey = () => {
    setApiKey('');
    showToast('API key revoked. Synchronizations disabled.', 'warning');
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Security & Credentials Center</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure security requirements, enable multi-factor parameters, and provision API tokens for integration agents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* PARAMETERS PANEL */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-6 text-xs">
          
          <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Lock size={16} className="text-primary-650" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Corporate Credentials Rules
            </h3>
          </div>

          {/* MFA Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
            <div className="space-y-1 pr-4">
              <h4 className="font-bold text-slate-800 dark:text-slate-250">Enforce Multi-Factor (MFA)</h4>
              <p className="text-[10px] text-slate-450 leading-relaxed font-normal">
                Requires all users to input verified mobile authenticator codes on login.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mfaEnabled}
                onChange={() => {
                  setMfaEnabled(!mfaEnabled);
                  showToast(mfaEnabled ? 'MFA enforcement disabled.' : 'MFA enforcement activated.', 'info');
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-650 peer-checked:bg-primary-600" />
            </label>
          </div>

          {/* Session timeout selection */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-350">Idle Session Timeout Limit</label>
            <select
              value={sessionTimeout}
              onChange={(e) => {
                setSessionTimeout(e.target.value);
                showToast(`Session timeout threshold updated to ${e.target.value} minutes.`, 'info');
              }}
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-850 dark:text-slate-250 focus:outline-none"
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">60 Minutes</option>
              <option value="120">2 Hours</option>
            </select>
          </div>

        </div>

        {/* API ACCESS TOKENS GENERATOR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between text-xs">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Key size={16} className="text-primary-650" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Integration API Keys
              </h3>
            </div>

            <p className="text-[10px] text-slate-450 leading-relaxed font-normal">
              Generate keys to authorize automatic quotation upload pipelines or sync approved POs to SAP / ERP nodes.
            </p>

            {apiKey ? (
              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl font-mono text-[10px] select-all break-all border-dashed text-slate-750 dark:text-slate-300">
                  {apiKey}
                </div>
                <div className="flex items-center gap-1 text-green-600 font-bold text-[10px]">
                  <ShieldCheck size={13} /> Active Key Authorized
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 font-medium">
                No integration API keys created yet.
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            {apiKey ? (
              <Button
                onClick={handleRevokeKey}
                className="w-full text-xs font-semibold bg-red-650 hover:bg-red-700 text-white gap-1 py-2 cursor-pointer"
              >
                <Trash2 size={13} />
                Revoke Integration Token
              </Button>
            ) : (
              <Button
                onClick={handleGenerateKey}
                className="w-full text-xs font-semibold gap-1 py-2 cursor-pointer"
              >
                <Plus size={14} />
                Create API Token
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
