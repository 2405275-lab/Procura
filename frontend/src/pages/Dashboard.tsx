import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  Clock,
  ShieldAlert,
  Percent,
  Timer,
  TrendingUp,
  PlusCircle,
  Upload,
  Activity,
  ArrowRight,
  UserCheck,
  X,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { AnimatePresence, motion } from 'framer-motion';

// Mock KPI Cards Data
const KPI_CARDS = [
  { title: 'Total Purchase Requests', value: '142', icon: FileText, change: '+12% from last month', color: 'primary' },
  { title: 'Pending Approvals', value: '18', icon: Clock, change: '6 urgent review items', color: 'warning' },
  { title: 'Approved Vendors', value: '37', icon: UserCheck, change: '+4 newly certified', color: 'success' },
  { title: 'Policy Violations', value: '3', icon: ShieldAlert, change: '1 override requested', color: 'danger' },
  { title: 'Estimated Savings', value: '$84,230', icon: Percent, change: '14.2% average discount', color: 'success' },
  { title: 'Avg Processing Time', value: '4.8 hrs', icon: Timer, change: '-1.2 hrs this week', color: 'primary' },
];

// Detailed breakdown data for KPI modal popups
const KPI_DETAILS: Record<string, {
  title: string;
  subtitle: string;
  headers: string[];
  rows: string[][];
  summaryText: string;
}> = {
  'Total Purchase Requests': {
    title: 'Total Purchase Requests',
    subtitle: 'Requisition list for the current fiscal cycle.',
    headers: ['Request ID', 'Department', 'Budget', 'Priority', 'Status'],
    rows: [
      ['PR-2045', 'Engineering', '$18,450', 'High', 'Under Review'],
      ['PR-2044', 'Marketing', '$3,800', 'Low', 'Approved'],
      ['PR-2041', 'Procurement', '$62,500', 'Critical', 'Pending'],
      ['PR-2039', 'Finance & HR', '$1,240', 'Medium', 'Approved'],
      ['PR-2038', 'Operations', '$14,900', 'High', 'Rejected'],
      ['PR-2035', 'R&D Lab', '$32,100', 'High', 'Approved']
    ],
    summaryText: 'A total of 142 procurement requests have been compiled across all divisions, showing a 12% rise in demand.'
  },
  'Pending Approvals': {
    title: 'Pending Approvals',
    subtitle: 'Urgent review items waiting for override or signature.',
    headers: ['Request ID', 'Division', 'Amount', 'Pending Since', 'Action Required'],
    rows: [
      ['PR-2041', 'Procurement', '$62,500', '3 hours ago', 'Manager signature override'],
      ['PR-2045', 'Engineering', '$18,450', '20 mins ago', 'Policy compliance review'],
      ['PR-2030', 'R&D Software', '$45,000', '1 day ago', 'Finance budget approval'],
      ['PR-2022', 'Facilities', '$9,200', '3 days ago', 'Inventory validation check']
    ],
    summaryText: '18 items require manager authorization. 6 items are marked critical due to budget ceilings or SLA delays.'
  },
  'Approved Vendors': {
    title: 'Certified & Approved Vendors',
    subtitle: 'List of registered suppliers with compliance verification.',
    headers: ['Vendor Name', 'Compliance Grade', 'Active Contracts', 'SLA rate', 'Status'],
    rows: [
      ['CompSource Inc.', 'A+', '8 active', '98%', 'Certified'],
      ['GlobalTech Logistics', 'B+', '12 active', '92%', 'Certified'],
      ['Staples Corp', 'A', '4 active', '95%', 'Certified'],
      ['Office Depot', 'A', '6 active', '89%', 'Certified'],
      ['SysLogistics Solutions', 'C+', '3 active', '81%', 'Audit Pending']
    ],
    summaryText: '37 certified suppliers are fully verified. 4 new suppliers were certified this month following security audits.'
  },
  'Policy Violations': {
    title: 'Active Compliance Policy Violations',
    subtitle: 'Real-time rule exceptions logged by the Policy Agent.',
    headers: ['Rule ID', 'Vendor Affected', 'Policy Violation', 'Severity', 'Current State'],
    rows: [
      ['POL-001', 'SysLogistics', 'Unverified GST number parsed from quotation.', 'Critical', 'Override Requested'],
      ['POL-002', 'GlobalTech', 'Delivery SLA lead time (14 days) exceeds 7-day limit.', 'Medium', 'Pending Review'],
      ['POL-005', 'TechCorp', 'Bid price exceeds max department procurement ceiling.', 'Critical', 'Blocked']
    ],
    summaryText: '3 active policy violations detected. 1 override request is currently pending director signature review.'
  },
  'Estimated Savings': {
    title: 'Estimated Procurement Savings',
    subtitle: 'Financial surpluses realized via quote optimization & bidding.',
    headers: ['Saving Category', 'Negotiation Delta', 'SLA Delta', 'Average Discount', 'Cumulative Savings'],
    rows: [
      ['Hardware Procurement', '$15,400', '$4,100', '18.5%', '$19,500'],
      ['Logistics Contracts', '$28,000', '$12,500', '12.0%', '$40,500'],
      ['Office Requisitions', '$9,800', '$3,100', '15.2%', '$12,900'],
      ['Operational Bids', '$8,930', '$2,400', '11.0%', '$11,330']
    ],
    summaryText: 'Realized a cumulative savings of $84,230 across active requisitions, driven by competitive bidding.'
  },
  'Avg Processing Time': {
    title: 'Average Requisition Processing Latency',
    subtitle: 'Performance benchmarks across agent workflows.',
    headers: ['Workflow Step', 'Expected SLA', 'Actual Average', 'Latency Delta', 'Process Owner'],
    rows: [
      ['Document OCR Scan', '30 seconds', '12 seconds', '-18 seconds', 'OCRAgentService'],
      ['Structured Parameter Extraction', '60 seconds', '45 seconds', '-15 seconds', 'ExtractionAgentService'],
      ['Manager Review Sign-off', '24.0 hours', '3.5 hours', '-20.5 hours', 'Approving Manager'],
      ['PO ERP Sync Integration', '2.0 hours', '1.2 hours', '-0.8 hours', 'POAgentService']
    ],
    summaryText: 'Average requisition lifetime is 4.8 hours, showing a 1.2-hour improvement due to OCR auto-extraction.'
  }
};

