import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { SystemMetric } from '@/services/api';
import {
  Cpu,
  Database,
  Globe,
  HardDrive,
  Activity,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const SystemDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = () => {
    setLoading(true);
    api.getSystemMetrics().then((res) => {
      setMetrics(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const chartData = metrics
    ? metrics.cpu.map((c, idx) => ({
        time: `${idx * 2}m ago`,
        cpu: c,
        memory: metrics.memory[idx]
      }))
    : [];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">System Health Dashboard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor hosting hardware resources, server storage capacities, database connections, and downstream API syncing.
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-650 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh Nodes
        </button>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1.5">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[9px] font-bold uppercase tracking-wider">CPU Utilization</span>
              <Cpu size={15} />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
              {metrics.cpu[metrics.cpu.length - 1]}%
            </h3>
            <p className="text-[9px] text-green-600 font-bold flex items-center gap-0.5">
              <CheckCircle2 size={9} strokeWidth={3} /> Healthy load range
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1.5">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[9px] font-bold uppercase tracking-wider">Storage Capacity</span>
              <HardDrive size={15} />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{metrics.storage.split(' ')[0]} GB</h3>
            <p className="text-[9px] text-slate-500">Free: 612 GB (SSD Pool)</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1.5">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[9px] font-bold uppercase tracking-wider">Database Status</span>
              <Database size={15} />
            </div>
            <h3 className="text-lg font-black text-slate-850 dark:text-slate-100">Operational</h3>
            <p className="text-[9px] text-green-600 font-bold">Latency: 12ms</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1.5">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[9px] font-bold uppercase tracking-wider">SAP API Sync Gateway</span>
              <Globe size={15} />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Connected</h3>
            <p className="text-[9px] text-green-600 font-bold">100% Uptime Ledger</p>
          </div>

        </div>
      )}

      {/* Resource Utilization Line Charts */}
      {metrics && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-1.5">
            <Activity size={16} className="text-primary-650" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              CPU & Memory Allocation Tracking
            </h3>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="cpu" name="CPU Usage (%)" stroke="#2563eb" fill="#2563eb" fillOpacity={0.06} strokeWidth={2.5} />
                <Area type="monotone" dataKey="memory" name="Memory Usage (%)" stroke="#10b981" fill="#10b981" fillOpacity={0.06} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};
