import { useState } from 'react';
import { useToast } from '@/components/common/Toast';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  User,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/utils/cn';
export const ProfilePage: React.FC = () => {
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [phone, setPhone] = useState('+1 555-0199');
  const [lang, setLang] = useState('en');
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Personal profile and preference cards updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">User Profile & Preferences</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal account credentials, change active languages, and configure layout themes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-5 text-xs">
          <div className="flex flex-col items-center text-center space-y-3.5">
            <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 text-lg shadow-inner">
              <User size={32} className="text-primary-650" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.name || 'Sarah Jenkins'}</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">Role: Procurement Director</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-3 text-slate-500 font-semibold leading-normal">
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Primary Email</span>
              <span className="text-slate-800 dark:text-slate-250 text-xs font-bold">{user?.email || 'admin@veridion.io'}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Access Group</span>
              <span className="text-slate-800 dark:text-slate-250 text-xs font-bold">Admin Management Group</span>
            </div>
          </div>
        </div>

        {/* PREFERENCES FORM */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-5 text-xs">
          <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-3">
            <Settings size={16} className="text-primary-650" />
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">
              Personal Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Telephone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-xs"
            />

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-350">Default Language</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-250 focus:outline-none"
              >
                <option value="en">English (US)</option>
                <option value="de">German (Deutsch)</option>
                <option value="hi">Hindi (हिन्दी)</option>
              </select>
            </div>
          </div>

          {/* Theme selection */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 dark:text-slate-350 block">Dashboard Layout Theme</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 border rounded-lg font-semibold transition-all cursor-pointer',
                  theme === 'light' ? 'bg-primary-50 border-primary-300 text-primary-750' : 'border-slate-200 dark:border-slate-800 text-slate-500'
                )}
              >
                <Sun size={13} />
                Light
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 border rounded-lg font-semibold transition-all cursor-pointer',
                  theme === 'dark' ? 'bg-primary-950/20 border-primary-800 text-primary-400' : 'border-slate-200 dark:border-slate-800 text-slate-500'
                )}
              >
                <Moon size={13} />
                Dark
              </button>
            </div>
          </div>

          {/* Email Notification toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
            <div className="space-y-1 pr-4">
              <h4 className="font-bold text-slate-850 dark:text-slate-250">Receive Transaction Notifications</h4>
              <p className="text-[10px] text-slate-450 leading-relaxed font-normal">
                Dispatches copy emails for OCR validation scanning logs and override signatures.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-650 peer-checked:bg-primary-600" />
            </label>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" className="text-xs font-semibold py-2 px-4">
              Save Preferences
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
