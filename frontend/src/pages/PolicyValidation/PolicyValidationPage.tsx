import { useState } from 'react';
import { useProcurement } from '@/hooks/useProcurement';
import { useToast } from '@/components/common/Toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Info,
  PenTool,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface PolicyRuleEval {
  id: string;
  vendor: string;
  ruleName: string;
  status: 'Pass' | 'Warning' | 'Failed';
  severity: 'Low' | 'Medium' | 'Critical';
  reason: string;
  recommendation: string;
  explanation: string;
  resolution: string;
}

const POLICY_RULES: PolicyRuleEval[] = [
  {
    id: 'POL-001',
    vendor: 'SysLogistics Solutions',
    ruleName: 'GST Number Presence Check',
    status: 'Failed',
    severity: 'Critical',
    reason: 'Unverified GST number parsed from invoice.',
    recommendation: 'Request updated legal registration certificate.',
    explanation: 'Procura policy mandates that all suppliers have a validated GST identification token matching government ledger APIs. An unverified GSTIN blocks transaction flows.',
    resolution: 'Provide corporate legal override signature or upload verified tax document attachment.'
  },
  {
    id: 'POL-002',
    vendor: 'GlobalTech Logistics',
    ruleName: 'Standard Delivery Deadline Limit',
    status: 'Warning',
    severity: 'Medium',
    reason: 'Delivery SLA (14 Days) exceeds standard 7-day limit.',
    recommendation: 'Negotiate priority routing options.',
    explanation: 'Requisition timelines require delivery within 7 working days. Bids offering longer lead times flag standard warnings but can be approved by the Procurement officer.',
    resolution: 'Acknowledge warning flag and request priority shipping options.'
  },
  {
    id: 'POL-003',
    vendor: 'CompSource Inc.',
    ruleName: 'Three-Quote Minimum Requisition',
    status: 'Pass',
    severity: 'Low',
    reason: 'Requisition has 3 competitive quotations saved.',
    recommendation: 'Ready to proceed.',
    explanation: 'Purchases exceeding $10,005 require comparison across a minimum of three independent quotes to ensure budget integrity.',
    resolution: 'Rule passed. No action needed.'
  },
  {
    id: 'POL-004',
    vendor: 'Office Depot',
    ruleName: 'Price Variance Check',
    status: 'Pass',
    severity: 'Low',
    reason: 'Bid price variance is within 10% range.',
    recommendation: 'Ready to proceed.',
    explanation: 'Ensures that individual vendor pricing remains aligned with department expectations and historical budget ceilings.',
    resolution: 'Rule passed. No action needed.'
  }
];

