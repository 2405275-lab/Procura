import { useState } from 'react';
import { useProcurement } from '@/hooks/useProcurement';
import { Input } from '@/components/ui/Input';
import {
  Clock,
  User,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const AuditTimelineList: React.FC = () => {
  const { auditLogs } = useProcurement();

  const [agentFilter, setAgentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logs based on search inputs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesAgent = agentFilter ? log.agent.toLowerCase().includes(agentFilter.toLowerCase()) : true;
    const matchesStatus = statusFilter ? log.status === statusFilter : true;
    const matchesSearch = searchTerm
      ? log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.vendor && log.vendor.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesAgent && matchesStatus && matchesSearch;
  });

  const handleResetFilters = () => {
    setAgentFilter('');
    setStatusFilter('');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Audit Ledger Timeline</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Enterprise immutable transaction log containing OCR scans, policy validation records, and approval overrides.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            id="search"
            label="Search Actions / Reasons"
            placeholder="e.g. OCR Parsing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Agent Filter
            </label>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-250 focus:outline-none focus:border-primary-500"
            >
              <option value="">All Agents</option>
              <option value="Extraction-Agent">Extraction Agent</option>
              <option value="Policy-Evaluation-Agent">Policy Agent</option>
              <option value="Comparison-Agent">Comparison Agent</option>
              <option value="Jenkins">Sarah Jenkins (Manager)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              Fulfillment Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-250 focus:outline-none focus:border-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {(searchTerm || agentFilter || statusFilter) && (
          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-slate-500 hover:text-primary-650 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Timeline view */}
      {filteredLogs.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500">
          No audit ledger entries match active filter parameters.
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-slate-150 dark:border-slate-800/80 space-y-6">
          {filteredLogs.map((log) => {
            const isCompleted = log.status === 'Completed';
            const isFailed = log.status === 'Failed';
            
            return (
              <div key={log.id} className="relative group space-y-2">
                
                {/* Visual timeline node dot */}
                <div className={cn(
                  'absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-110',
                  isCompleted ? 'bg-green-600' : isFailed ? 'bg-red-500' : 'bg-amber-500'
                )}>
                  {isCompleted ? <CheckCircle size={8} className="text-white" /> : isFailed ? <XCircle size={8} className="text-white" /> : <Clock size={8} className="text-white" />}
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
                  
                  {/* Timestamp & ID info banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-850">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{log.action}</span>
                      <span className="text-slate-350 dark:text-slate-600 font-light">/</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{log.id}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{log.timestamp}</span>
                  </div>

                  {/* Body elements */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3.5 text-xs">
                    
                    <div className="space-y-1 md:col-span-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Reason / Details</span>
                      <p className="text-slate-650 dark:text-slate-350 font-normal leading-relaxed">{log.reason}</p>
                    </div>

                    <div className="space-y-3 md:border-l md:border-slate-100 dark:md:border-slate-850 md:pl-4">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Agent Signee</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <User size={12} className="text-primary-650" />
                          {log.agent}
                        </span>
                      </div>
                      
                      {log.requestId && (
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Reference ID</span>
                          <span className="font-semibold text-slate-500">{log.requestId}</span>
                        </div>
                      )}
                    </div>

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