// Mock Chart Data — Monthly Procurement Trend
const TREND_DATA = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 61000 },
  { month: 'Apr', amount: 58000 },
  { month: 'May', amount: 72000 },
  { month: 'Jun', amount: 89000 },
  { month: 'Jul', amount: 95000 },
];

// Mock Chart Data — Approval Status Distribution
const STATUS_DATA = [
  { name: 'Approved', value: 72, color: '#10B981' },
  { name: 'Under Review', value: 18, color: '#3B82F6' },
  { name: 'Pending Action', value: 8, color: '#F59E0B' },
  { name: 'Rejected', value: 4, color: '#EF4444' },
];

// Mock Chart Data — Vendor Performance (Rating & SLA Delivery Rate)
const VENDOR_DATA = [
  { name: 'CompSource', rating: 94, sla: 98 },
  { name: 'GlobalTech', rating: 88, sla: 92 },
  { name: 'Staples Corp', rating: 91, sla: 95 },
  { name: 'Office Depot', rating: 85, sla: 89 },
  { name: 'SysLogistics', rating: 79, sla: 81 },
];

// Mock Recent Purchase Requests Table Data
const RECENT_REQUESTS = [
  { id: 'PR-2045', department: 'Engineering', budget: '$18,450', status: 'Under Review', priority: 'High', updated: '20 mins ago' },
  { id: 'PR-2044', department: 'Marketing', budget: '$3,800', status: 'Approved', priority: 'Low', updated: '1 hour ago' },
  { id: 'PR-2041', department: 'Procurement', budget: '$62,500', status: 'Pending', priority: 'Critical', updated: '3 hours ago' },
  { id: 'PR-2039', department: 'Finance & HR', budget: '$1,240', status: 'Approved', priority: 'Medium', updated: '1 day ago' },
  { id: 'PR-2038', department: 'Operations', budget: '$14,900', status: 'Rejected', priority: 'High', updated: '2 days ago' },
];

