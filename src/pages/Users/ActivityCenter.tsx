import { useState } from 'react';
import { useProcurement } from '@/hooks/useProcurement';
import { Input } from '@/components/ui/Input';
import {
  User,
  Cpu
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const ActivityCenter: React.FC = () => {
  const { auditLogs } = useProcurement();

  const [searchActor, setSearchActor] = useState('');
  const [filterDept, setFilterDept] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchActor = searchActor ? log.agent.toLowerCase().includes(searchActor.toLowerCase()) : true;
    // Simple mock matches for department filter based on agent role
    const matchDept = filterDept
      ? log.agent.includes('Manager') || log.agent.includes('Jenkins')
        ? filterDept === 'Procurement'
        : log.agent.includes('Policy') || log.agent.includes('Sync')
        ? filterDept === 'IT'
        : true
      : true;
    return matchActor && matchDept;
  });

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Live Corporate Activity Feed</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Auditable sequence of requisition approvals, OCR parsing outputs, and ERP syncing logs.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Filter by Actor/Signee"
          placeholder="e.g. Sarah Jenkins..."
          value={searchActor}
          onChange={(e) => setSearchActor(e.target.value)}
          className="text-xs"
        />

        <div className="flex flex-col gap-1.5 text-xs">
          <label className="font-semibold text-slate-700 dark:text-slate-350">Filter by Department</label>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-850 dark:text-slate-250 focus:outline-none"
          >
            <option value="">All Departments</option>
            <option value="Procurement">Procurement</option>
            <option value="Engineering">Engineering</option>
            <option value="IT">IT</option>
            <option value="Finance & HR">Finance & HR</option>
          </select>
        </div>
      </div>

      {/* Feed List */}
      {filteredLogs.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 shadow-sm">
          No activity logs match search filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const isAgent = log.agent.includes('Agent') || log.agent.includes('Sync');
            
            return (
              <div key={log.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-start gap-4">
                <div className={cn(
                  'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                  isAgent ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600' : 'bg-green-50 dark:bg-green-950/20 text-green-600'
                )}>
                  {isAgent ? <Cpu size={16} /> : <User size={16} />}
                </div>

                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-slate-850 dark:text-slate-250">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-450 leading-relaxed font-normal">{log.reason}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[9px] text-slate-400">Actor: <strong className="text-slate-700 dark:text-slate-350">{log.agent}</strong></span>
                    {log.requestId && (
                      <>
                        <span className="text-slate-300">|</span>
                        <span className="text-[9px] text-slate-400">Reference: <strong className="text-slate-700 dark:text-slate-350">{log.requestId}</strong></span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
