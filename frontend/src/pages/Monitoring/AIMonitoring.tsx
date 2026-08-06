import { Badge } from '@/components/ui/Badge';
import {
  BrainCircuit,
  Percent,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export const AIMonitoring: React.FC = () => {

  const ACCURACY_DISTRIBUTION = [
    { range: '50-60%', count: 4 },
    { range: '60-70%', count: 12 },
    { range: '70-80%', count: 32 },
    { range: '80-90%', count: 110 },
    { range: '90-100%', count: 242 }
  ];

  const DAILY_AI_REQUESTS = [
    { day: 'Mon', count: 42 },
    { day: 'Tue', count: 50 },
    { day: 'Wed', count: 48 },
    { day: 'Thu', count: 62 },
    { day: 'Fri', count: 70 },
    { day: 'Sat', count: 15 },
    { day: 'Sun', count: 12 }
  ];

  return (
    <div className="space-y-6 text-left max-w-6xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">AI Monitoring Dashboard</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Review live parser metrics, tracking LLM extraction accuracies, OCR processing delays, and system agent statuses.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1.5">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Extraction Accuracy</span>
            <Percent size={15} />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">96.8%</h3>
          <p className="text-[9px] text-green-600 font-bold flex items-center gap-0.5">
            <TrendingUp size={10} /> +1.2% vs last month
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1.5">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Average Confidence</span>
            <Sparkles size={15} />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">94.2%</h3>
          <p className="text-[9px] text-slate-550">Based on 400 parsed quotes</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1.5">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">OCR Processing SLA</span>
            <Clock size={15} />
          </div>
          <h3 className="text-lg font-black text-slate-850 dark:text-slate-100">3.2 Seconds</h3>
          <p className="text-[9px] text-green-600 font-bold">Fast parallel execution</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1.5">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">AI Policy Match Rate</span>
            <BrainCircuit size={15} />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">99.1%</h3>
          <p className="text-[9px] text-slate-550">3 false overrides reported</p>
        </div>

      </div>

      {/* Agents Health status cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          AI Node Agent Statuses
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-semibold">
          {[
            { name: 'OCR Extract Agent', desc: 'healthy' },
            { name: 'Comparison Agent', desc: 'healthy' },
            { name: 'Policy Agent', desc: 'healthy' },
            { name: 'SAP Integration Agent', desc: 'healthy' },
            { name: 'Audit Ledger Agent', desc: 'healthy' }
          ].map((agent, idx) => (
            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-2">
              <span className="text-slate-700 dark:text-slate-350 font-bold block">{agent.name}</span>
              <Badge variant="success" className="text-[8px] py-0 font-bold gap-0.5">
                <CheckCircle size={8} /> Active Healthy
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Accuracy and Delay Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Confidence distribution Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            AI Parse Confidence Distribution (Bids count)
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ACCURACY_DISTRIBUTION}>
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" name="Quotes Count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests counts line */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Daily AI OCR Processing Requests Count
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DAILY_AI_REQUESTS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                <Line type="monotone" dataKey="count" name="Requests Volume" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
