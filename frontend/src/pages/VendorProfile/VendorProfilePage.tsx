import { useNavigate, useParams } from 'react-router-dom';
import { useProcurement } from '@/hooks/useProcurement';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Star,
  ShieldAlert,
  Percent,
  Clock,
  ThumbsUp,
  FileCheck
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

export const VendorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vendors } = useProcurement();

  const currentVendor = vendors.find((v) => v.id === id) || vendors[0];

  // Mock historical data for Recharts
  const HISTORICAL_SPEND = [
    { year: '2023', spend: 85000 },
    { year: '2024', spend: 120000 },
    { year: '2025', spend: 175000 },
    { year: '2026', spend: 210000 }
  ];

  const DELIVERY_COMPLIANCE = [
    { month: 'Mar', rate: 92 },
    { month: 'Apr', rate: 95 },
    { month: 'May', rate: 94 },
    { month: 'Jun', rate: 97 },
    { month: 'Jul', rate: 98 }
  ];

  return (
    <div className="space-y-6 text-left max-w-6xl">
      
      {/* Header controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Vendor Intelligence Profile</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified corporate dossier containing delivery SLA histories, risk profiles, and historical purchase orders.
          </p>
        </div>
      </div>

      {/* Flagship Profile Info header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center flex-shrink-0 border border-slate-250/20 shadow-inner">
            <Building size={28} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{currentVendor.name}</h3>
                <Badge variant={currentVendor.status === 'Verified' ? 'success' : currentVendor.status === 'Warning' ? 'warning' : 'error'}>
                  {currentVendor.status}
                </Badge>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block mt-0.5">
                Vendor ID: {currentVendor.id}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                {currentVendor.rating} Rating
              </span>
              <span className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300">
                <ShieldAlert size={14} className={currentVendor.riskLevel === 'High' ? 'text-red-500' : 'text-slate-400'} />
                {currentVendor.riskLevel} Risk Profile
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dossier info block */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Corporate Dossier
          </h3>

          <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <FileCheck size={14} className="text-slate-400 flex-shrink-0" />
              <span>GSTIN: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentVendor.gst}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-slate-400 flex-shrink-0" />
              <span>Email: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentVendor.email}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-slate-400 flex-shrink-0" />
              <span>Phone: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentVendor.phone}</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <span>Address: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentVendor.address}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400 flex-shrink-0" />
              <span>In Business: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentVendor.yearsInBusiness} Years</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-slate-400 flex-shrink-0" />
              <span>Website: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentVendor.website}</strong></span>
            </div>
          </div>
        </div>

        {/* Performance metrics Block */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            SLA Performance Index
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Success Rate</span>
              <h4 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-1">
                <Percent size={14} className="text-primary-600" />
                {currentVendor.contractSuccessRate}%
              </h4>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Avg Delivery</span>
              <h4 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-1">
                <Clock size={14} className="text-primary-600" />
                {currentVendor.avgDeliveryTime}
              </h4>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Response SLA</span>
              <h4 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-1">
                <ThumbsUp size={14} className="text-primary-600" />
                {currentVendor.avgResponseTime}
              </h4>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Violations</span>
              <h4 className={`text-base font-black flex items-center gap-1 ${
                currentVendor.violations > 0 ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'
              }`}>
                <ShieldAlert size={14} className="text-primary-600" />
                {currentVendor.violations} Flags
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Historical Spend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Historical Procurement Value (Spend)
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HISTORICAL_SPEND}>
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
                <Bar dataKey="spend" name="Spend Value ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* On-Time Delivery Compliance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Delivery Compliance Rate SLA (%)
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DELIVERY_COMPLIANCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[80, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="rate" name="Compliance Rate (%)" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PO History list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Recent Procurement History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-slate-500">
                <th className="p-4 uppercase tracking-wider">Purchase Order</th>
                <th className="p-4 uppercase tracking-wider">Date</th>
                <th className="p-4 uppercase tracking-wider">Amount</th>
                <th className="p-4 uppercase tracking-wider">Department</th>
                <th className="p-4 uppercase tracking-wider">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {currentVendor.poHistory.map((po, index) => (
                <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15">
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{po.poId}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{po.date}</td>
                  <td className="p-4 font-bold">${po.amount.toLocaleString()}</td>
                  <td className="p-4">{po.department}</td>
                  <td className="p-4">
                    <Badge variant={po.status === 'Paid' ? 'success' : po.status === 'In Transit' ? 'warning' : 'neutral'}>
                      {po.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