// Mock Activity Log Data
const ACTIVITIES = [
  { id: 1, text: 'Quotation uploaded for PR-2045 (Engineering)', actor: 'Sarah Jenkins', time: '10 mins ago' },
  { id: 2, text: 'Policy violation detected for PR-2041: exceed budget rule', actor: 'Validation-Agent', time: '40 mins ago' },
  { id: 3, text: 'Vendor approved: CompSource Inc. for PR-2039', actor: 'Director Signature', time: '3 hours ago' },
  { id: 4, text: 'Purchase Order generated PO-2026-9039', actor: 'ERP-Sync-Agent', time: '5 hours ago' },
  { id: 5, text: 'Manager approval completed for PR-2044', actor: 'Sarah Jenkins', time: '1 day ago' },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeDetailKpi, setActiveDetailKpi] = useState<string | null>(null);

  const selectedKpiData = activeDetailKpi ? KPI_DETAILS[activeDetailKpi] : null;

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Executive Dashboard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time intelligence dashboard mapping company spending behavior, pending approvals, and vendor SLAs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 font-semibold" onClick={() => navigate('/audit-trail')}>
            <Activity size={14} />
            View Audit Logs
          </Button>
          <Button size="sm" className="text-xs gap-1.5 font-semibold" onClick={() => navigate('/upload-quotations')}>
            <Upload size={14} />
            Upload Quotation
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_CARDS.map((card, i) => (
          <div
            key={i}
            onClick={() => setActiveDetailKpi(card.title)}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col justify-between gap-3 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-850 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer select-none"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-[80%]">
                {card.title}
              </span>
              <div
                className={`p-1.5 rounded-lg ${
                  card.color === 'success'
                    ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400'
                    : card.color === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                    : card.color === 'danger'
                    ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                    : 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400'
                }`}
              >
                <card.icon size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                {card.value}
              </h3>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1.5 font-medium flex items-center justify-between">
                <span>{card.change}</span>
                <span className="text-[8px] font-bold text-primary-550 dark:text-primary-450 uppercase tracking-widest ml-1 opacity-0 hover:opacity-100 transition-opacity">View details</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Monthly Procurement Trend
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Total expenditure trends over the current fiscal year.
              </p>
            </div>
            <TrendingUp size={16} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approval Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Approval Distribution
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Breakdown of active request states.
              </p>
            </div>
            <Clock size={16} className="text-slate-400" />
          </div>
          <div className="h-64 flex flex-col justify-between">
            <div className="flex-1 min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STATUS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {STATUS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {STATUS_DATA.map((status, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{status.name}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 ml-auto">{status.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vendor Performance Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 lg:col-span-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Vendor Quality & Delivery Compliance
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Comparison between vendor quality rating (%) and SLA delivery compliance rate (%).
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VENDOR_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="rating" name="Quality Score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sla" name="SLA Delivery Rate" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/purchase-requests')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary-500 hover:bg-primary-50/10 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
                  <PlusCircle size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    New Purchase Request
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Launch template editor
                  </p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/upload-quotations')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary-500 hover:bg-primary-50/10 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
                  <Upload size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Upload Quotation
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Extract data with AI OCR
                  </p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Layout - Table + Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Purchase Requests Table */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Recent Purchase Requests
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 gap-1"
              onClick={() => navigate('/purchase-requests')}
            >
              View all requests
              <ArrowRight size={12} />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80">
                  <th className="p-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Request ID</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Budget</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Last Updated</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {RECENT_REQUESTS.map((req, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{req.id}</td>
                    <td className="p-4">{req.department}</td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{req.budget}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          req.status === 'Approved'
                            ? 'success'
                            : req.status === 'Under Review'
                            ? 'info'
                            : req.status === 'Rejected'
                            ? 'error'
                            : 'warning'
                        }
                      >
                        {req.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          req.priority === 'Critical'
                            ? 'critical'
                            : req.priority === 'High'
                            ? 'error'
                            : req.priority === 'Medium'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {req.priority}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-400 dark:text-slate-500">{req.updated}</td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate('/vendor-comparison')}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Recent Activity Log
          </h3>
          <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-5">
            {ACTIVITIES.map((act) => (
              <div key={act.id} className="relative">
                {/* Node Bullet Point */}
                <div className="absolute -left-[21.5px] top-1 h-3 w-3 rounded-full bg-white dark:bg-slate-900 border-2 border-primary-600" />
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-normal font-medium">
                    {act.text}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span>by {act.actor}</span>
                    <span>•</span>
                    <span>{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAILED KPI SUMMARY MODAL OVERLAY */}
      <AnimatePresence>
        {selectedKpiData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDetailKpi(null)}
              className="fixed inset-0 z-40 bg-slate-950"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-2xl h-max bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-left"
            >
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest block">
                    Executive Analytics Breakdown
                  </span>
                  <h3 className="text-base font-bold text-slate-850 dark:text-slate-200 mt-1">
                    {selectedKpiData.title}
                  </h3>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">
                    {selectedKpiData.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => setActiveDetailKpi(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-4 text-xs font-normal">
                {/* Tabular Details List */}
                <div className="border border-slate-150 dark:border-slate-850 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 text-slate-500 font-semibold">
                        {selectedKpiData.headers.map((h, idx) => (
                          <th key={idx} className="p-3 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                      {selectedKpiData.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                          {row.map((val, cellIdx) => (
                            <td key={cellIdx} className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                              {val.includes('$') || val.includes('%') || val.includes('PR-') || val.includes('POL-') ? (
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{val}</span>
                              ) : (
                                <span>{val}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl flex gap-2.5 items-start">
                  <Info size={16} className="text-primary-650 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed font-normal">
                    {selectedKpiData.summaryText}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  onClick={() => setActiveDetailKpi(null)}
                  size="sm"
                  className="text-xs py-1.5"
                >
                  Dismiss Report
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