export const PolicyValidationPage: React.FC = () => {
  const { addAuditLog } = useProcurement();
  const { showToast } = useToast();

  const [activeRules, setActiveRules] = useState<PolicyRuleEval[]>(POLICY_RULES);
  const [selectedRuleId, setSelectedRuleId] = useState<string>('POL-001');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [signatureName, setSignatureName] = useState('');

  const currentRule = activeRules.find((r) => r.id === selectedRuleId) || activeRules[0];

  const handleOpenOverride = () => {
    if (currentRule.status !== 'Failed' && currentRule.status !== 'Warning') {
      showToast('Only failed or warning items require policy override signature.', 'info');
      return;
    }
    setShowOverrideModal(true);
  };

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason || !signatureName) {
      showToast('Please provide override rationale and signature.', 'warning');
      return;
    }

    // Update rule state to pass
    setActiveRules((prev) =>
      prev.map((r) => (r.id === selectedRuleId ? { ...r, status: 'Pass' } : r))
    );

    // Add Audit ledger entry
    addAuditLog({
      agent: `${signatureName} (Director Signature)`,
      action: 'Policy Override Signature',
      decision: `Override POL-${currentRule.id}`,
      reason: `Override rule "${currentRule.ruleName}" for ${currentRule.vendor}. Reason: ${overrideReason}`,
      status: 'Completed',
    });

    showToast(`Policy override granted for ${currentRule.vendor}.`, 'success');
    setShowOverrideModal(false);
    setOverrideReason('');
    setSignatureName('');
  };

  return (
    <div className="space-y-6 text-left relative">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Policy Validation Center</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time analysis of company procurement guidelines, budget ceilings, and regulatory criteria.
        </p>
      </div>

      {/* Main split dashboard panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        
        {/* LEFT PANEL - Table of Policy rules */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Active Policy Evaluations
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    <th className="p-4">Vendor</th>
                    <th className="p-4">Policy Rule</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  {activeRules.map((rule) => (
                    <tr
                      key={rule.id}
                      onClick={() => setSelectedRuleId(rule.id)}
                      className={cn(
                        'hover:bg-slate-50/50 dark:hover:bg-slate-800/15 cursor-pointer transition-colors',
                        selectedRuleId === rule.id ? 'bg-primary-50/10 dark:bg-primary-950/5' : ''
                      )}
                    >
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{rule.vendor.split(' ')[0]}</td>
                      <td className="p-4 font-medium max-w-[150px] truncate">{rule.ruleName}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            rule.status === 'Pass'
                              ? 'success'
                              : rule.status === 'Warning'
                              ? 'warning'
                              : 'error'
                          }
                          className="gap-1 items-center"
                        >
                          {rule.status === 'Pass' && <CheckCircle size={10} />}
                          {rule.status === 'Warning' && <AlertTriangle size={10} />}
                          {rule.status === 'Failed' && <XCircle size={10} />}
                          {rule.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            rule.severity === 'Critical'
                              ? 'critical'
                              : rule.severity === 'Medium'
                              ? 'warning'
                              : 'neutral'
                          }
                        >
                          {rule.severity}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <ChevronRight size={14} className={cn('text-slate-400 transition-transform', selectedRuleId === rule.id && 'translate-x-1 text-primary-650')} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-[10px] text-slate-400 leading-normal flex items-start gap-2">
            <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
            <p>
              Failed policies blocks ERP PO generation. A manager signature with valid override justification is required to override constraints.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - Policy Explanation & override options */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Rule ID: {currentRule.id}
              </span>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">
                {currentRule.ruleName}
              </h3>
            </div>

            <div className="space-y-4 text-xs font-normal">
              <div>
                <h4 className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase mb-1">Scope & Policy Explanation</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{currentRule.explanation}</p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider">Failed Parameter Context</h4>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{currentRule.reason}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase mb-1">Recommended Resolution</h4>
                <p className="text-slate-650 dark:text-slate-350 leading-relaxed">{currentRule.resolution}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            {currentRule.status === 'Pass' ? (
              <div className="p-3 bg-green-50/30 border border-green-200/50 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-green-750">
                <CheckCircle size={15} />
                Compliance Checked & Passed
              </div>
            ) : (
              <Button
                onClick={handleOpenOverride}
                className="w-full text-xs font-semibold py-2 gap-1.5"
              >
                <PenTool size={14} />
                Override Policy Signature
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* OVERRIDE DIALOG MODAL */}
      <AnimatePresence>
        {showOverrideModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOverrideModal(false)}
              className="fixed inset-0 z-40 bg-slate-950"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-md h-max bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-left"
            >
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Policy Override Signature
                  </h3>
                  <p className="text-[10px] text-slate-450 mt-0.5 leading-normal">
                    Enter justify remarks to override policy restriction for **{currentRule.vendor}**.
                  </p>
                </div>
                <button
                  onClick={() => setShowOverrideModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleApplyOverride} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                    Override Justification Remarks
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. SysLogistics Solutions is verified through offline logistics contract audit. Override unverified GSTIN flag to proceed."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>

                <Input
                  label="Manager Authorization Name (Signature)"
                  placeholder="e.g. Sarah Jenkins"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="text-xs font-mono"
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs py-1.5"
                    onClick={() => setShowOverrideModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="text-xs py-1.5 gap-1"
                  >
                    <PenTool size={13} />
                    Apply Override Signature
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
