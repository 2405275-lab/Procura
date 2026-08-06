import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProcurement } from '@/hooks/useProcurement';
import { useToast } from '@/components/common/Toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  XCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  X
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const ApprovalWorkspace: React.FC = () => {
  const { requests, activeRequest, editRequest, addAuditLog } = useProcurement();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [notes, setNotes] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Revision' | null>(null);

  const currentRequest = activeRequest || requests.find((r) => r.status === 'Open') || requests[0];

  // Static recommended vendor details for approval summary
  const selectedVendor = {
    name: 'CompSource Inc.',
    amount: 62500,
    budget: currentRequest.budget,
    score: 94,
    risk: 'Low',
    savings: 2400,
    policyStatus: 'Pass'
  };

  const handleAction = (type: 'Approve' | 'Reject' | 'Revision') => {
    setActionType(type);
    setShowConfirmModal(true);
  };

  const handleConfirmDecision = () => {
    if (!actionType) return;

    let targetStatus: any = 'Approved';
    let actionLog = 'Approve Purchase Request';
    let statusText = 'Approved successfully';

    if (actionType === 'Reject') {
      targetStatus = 'Rejected';
      actionLog = 'Reject Purchase Request';
      statusText = 'Rejected successfully';
    } else if (actionType === 'Revision') {
      targetStatus = 'Draft';
      actionLog = 'Request Requisition Revision';
      statusText = 'Revision requested';
    }

    // Update status in hook state
    editRequest(currentRequest.id, {
      status: targetStatus,
      notes: notes || currentRequest.notes
    });

    // Add Audit Log
    addAuditLog({
      agent: 'Sarah Jenkins (Procurement Director)',
      action: actionLog,
      decision: `${currentRequest.id} ${targetStatus}`,
      reason: notes || `Manager action executed. Recommendation score was ${selectedVendor.score}%, risk level is ${selectedVendor.risk}.`,
      status: 'Completed',
      requestId: currentRequest.id,
      vendor: selectedVendor.name
    });

    showToast(`Purchase request ${currentRequest.id} ${statusText}.`, 'success');
    setShowConfirmModal(false);
    navigate('/purchase-requests');
  };

  // 6-Stage Timeline tracking
  const TIMELINE_STAGES = [
    { label: 'Quotation Uploaded', status: 'done' },
    { label: 'Extraction Complete', status: 'done' },
    { label: 'Vendor Compared', status: 'done' },
    { label: 'Policy Validated', status: 'done' },
    { label: 'Manager Approval', status: 'active' },
    { label: 'Purchase Order', status: 'todo' }
  ];

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Manager Approval Workspace</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Execute final manager sign-off or return requisitions for revision based on compliance scans.
        </p>
      </div>

      {/* Decision Summary block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Selected Bidder</span>
            <span className="text-base font-extrabold text-slate-850 dark:text-slate-100 block">{selectedVendor.name}</span>
            <Badge variant="success" className="text-[9px] font-bold py-0">{selectedVendor.score}% AI Score</Badge>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Bid Cost vs Budget</span>
            <span className="text-base font-extrabold text-slate-850 dark:text-slate-100 block">
              ${selectedVendor.amount.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block">Ceiling: ${selectedVendor.budget.toLocaleString()}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">SLA Estimated Savings</span>
            <span className="text-base font-extrabold text-green-600 dark:text-green-400 block">
              +${selectedVendor.savings.toLocaleString()}
            </span>
            <span className="text-[9px] text-green-700 bg-green-50 dark:bg-green-950/20 px-1 py-0.5 rounded font-bold">Best Price Saving</span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Approval Deadline</span>
            <span className="text-base font-extrabold text-slate-850 dark:text-slate-100 block">2026-08-15</span>
            <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
              <Clock size={11} /> 10 Days remaining
            </span>
          </div>

        </div>
      </div>

      {/* Decision Progress timeline workflow */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          Procurement Pipeline stages
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-4">
          {TIMELINE_STAGES.map((stage, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2">
                <div className={cn(
                  'h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black',
                  stage.status === 'done' ? 'bg-green-100 dark:bg-green-950/30 text-green-600' : 
                  stage.status === 'active' ? 'bg-primary-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                )}>
                  {stage.status === 'done' ? '✓' : idx + 1}
                </div>
                <span className={cn(
                  'text-xs font-semibold',
                  stage.status === 'done' ? 'text-slate-800 dark:text-slate-200' :
                  stage.status === 'active' ? 'text-primary-600 font-bold' : 'text-slate-400'
                )}>{stage.label}</span>
              </div>
              {idx < TIMELINE_STAGES.length - 1 && (
                <ArrowRight size={13} className="hidden sm:block text-slate-300" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Signing interface notes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
            Reviewer Decision Notes (Signed to PO)
          </label>
          <textarea
            rows={5}
            placeholder="e.g. Quotation values validated against original sheets. Recommending CompSource Inc. as the top candidate. Audit logs are complete without policy exceptions."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="flex flex-wrap gap-3.5 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('Revision')}
            className="text-xs font-semibold gap-1 py-2 cursor-pointer"
          >
            <RotateCcw size={14} />
            Request Revision
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('Reject')}
            className="text-xs font-semibold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900 gap-1 py-2 cursor-pointer"
          >
            <XCircle size={14} />
            Reject Purchase
          </Button>
          <Button
            size="sm"
            onClick={() => handleAction('Approve')}
            className="text-xs font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/10 gap-1 py-2 cursor-pointer"
          >
            <CheckCircle size={14} />
            Approve Purchase
          </Button>
        </div>
      </div>

      {/* DECISION CONFIRMATION DIALOG MODAL */}
      <AnimatePresence>
        {showConfirmModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="fixed inset-0 z-40 bg-slate-950"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-md h-max bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-left"
            >
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Confirm Approval Decision
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Verify values before finalizing transaction signature.
                  </p>
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Vendor</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedVendor.name}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Amount</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">${selectedVendor.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Ceiling Limit</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">${selectedVendor.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Compliance</span>
                    <p className="font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle size={10} /> Passed
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/30 border border-amber-250/50 rounded-xl flex items-start gap-2.5 text-amber-800 leading-normal text-[10px]">
                  <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Final Warning:</strong> This transaction will update status to `{actionType}d` and trigger downstream automated ERP synchronization. This action is auditable.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirmDecision}
                  className={cn(
                    'text-xs font-semibold py-1.5',
                    actionType === 'Reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600'
                  )}
                >
                  Confirm {actionType}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
