import { useState } from 'react';
import { useToast } from '@/components/common/Toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  DollarSign,
  TrendingUp,
  Download,
  Filter,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const ReportsCenter: React.FC = () => {
  const { showToast } = useToast();

  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    showToast(`Generating report ledger. Download of report.${format.toLowerCase()} initialized.`, 'success');
  };

  const REPORT_DATA = [
    { id: 'RPT-904', name: 'Q3 Hardware Fleet Procurement Cost', dept: 'Procurement', date: '2026-08-01', amount: 62500, status: 'Approved' },
    { id: 'RPT-903', name: 'High-Performance Build Servers Allocation', dept: 'Engineering', date: '2026-07-28', amount: 184500, status: 'Pending' },
    { id: 'RPT-902', name: 'Operational Logistics Gear restocks', dept: 'Operations', date: '2026-07-15', amount: 14900, status: 'Rejected' },
    { id: 'RPT-901', name: 'Stationery replenishment Q2', dept: 'Finance & HR', date: '2026-07-10', amount: 1240, status: 'Approved' }
  ];

  const filteredReports = REPORT_DATA.filter((r) => {
    const matchDept = deptFilter ? r.dept === deptFilter : true;
    const matchStatus = statusFilter ? r.status === statusFilter : true;
    return matchDept && matchStatus;
  });

  return (
    <div className="space-y-6 text-left max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Executive Reporting Center</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Extract custom CSV logs, download auditor-ready PDF ledgers, and analyze spending allocations across corporate budgets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')} className="text-xs font-semibold gap-1 py-1.5 cursor-pointer">
            <Download size={13} />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('Excel')} className="text-xs font-semibold gap-1 py-1.5 cursor-pointer">
            <Download size={13} />
            Export Excel
          </Button>
          <Button size="sm" onClick={() => handleExport('PDF')} className="text-xs font-semibold gap-1 py-1.5 cursor-pointer">
            <Download size={13} />
            Download PDF
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Approved Purchases</span>
            <CheckCircle size={14} className="text-green-600" />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">$63,740</h3>
          <p className="text-[9px] text-slate-500">2 Purchase Orders generated</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Rejected Requests</span>
            <XCircle size={14} className="text-red-500" />
          </div>
          <h3 className="text-lg font-black text-red-650 dark:text-red-400">1 Log</h3>
          <p className="text-[9px] text-slate-500">Bids failed policy validation</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Average PO Cost</span>
            <DollarSign size={14} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-black text-slate-850 dark:text-slate-100">$31,870</h3>
          <p className="text-[9px] text-green-600 font-bold flex items-center gap-0.5">
            <TrendingUp size={10} /> -8% vs last Qtr
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Estimated Savings</span>
            <TrendingUp size={14} className="text-green-600" />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">$2,400</h3>
          <p className="text-[9px] text-green-600 font-bold">14.2% average variance savings</p>
        </div>

      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold flex-shrink-0">
          <Filter size={14} />
          Report Filters:
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none"
          >
            <option value="">All Departments</option>
            <option value="Procurement">Procurement</option>
            <option value="Engineering">Engineering</option>
            <option value="Operations">Operations</option>
            <option value="Finance & HR">Finance & HR</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports Table List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="p-4 uppercase tracking-wider">Report ID</th>
                <th className="p-4 uppercase tracking-wider">Description</th>
                <th className="p-4 uppercase tracking-wider">Department</th>
                <th className="p-4 uppercase tracking-wider">Allocation Date</th>
                <th className="p-4 uppercase tracking-wider">Value</th>
                <th className="p-4 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15">
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{report.id}</td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-350">{report.name}</td>
                  <td className="p-4">{report.dept}</td>
                  <td className="p-4 text-slate-500">{report.date}</td>
                  <td className="p-4 font-bold">${report.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <Badge variant={report.status === 'Approved' ? 'success' : report.status === 'Pending' ? 'warning' : 'error'}>
                      {report.status}
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
