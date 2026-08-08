import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
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
  AlertTriangle
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

// Mock KPI Cards Data
const KPI_CARDS = [
  { title: 'Total Purchase Requests', value: '142', icon: FileText, change: '+12% from last month', color: 'primary' },
  { title: 'Pending Approvals', value: '18', icon: Clock, change: '6 urgent review items', color: 'warning' },
  { title: 'Approved Vendors', value: '37', icon: UserCheck, change: '+4 newly certified', color: 'success' },
  { title: 'Policy Violations', value: '3', icon: ShieldAlert, change: '1 override requested', color: 'danger' },
  { title: 'Estimated Savings', value: '$84,230', icon: Percent, change: '14.2% average discount', color: 'success' },
  { title: 'Avg Processing Time', value: '4.8 hrs', icon: Timer, change: '-1.2 hrs this week', color: 'primary' },
];

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
  const [activeCard, setActiveCard] = useState<string | null>(null);

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
        {KPI_CARDS.map((card, i) => {
          const isActive = activeCard === card.title;
          return (
            <div
              key={i}
              onClick={() => setActiveCard(prev => prev === card.title ? null : card.title)}
              className={cn(
                "p-4 bg-white dark:bg-slate-900 border rounded-xl flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer select-none active:scale-[0.98]",
                isActive
                  ? "border-primary-500 ring-2 ring-primary-500/10 dark:ring-primary-500/20"
                  : "border-slate-200 dark:border-slate-800"
              )}
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
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
                  {card.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Details Panel */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm overflow-hidden text-xs text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span>{activeCard}</span>
                  <span className="text-[9px] bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-450 px-2 py-0.5 rounded font-mono font-bold">
                    Interactive Detail View
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Detailed ledger logs, categorised segments, and metrics.
                </p>
              </div>
              <button
                onClick={() => setActiveCard(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content for Total Purchase Requests */}
            {activeCard === 'Total Purchase Requests' && (
              <div className="space-y-4">
                <p className="text-slate-500 leading-normal mb-2">
                  These represent purchase requests received categorised by department. It details quotation deals sent by vendors/dealers via company emails accessible to the procurement officer:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category 1: IT Hardware */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 p-4 rounded-xl space-y-3">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs border-b border-slate-200/50 dark:border-slate-800/50 pb-1.5 flex items-center justify-between">
                      <span>IT Hardware & Infrastructure</span>
                      <span className="text-[9px] bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-semibold">2 Active Bids</span>
                    </h4>
                    <div className="space-y-2">
                      <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-lg text-[11px] space-y-1">
                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                          <span>CompSource Inc. (Quote CS-2026-904)</span>
                          <span className="text-green-600 dark:text-green-450 font-bold">$62,500.00</span>
                        </div>
                        <p className="text-slate-500 text-[10px] leading-relaxed">
                          SLA: 4 Days | Warranty: 3 Years | Received via <code className="text-primary-600 dark:text-primary-400 font-semibold font-mono">deals@company.com</code> (2 hours ago)
                        </p>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-lg text-[11px] space-y-1">
                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                          <span>GlobalTech Logistics (Quote GT-2026-401)</span>
                          <span className="text-slate-650 dark:text-slate-400 font-bold">$68,900.00</span>
                        </div>
                        <p className="text-slate-500 text-[10px] leading-relaxed">
                          SLA: 14 Days | Warranty: 2 Years | Received via <code className="text-primary-600 dark:text-primary-400 font-semibold font-mono">quotes@company.com</code> (4 hours ago)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Logistics & Warehousing */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 p-4 rounded-xl space-y-3">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs border-b border-slate-200/50 dark:border-slate-800/50 pb-1.5 flex items-center justify-between">
                      <span>Logistics & Warehousing</span>
                      <span className="text-[9px] bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-semibold">1 Active Bid</span>
                    </h4>
                    <div className="space-y-2">
                      <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-lg text-[11px] space-y-1">
                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                          <span>SysLogistics Solutions (Quote SL-2026-805)</span>
                          <span className="text-amber-600 dark:text-amber-450 font-bold">$18,450.00</span>
                        </div>
                        <p className="text-slate-500 text-[10px] leading-relaxed">
                          SLA: 15 Days | Warranty: 1 Year | Received via <code className="text-primary-600 dark:text-primary-400 font-semibold font-mono">contracts@company.com</code> (1 day ago)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Pending Approvals */}
            {activeCard === 'Pending Approvals' && (
              <div className="space-y-4">
                <p className="text-slate-500 leading-normal mb-2">
                  The following requests have not been approved yet and are sorted category-wise:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                        <th className="py-2 px-3">Req ID</th>
                        <th className="py-2 px-3">Category / Title</th>
                        <th className="py-2 px-3">Budget</th>
                        <th className="py-2 px-3">Priority</th>
                        <th className="py-2 px-3">Current Status</th>
                        <th className="py-2 px-3">Pending Since</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="py-2.5 px-3 font-mono font-bold">PR-2041</td>
                        <td className="py-2.5 px-3">IT Hardware &bull; High-End Rack Servers</td>
                        <td className="py-2.5 px-3 font-semibold">$62,500.00</td>
                        <td className="py-2.5 px-3"><Badge variant="critical">Critical</Badge></td>
                        <td className="py-2.5 px-3 text-red-500 font-medium">Awaiting Policy Override Signature</td>
                        <td className="py-2.5 px-3 text-slate-550">3 hours ago</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="py-2.5 px-3 font-mono font-bold">PR-2045</td>
                        <td className="py-2.5 px-3">Logistics &bull; Custom Freight Routing</td>
                        <td className="py-2.5 px-3 font-semibold">$18,450.00</td>
                        <td className="py-2.5 px-3"><Badge variant="warning">High</Badge></td>
                        <td className="py-2.5 px-3 text-amber-500 font-medium">Awaiting Policy Review</td>
                        <td className="py-2.5 px-3 text-slate-550">20 mins ago</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="py-2.5 px-3 font-mono font-bold">PR-2042</td>
                        <td className="py-2.5 px-3">Facilities &bull; HVAC Maintenance</td>
                        <td className="py-2.5 px-3 font-semibold">$12,800.00</td>
                        <td className="py-2.5 px-3"><Badge variant="neutral">Medium</Badge></td>
                        <td className="py-2.5 px-3 text-slate-500 font-medium">Awaiting Manager Approval</td>
                        <td className="py-2.5 px-3 text-slate-550">5 hours ago</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Content for Approved Vendors */}
            {activeCard === 'Approved Vendors' && (
              <div className="space-y-4">
                <p className="text-slate-500 leading-normal mb-2">
                  List of pre-certified approved vendors categorized by their service vertical:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">IT Infrastructure</span>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">CompSource Inc.</div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Rating: <span className="text-green-600 dark:text-green-450 font-bold">94%</span> | SLA Compliance: 98%<br/>
                      Certified since: 2024<br/>
                      Total deals: 12 (latest: PR-2041)
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Logistics Services</span>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">GlobalTech Logistics</div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Rating: <span className="text-green-600 dark:text-green-450 font-bold">88%</span> | SLA Compliance: 92%<br/>
                      Certified since: 2025<br/>
                      Total deals: 8 (latest: PR-2044)
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Office Supplies</span>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Office Depot</div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Rating: <span className="text-green-600 dark:text-green-450 font-bold">85%</span> | SLA Compliance: 89%<br/>
                      Certified since: 2023<br/>
                      Total deals: 17 (latest: PR-2039)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Policy Violations */}
            {activeCard === 'Policy Violations' && (
              <div className="space-y-4">
                <p className="text-slate-500 leading-normal mb-2">
                  Active policy failures listing the vendor, failed rules, and exact failure point context:
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50/20 dark:bg-red-950/10 border border-red-200/40 dark:border-red-900/20 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={15} />
                    <div className="space-y-1 text-[11px] leading-relaxed">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-semibold">SysLogistics (PR-2045)</span>
                        <Badge variant="critical">Failed: POL-001</Badge>
                      </div>
                      <p className="text-slate-500">
                        <strong className="text-slate-700 dark:text-slate-300">Failure Point:</strong> OCR Validation Layer &bull; The scanned GSTIN signature is unverified or missing from the invoice.
                      </p>
                      <p className="text-primary-600 dark:text-primary-400 font-bold">Recommended action: Provide corporate legal override signature.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/20 dark:bg-amber-950/10 border border-amber-200/40 dark:border-amber-900/20 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={15} />
                    <div className="space-y-1 text-[11px] leading-relaxed">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-semibold">GlobalTech (PR-2045)</span>
                        <Badge variant="warning">Warning: POL-002</Badge>
                      </div>
                      <p className="text-slate-500">
                        <strong className="text-slate-700 dark:text-slate-300">Failure Point:</strong> SLA Timeline Audit &bull; The delivery lead time (14 days) exceeds the standard ceiling mandate of 7 days.
                      </p>
                      <p className="text-primary-600 dark:text-primary-400 font-bold">Recommended action: Negotiate priority shipping options or grant override.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Estimated Savings */}
            {activeCard === 'Estimated Savings' && (
              <div className="space-y-4">
                <p className="text-slate-500 leading-normal mb-2">
                  Itemized cost savings realized across approved procurement deals:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-green-50/20 dark:bg-green-950/10 border border-green-200/30 dark:border-green-900/20 rounded-xl space-y-1 text-[11px]">
                    <div className="font-mono font-bold text-slate-500">PR-2039</div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-semibold">IT Servers Purchase</span>
                    <div className="text-green-600 dark:text-green-450 font-extrabold text-sm">$12,500 Saved</div>
                    <p className="text-[10px] text-slate-500">Selected CompSource lowest competitive bid.</p>
                  </div>
                  <div className="p-3 bg-green-50/20 dark:bg-green-950/10 border border-green-200/30 dark:border-green-900/20 rounded-xl space-y-1 text-[11px]">
                    <div className="font-mono font-bold text-slate-500">PR-2044</div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-semibold">Logistics Contract</span>
                    <div className="text-green-600 dark:text-green-450 font-extrabold text-sm">$700 Saved</div>
                    <p className="text-[10px] text-slate-500">Negotiated priority shipping rate.</p>
                  </div>
                  <div className="p-3 bg-green-50/20 dark:bg-green-950/10 border border-green-200/30 dark:border-green-900/20 rounded-xl space-y-1 text-[11px]">
                    <div className="font-mono font-bold text-slate-500">PR-2038</div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-semibold">Office Furniture</span>
                    <div className="text-green-600 dark:text-green-450 font-extrabold text-sm">$3,100 Saved</div>
                    <p className="text-[10px] text-slate-500">Applied pre-negotiated corporate catalog rates.</p>
                  </div>
                  <div className="p-3 bg-primary-50/20 dark:bg-primary-950/10 border border-primary-200/30 dark:border-primary-900/20 rounded-xl space-y-1 text-[11px] flex flex-col justify-center">
                    <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[9px] block">Total Savings</span>
                    <div className="text-primary-600 dark:text-primary-400 font-black text-lg leading-tight">$84,230</div>
                    <p className="text-[9px] text-slate-500 font-semibold">14.2% average savings rate realized.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Content for Avg Processing Time */}
            {activeCard === 'Avg Processing Time' && (
              <div className="space-y-4">
                <p className="text-slate-500 leading-normal mb-2">
                  Timeline latency breakdown by execution stage, followed by cumulative average metric calculations:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-850 rounded-xl text-center space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Stage 1: OCR</span>
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200 font-bold">0.8 hrs</div>
                    <p className="text-[9px] text-slate-500">Scanners & text parsing</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-850 rounded-xl text-center space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 tracking-wider block">Stage 2: Parsing</span>
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200 font-bold">1.2 hrs</div>
                    <p className="text-[9px] text-slate-500">Extraction LLM mapping</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-850 rounded-xl text-center space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 tracking-wider block">Stage 3: Policy</span>
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200 font-bold">0.4 hrs</div>
                    <p className="text-[9px] text-slate-500">Database rules checks</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-850 rounded-xl text-center space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 tracking-wider block">Stage 4: Audit</span>
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200 font-bold">1.8 hrs</div>
                    <p className="text-[9px] text-slate-500">Officer verification</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-850 rounded-xl text-center space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 tracking-wider block">Stage 5: Approval</span>
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200 font-bold">0.6 hrs</div>
                    <p className="text-[9px] text-slate-500">Manager sign-offs</p>
                  </div>
                </div>

                <div className="p-3 bg-primary-50/25 dark:bg-primary-950/10 border border-primary-150 dark:border-primary-900/20 rounded-xl flex items-center justify-between text-[11px] font-semibold text-primary-700 dark:text-primary-400 leading-normal mt-4">
                  <div className="flex items-center gap-2">
                    <Timer size={15} />
                    <span>Summarized Metric Calculation Formula:</span>
                  </div>
                  <div className="font-mono text-xs">
                    Total average processing time = 0.8 + 1.2 + 0.4 + 1.8 + 0.6 = 4.8 hrs
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
};
