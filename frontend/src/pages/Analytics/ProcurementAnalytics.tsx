import { Badge } from '@/components/ui/Badge';
import {
  TrendingUp,
  DollarSign,
  Clock,
  ShieldAlert,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const ProcurementAnalytics: React.FC = () => {
  
  // Mock data for graphs
  const DEPT_SPENDING = [
    { name: 'Engineering', value: 184500 },
    { name: 'Marketing', value: 12500 },
    { name: 'Procurement', value: 62500 },
    { name: 'Operations', value: 34900 },
    { name: 'Finance & HR', value: 2400 }
  ];

  const MONTHLY_TREND = [
    { month: 'Jan', value: 85000 },
    { month: 'Feb', value: 120000 },
    { month: 'Mar', value: 95000 },
    { month: 'Apr', value: 140000 },
    { month: 'May', value: 175000 },
    { month: 'Jun', value: 210000 },
    { month: 'Jul', value: 295000 }
  ];

  const VENDOR_DISTRIBUTION = [
    { name: 'CompSource', value: 34 },
    { name: 'Staples', value: 110 },
    { name: 'GlobalTech', value: 19 },
    { name: 'Office Depot', value: 72 },
    { name: 'SysLogistics', value: 3 }
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6 text-left max-w-6xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Procurement Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Executive insights detailing corporate spending trends, savings indices, and supplier distribution channels.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Total Procurement</span>
            <DollarSign size={15} />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">$296,300</h3>
          <p className="text-[9px] text-green-600 font-bold flex items-center gap-1">
            <TrendingUp size={10} /> +12% vs last Qtr
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Savings Generated</span>
            <Award size={15} />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">$24,900</h3>
          <p className="text-[9px] text-green-600 font-bold">12.5% Average Saving</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Avg Approval SLA</span>
            <Clock size={15} />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">4.2 Hours</h3>
          <p className="text-[9px] text-green-600 font-bold">85% automated scanning</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Policy Violations</span>
            <ShieldAlert size={15} />
          </div>
          <h3 className="text-lg font-black text-red-650 dark:text-red-400">3 Logs</h3>
          <p className="text-[9px] text-red-500 font-bold">2 policy overrides pending</p>
        </div>

      </div>

      {/* Spending Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Monthly Procurement Volume Trend ($)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                <Area type="monotone" dataKey="value" name="Volume ($)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department-wise Bar chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Department Allocation
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_SPENDING} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="value" name="Allocated ($)" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Vendor Distribution and stats details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie chart supplier distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Supplier Distribution (POs Count)
          </h3>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VENDOR_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {VENDOR_DISTRIBUTION.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[10px] font-semibold text-slate-500">
            {VENDOR_DISTRIBUTION.map((entry, index) => (
              <span key={index} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                {entry.name} ({entry.value})
              </span>
            ))}
          </div>
        </div>

        {/* Audit summaries info grid */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Procurement Audit Summary
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Procura systems automatically track 100% of pipeline decisions, validating quotations and logging OCR extraction errors to maintain audit trails.
            </p>
          </div>

          {/* Recent Verification Audits sub-list */}
          <div className="space-y-2.5 my-1">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block select-none">
              Recent Verification Audits
            </span>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 flex items-start justify-between gap-3 text-[11px] leading-relaxed">
                <div className="text-left">
                  <span className="font-bold text-slate-700 dark:text-slate-300">AU-9043</span>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    Quotation policy rule *POL-001* overridden for **SysLogistics Solutions** by Sarah Jenkins.
                  </p>
                </div>
                <Badge variant="warning" className="scale-90 flex-shrink-0">Overridden</Badge>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 flex items-start justify-between gap-3 text-[11px] leading-relaxed">
                <div className="text-left">
                  <span className="font-bold text-slate-700 dark:text-slate-300">AU-9041</span>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    Bid verification checklist successfully passed for **CompSource Inc.** on request *PR-2044*.
                  </p>
                </div>
                <Badge variant="success" className="scale-90 flex-shrink-0">Passed</Badge>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 flex items-start justify-between gap-3 text-[11px] leading-relaxed">
                <div className="text-left">
                  <span className="font-bold text-slate-700 dark:text-slate-300">AU-9038</span>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    Automatic quotation invoice extraction completed by **ExtractionAgent** on request *PR-2045*.
                  </p>
                </div>
                <Badge variant="neutral" className="scale-90 flex-shrink-0">Extracted</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[9px] text-slate-400 block font-bold uppercase">Total Bids Evaluated</span>
              <span className="text-base font-black text-slate-800 dark:text-slate-200 mt-1 block">238 Quotes</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block font-bold uppercase">Approval Rate</span>
              <span className="text-base font-black text-slate-800 dark:text-slate-200 mt-1 block">94.8%</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block font-bold uppercase">Compliance Score</span>
              <span className="text-base font-black text-slate-800 dark:text-slate-200 mt-1 block">98.2%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
