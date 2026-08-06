import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Brain, Sliders, Bell, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure platform options, active LLM configurations, threshold values, and notification guidelines.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          {/* Navigation Sidebar inside Settings */}
          <div className="p-4 space-y-1.5 md:col-span-1">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary-700 bg-primary-50 dark:bg-primary-950/20 dark:text-primary-400 text-left">
              <Sliders size={14} />
              <span>General Settings</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left">
              <Brain size={14} />
              <span>AI Agents Config</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left">
              <Shield size={14} />
              <span>Policy Thresholds</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left">
              <Bell size={14} />
              <span>Notifications</span>
            </button>
          </div>

          {/* Settings Panel Content */}
          <div className="p-6 md:col-span-3 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Enterprise Metadata & Branding
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Platform Display Name" defaultValue="Procura Procurement" />
                <Input label="Corporate Domain Extension" defaultValue="company.com" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Threshold Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Max Department Procurement Ceiling (Monthly)" defaultValue="$100,000" />
                <Input label="Minimum Quotations Required" defaultValue="3" type="number" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <Button size="sm" className="text-xs gap-1.5 font-semibold py-2">
                <Save size={14} />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
