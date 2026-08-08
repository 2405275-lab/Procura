import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProcurement } from '@/hooks/useProcurement';
import { useToast } from '@/components/common/Toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressStepper } from '@/components/procurement/ProgressStepper';
import { AnimatePresence, motion } from 'framer-motion';
import {
  TrendingUp,
  Award,
  DollarSign,
  Truck,
  ShieldCheck,
  ShieldAlert,
  Star,
  FileCheck,
  FileDown,
  Eye,
  Pin,
  X,
  Plus,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { cn } from '@/utils/cn';

export const VendorComparisonWorkspace: React.FC = () => {
  const { requests, vendors, activeRequest, addAuditLog } = useProcurement();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isExecutiveOrPM = user?.role === 'Approving Manager' || 
                          user?.role === 'System Administrator' || 
                          user?.role === 'Procurement Officer' ||
                          user?.role?.toLowerCase().includes('executive') || 
                          user?.role?.toLowerCase().includes('product') || 
                          user?.role?.toLowerCase().includes('manager');

  const [pinnedVendorIds, setPinnedVendorIds] = useState<string[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerVendor, setDrawerVendor] = useState<any>(null);

  // Fallback to first open request if activeRequest is null
  const currentRequest = activeRequest || requests.find((r) => r.status === 'Open') || requests[0];

  // Mock Vendor scores for Radar Chart visualizer
  const getVendorRadarData = (vendorName: string) => {
    switch (vendorName) {
      case 'CompSource Inc.':
        return [
          { subject: 'Price', value: 92 },
          { subject: 'Warranty', value: 95 },
          { subject: 'Delivery', value: 94 },
          { subject: 'Rating', value: 96 },
          { subject: 'Risk', value: 90 },
          { subject: 'Compliance', value: 100 }
        ];
      case 'Staples Corporate Store':
        return [
          { subject: 'Price', value: 89 },
          { subject: 'Warranty', value: 80 },
          { subject: 'Delivery', value: 98 },
          { subject: 'Rating', value: 90 },
          { subject: 'Risk', value: 92 },
          { subject: 'Compliance', value: 100 }
        ];
      case 'GlobalTech Logistics':
        return [
          { subject: 'Price', value: 85 },
          { subject: 'Warranty', value: 65 },
          { subject: 'Delivery', value: 60 },
          { subject: 'Rating', value: 84 },
          { subject: 'Risk', value: 70 },
          { subject: 'Compliance', value: 80 }
        ];
      case 'Office Depot':
        return [
          { subject: 'Price', value: 82 },
          { subject: 'Warranty', value: 70 },
          { subject: 'Delivery', value: 90 },
          { subject: 'Rating', value: 80 },
          { subject: 'Risk', value: 75 },
          { subject: 'Compliance', value: 100 }
        ];
      default:
        return [
          { subject: 'Price', value: 60 },
          { subject: 'Warranty', value: 50 },
          { subject: 'Delivery', value: 70 },
          { subject: 'Rating', value: 70 },
          { subject: 'Risk', value: 40 },
          { subject: 'Compliance', value: 50 }
        ];
    }
  };

  const getVendorDetails = (name: string) => {
    return vendors.find((v) => v.name === name) || vendors[0];
  };

  // Simulated comparison list of vendors with quotes
  const quoteVendors = [
    { name: 'CompSource Inc.', price: '$62,500', warranty: '3 Years Premium', delivery: '5 Days', gst: 'Verified', rating: '4.8 / 5', risk: 'Low', policy: 'Pass', score: 94, recommended: true, confidence: 96, key: 'VND-001' },
    { name: 'Staples Corporate Store', price: '$63,200', warranty: '2 Years Corporate', delivery: '2 Days', gst: 'Verified', rating: '4.5 / 5', risk: 'Low', policy: 'Pass', score: 88, recommended: false, confidence: 91, key: 'VND-003' },
    { name: 'GlobalTech Logistics', price: '$64,900', warranty: '1 Year Depot', delivery: '14 Days', gst: 'Verified', rating: '4.2 / 5', risk: 'Medium', policy: 'Warning', score: 82, recommended: false, confidence: 82, key: 'VND-002' },
    { name: 'Office Depot', price: '$65,500', warranty: '1 Year Depot', delivery: '3 Days', gst: 'Verified', rating: '4.0 / 5', risk: 'Medium', policy: 'Pass', score: 78, recommended: false, confidence: 85, key: 'VND-004' },
    { name: 'SysLogistics Solutions', price: '$61,200', warranty: 'No Warranty', delivery: '8 Days', gst: 'Unverified', rating: '3.5 / 5', risk: 'High', policy: 'Failed', score: 60, recommended: false, confidence: 71, key: 'VND-005' }
  ];

  const togglePin = (vendorKey: string) => {
    setPinnedVendorIds((prev) =>
      prev.includes(vendorKey) ? prev.filter((id) => id !== vendorKey) : [...prev, vendorKey]
    );
    showToast(pinnedVendorIds.includes(vendorKey) ? 'Vendor unpinned.' : 'Vendor pinned to front.', 'info');
  };

  const handleOpenDrawer = (vendor: any) => {
    const profile = getVendorDetails(vendor.name);
    setDrawerVendor({ ...vendor, ...profile });
    setShowDrawer(true);
  };

  const handleExport = () => {
    showToast('Exporting comparison ledger. Report download initialized.', 'success');
    addAuditLog({
      agent: 'Sarah Jenkins',
      action: 'Export Report',
      decision: 'Comparison Report Exported',
      reason: `Downloaded vendor comparison sheet for request ${currentRequest.id}`,
      status: 'Completed',
      requestId: currentRequest.id
    });
  };

  const handleStartApproval = (vendorName: string) => {
    showToast(`Initializing manager approval sequence for ${vendorName}.`, 'info');
    navigate(`/approvals`);
  };

  // Arrange vendors by pinning priority
  const sortedVendors = [...quoteVendors].sort((a, b) => {
    const aPinned = pinnedVendorIds.includes(a.key);
    const bPinned = pinnedVendorIds.includes(b.key);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return b.score - a.score; // Fallback sorting by AI score
  });

  return (
    <div className="space-y-6 text-left relative">
      
      {/* Top request summaries banner */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-primary-600 uppercase tracking-wider">{currentRequest.id}</span>
            <span className="text-slate-350 dark:text-slate-600 font-light">/</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{currentRequest.title}</span>
            {isExecutiveOrPM ? (
              <Badge variant="warning" className="text-[9px] font-bold py-0.5 px-2 uppercase tracking-wider gap-1 border-amber-500/20 bg-amber-500/10 text-amber-500 rounded-md">
                👑 Executive Insights Unlocked
              </Badge>
            ) : (
              <Badge variant="neutral" className="text-[9px] font-bold py-0.5 px-2 uppercase tracking-wider rounded-md">
                Standard View
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
            <span>Department: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentRequest.department}</strong></span>
            <span>Budget Ceiling: <strong className="text-slate-800 dark:text-slate-200 font-semibold">${currentRequest.budget.toLocaleString()}</strong></span>
            <span>Quotes Saved: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentRequest.numQuotations}</strong></span>
            <span>Assignee: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentRequest.officer}</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport} className="text-xs font-semibold gap-1.5">
            <FileDown size={14} />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/upload-quotations')} className="text-xs font-semibold gap-1.5">
            <Plus size={14} />
            Add Vendor
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/audit-trail')} className="text-xs font-semibold gap-1.5">
            <FileCheck size={14} />
            View Audits
          </Button>
        </div>
      </div>

      {/* Stepper progress tracker */}
      <ProgressStepper currentStage="Vendor Comparison" />

      {/* Flagship AI Recommendation Banner */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-primary-50/20 dark:from-primary-950/20 dark:to-slate-900 border border-primary-200/50 dark:border-primary-800/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden select-none">
        
        {/* Subtle decorative background spark */}
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-500/10 blur-2xl" />

        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-600/20 flex-shrink-0 mt-0.5">
            <Award size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-primary-700 dark:text-primary-400 uppercase tracking-widest">
                🏆 Top AI Recommendation
              </span>
              <Badge variant="success" className="text-[9px] py-0 px-1 font-bold">96% Conf.</Badge>
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              CompSource Inc. (Score 94/100)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Recommended for best overall price matching, fast SLA delivery times, and clean 100% compliance checklist pass without any exception flags. Saves **$2,400** over next best bidder.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 z-10">
          <Button
            size="sm"
            onClick={() => handleStartApproval('CompSource Inc.')}
            className="text-xs font-semibold py-2 px-4 shadow-lg shadow-primary-600/10 gap-1.5"
          >
            Start Approval Workflow
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      {/* Flagship Vendor Comparison Side-by-side Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Vendor Comparison Matrix
          </h3>
          <span className="text-[10px] text-slate-400">Click row elements to view AI score cards.</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-150 dark:border-slate-800">
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider w-[180px]">
                  Evaluation Criteria
                </th>
                
                {sortedVendors.map((vendor) => {
                  const isPinned = pinnedVendorIds.includes(vendor.key);
                  return (
                    <th
                      key={vendor.key}
                      className={cn(
                        'p-4 text-xs font-bold border-l border-slate-100 dark:border-slate-800 text-center relative group min-w-[200px]',
                        vendor.recommended ? 'bg-primary-50/10 dark:bg-primary-950/5' : ''
                      )}
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{vendor.name}</span>
                        {vendor.recommended && (
                          <Badge variant="success" className="text-[9px] py-0 font-bold uppercase tracking-wider">
                            🏆 Recommended
                          </Badge>
                        )}
                        <div className="flex gap-2.5 mt-2">
                          <button
                            onClick={() => togglePin(vendor.key)}
                            title={isPinned ? 'Unpin column' : 'Pin column to left'}
                            className={cn(
                              'p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer',
                              isPinned ? 'text-primary-600' : 'text-slate-450'
                            )}
                          >
                            <Pin size={11} className={cn(isPinned && 'fill-current')} />
                          </button>
                          <button
                            onClick={() => handleOpenDrawer(vendor)}
                            title="View Score Breakdown"
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-800 cursor-pointer"
                          >
                            <Eye size={11} />
                          </button>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              
              {/* Quoted Price Row */}
              <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                <td className="p-4 font-semibold text-slate-500 flex items-center gap-1.5">
                  <DollarSign size={13} className="text-slate-400" />
                  Quoted Price
                </td>
                {sortedVendors.map((vendor) => (
                  <td key={vendor.key} className="p-4 text-center font-bold text-slate-800 dark:text-slate-100 border-l border-slate-100 dark:border-slate-800">
                    {vendor.price}
                  </td>
                ))}
              </tr>

              {/* Warranty Row */}
              <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                <td className="p-4 font-semibold text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-slate-400" />
                  Warranty Support
                </td>
                {sortedVendors.map((vendor) => (
                  <td key={vendor.key} className="p-4 text-center text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-800">
                    {vendor.warranty}
                  </td>
                ))}
              </tr>

              {/* Delivery Row */}
              <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                <td className="p-4 font-semibold text-slate-500 flex items-center gap-1.5">
                  <Truck size={13} className="text-slate-400" />
                  Delivery SLA
                </td>
                {sortedVendors.map((vendor) => (
                  <td key={vendor.key} className="p-4 text-center text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-800">
                    {vendor.delivery}
                  </td>
                ))}
              </tr>

              {/* GST Row */}
              <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                <td className="p-4 font-semibold text-slate-500 flex items-center gap-1.5">
                  <FileCheck size={13} className="text-slate-400" />
                  GST Status
                </td>
                {sortedVendors.map((vendor) => (
                  <td key={vendor.key} className="p-4 text-center border-l border-slate-100 dark:border-slate-800">
                    <Badge variant={vendor.gst === 'Verified' ? 'success' : 'error'}>
                      {vendor.gst}
                    </Badge>
                  </td>
                ))}
              </tr>

              {/* Vendor Rating */}
              <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                <td className="p-4 font-semibold text-slate-500 flex items-center gap-1.5">
                  <Star size={13} className="text-slate-400" />
                  Vendor Rating
                </td>
                {sortedVendors.map((vendor) => (
                  <td key={vendor.key} className="p-4 text-center border-l border-slate-100 dark:border-slate-800 font-semibold">
                    {vendor.rating}
                  </td>
                ))}
              </tr>

              {/* Risk Row */}
              <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                <td className="p-4 font-semibold text-slate-500 flex items-center gap-1.5">
                  <ShieldAlert size={13} className="text-slate-400" />
                  Risk Rating
                </td>
                {sortedVendors.map((vendor) => (
                  <td key={vendor.key} className="p-4 text-center border-l border-slate-100 dark:border-slate-800">
                    <Badge variant={vendor.risk === 'Low' ? 'success' : vendor.risk === 'Medium' ? 'warning' : 'error'}>
                      {vendor.risk} Risk
                    </Badge>
                  </td>
                ))}
              </tr>

              {/* Policy Status Row */}
              <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                <td className="p-4 font-semibold text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-slate-400" />
                  Compliance Policy
                </td>
                {sortedVendors.map((vendor) => (
                  <td key={vendor.key} className="p-4 text-center border-l border-slate-100 dark:border-slate-800">
                    <Badge variant={vendor.policy === 'Pass' ? 'success' : vendor.policy === 'Warning' ? 'warning' : 'error'}>
                      {vendor.policy}
                    </Badge>
                  </td>
                ))}
              </tr>

              {/* Conditional Detailed Comparison Rows (Unlocked for Executive / Product Manager Roles) */}
              {isExecutiveOrPM && (
                <>
                  {/* Unit Cost Delta Row */}
                  <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 bg-primary-50/5 dark:bg-primary-950/5">
                    <td className="p-4 font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1.5 pl-6 border-l-2 border-primary-500">
                      <TrendingUp size={13} />
                      Unit Cost Delta vs. Baseline
                    </td>
                    {sortedVendors.map((vendor) => {
                      const deltas: Record<string, string> = {
                        'VND-001': '+18.5% Cost Surplus (Under Budget)',
                        'VND-003': '+12.0% Cost Surplus (Under Budget)',
                        'VND-002': '-4.2% Deficit (Over Budget Baseline)',
                        'VND-004': '+8.0% Cost Surplus (Under Budget)',
                        'VND-005': '+22.1% Cost Surplus (Lowest Bid)'
                      };
                      return (
                        <td key={vendor.key} className="p-4 text-center font-bold text-slate-850 dark:text-slate-200 border-l border-slate-100 dark:border-slate-800">
                          {deltas[vendor.key] || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Technical SLA breaches Row */}
                  <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 bg-primary-50/5 dark:bg-primary-950/5">
                    <td className="p-4 font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1.5 pl-6 border-l-2 border-primary-500">
                      <Clock size={13} />
                      Historic SLA Breaches (12mo)
                    </td>
                    {sortedVendors.map((vendor) => {
                      const breaches: Record<string, string> = {
                        'VND-001': '0 Breaches logged',
                        'VND-003': '1 minor delivery delay',
                        'VND-002': '5 severe delays (delivery warning)',
                        'VND-004': '2 minor transit delays',
                        'VND-005': '12 breaches (compliance failure)'
                      };
                      return (
                        <td key={vendor.key} className="p-4 text-center text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-800 font-medium">
                          {breaches[vendor.key] || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Financial Solvency Row */}
                  <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 bg-primary-50/5 dark:bg-primary-950/5">
                    <td className="p-4 font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1.5 pl-6 border-l-2 border-primary-500">
                      <Award size={13} />
                      Fiscal Solvency Rating
                    </td>
                    {sortedVendors.map((vendor) => {
                      const solvency: Record<string, { rating: string, label: string }> = {
                        'VND-001': { rating: 'AAA', label: 'Prime stability' },
                        'VND-003': { rating: 'AA+', label: 'High grade' },
                        'VND-002': { rating: 'BBB-', label: 'Medium risk' },
                        'VND-004': { rating: 'AA', label: 'High stability' },
                        'VND-005': { rating: 'C', label: 'High solvency risk' }
                      };
                      const v = solvency[vendor.key] || { rating: 'N/A', label: 'N/A' };
                      return (
                        <td key={vendor.key} className="p-4 text-center border-l border-slate-100 dark:border-slate-800">
                          <span className="font-bold text-slate-800 dark:text-slate-100 mr-1.5">{v.rating}</span>
                          <span className="text-[10px] text-slate-450 font-normal">({v.label})</span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Lead Time Reliability Row */}
                  <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 bg-primary-50/5 dark:bg-primary-950/5">
                    <td className="p-4 font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1.5 pl-6 border-l-2 border-primary-500">
                      <Truck size={13} />
                      Transit SLA Reliability
                    </td>
                    {sortedVendors.map((vendor) => {
                      const reliability: Record<string, string> = {
                        'VND-001': '99.4% reliable',
                        'VND-003': '98.8% reliable',
                        'VND-002': '82.1% (unstable delivery times)',
                        'VND-004': '95.2% reliable',
                        'VND-005': '68.5% (unreliable delivery times)'
                      };
                      return (
                        <td key={vendor.key} className="p-4 text-center text-slate-700 dark:text-slate-300 border-l border-slate-100 dark:border-slate-800 font-medium">
                          {reliability[vendor.key] || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                </>
              )}

              {/* AI Overall Score Row */}
              <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 bg-slate-50/20 dark:bg-slate-900/10 font-bold text-slate-900 dark:text-white">
                <td className="p-4 font-bold flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-primary-600" />
                  Overall AI Score
                </td>
                {sortedVendors.map((vendor) => (
                  <td key={vendor.key} className="p-4 text-center border-l border-slate-100 dark:border-slate-800 text-sm">
                    <span className={cn('px-2.5 py-1 rounded-lg border font-black text-xs', {
                      'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400': vendor.score >= 90,
                      'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-400': vendor.score >= 75 && vendor.score < 90,
                      'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400': vendor.score < 75
                    })}>
                      {vendor.score} / 100
                    </span>
                  </td>
                ))}
              </tr>

              {/* Action Buttons Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-500">Decision</td>
                {sortedVendors.map((vendor) => (
                  <td key={vendor.key} className="p-4 text-center border-l border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-2 max-w-[130px] mx-auto">
                      <Button
                        variant={vendor.recommended ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleStartApproval(vendor.name)}
                        className="text-[10px] font-bold py-1 px-2.5"
                      >
                        Select
                      </Button>
                      <button
                        onClick={() => navigate(`/vendors/${vendor.key}`)}
                        className="text-[10px] text-slate-500 hover:text-primary-600 font-semibold cursor-pointer"
                      >
                        Vendor Profile
                      </button>
                    </div>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* AI Reasoning Panel Drawer */}
      <AnimatePresence>
        {showDrawer && drawerVendor && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 z-40 bg-slate-950"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[450px] max-w-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col justify-between shadow-2xl p-6 text-left overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      AI Value Scorecard
                    </span>
                    <h3 className="text-base font-black text-slate-850 dark:text-slate-100 mt-1">
                      {drawerVendor.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Score breakdown metrics visualizer */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Score Breakdown
                  </h4>
                  <div className="h-60 bg-slate-50 dark:bg-slate-950 p-2 border border-slate-150 dark:border-slate-850 rounded-xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getVendorRadarData(drawerVendor.name)}>
                        <PolarGrid stroke="#cbd5e1" />
                        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={8} />
                        <Radar name={drawerVendor.name} dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Reasoning Summary */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    AI Logic Report
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {drawerVendor.name === 'CompSource Inc.' 
                      ? 'CompSource provides the most balanced bid parameters. High rating from historical procurement, combined with an active warranty period and low risk score, makes this vendor the ideal choice for business operations.' 
                      : 'While this bidder provides reasonable unit pricing, the long delivery SLA and unverified legal credentials flag security warnings.'}
                  </p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-green-50/30 border border-green-200/50 rounded-xl space-y-2">
                    <h5 className="text-[10px] font-bold text-green-700 uppercase tracking-widest">
                      Strengths
                    </h5>
                    <ul className="text-xs space-y-1.5 text-green-800">
                      {drawerVendor.name === 'CompSource Inc.' ? (
                        <>
                          <li>• Low delivery time</li>
                          <li>• Excellent warranty</li>
                          <li>• Verified GSTIN</li>
                        </>
                      ) : (
                        <>
                          <li>• Low unit price</li>
                          <li>• Short distance</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-red-50/20 border border-red-200/55 rounded-xl space-y-2">
                    <h5 className="text-[10px] font-bold text-red-750 uppercase tracking-widest">
                      Weaknesses
                    </h5>
                    <ul className="text-xs space-y-1.5 text-red-800">
                      {drawerVendor.name === 'CompSource Inc.' ? (
                        <>
                          <li>• Slightly higher cost</li>
                          <li>• Fixed payment term</li>
                        </>
                      ) : (
                        <>
                          <li>• Expired quote terms</li>
                          <li>• Long delivery time</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <Button variant="outline" className="w-full text-xs font-semibold py-2" onClick={() => setShowDrawer(false)}>
                  Cancel
                </Button>
                <Button className="w-full text-xs font-semibold py-2" onClick={() => handleStartApproval(drawerVendor.name)}>
                  Select Vendor
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
