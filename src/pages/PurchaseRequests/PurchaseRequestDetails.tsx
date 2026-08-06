import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProcurement } from '@/hooks/useProcurement';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressStepper } from '@/components/procurement/ProgressStepper';
import { QuotationLibrary } from '@/pages/UploadQuotation/QuotationLibrary';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Upload,
  Layers,
  Scale,
  Signature,
  FileCheck
} from 'lucide-react';

export const PurchaseRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requests, setActiveRequest } = useProcurement();

  const currentRequest = requests.find((r) => r.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'quotations' | 'comparison' | 'approvals' | 'audit'>('overview');

  if (!currentRequest) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Requisition Not Found</h3>
        <p className="text-xs text-slate-500 mt-2">The purchase request ID {id} does not exist.</p>
        <Button size="sm" className="mt-4" onClick={() => navigate('/purchase-requests')}>
          Back to Requests
        </Button>
      </div>
    );
  }

  // Stepper Stage mapping based on Request Status
  let stepperStage = 'Purchase Request';
  if (currentRequest.status === 'Open') stepperStage = 'Upload Quotations';
  if (currentRequest.status === 'Under Review') stepperStage = 'AI Extraction';
  if (currentRequest.status === 'Approved') stepperStage = 'Approval';
  if (currentRequest.numQuotations >= 2 && currentRequest.status === 'Open') stepperStage = 'Vendor Comparison';

  return (
    <div className="space-y-6 text-left">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/purchase-requests')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{currentRequest.id}</h2>
              <span className="text-slate-400 dark:text-slate-600 font-light">|</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-sm">
                {currentRequest.title}
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-1.5">
              <Badge variant="neutral">{currentRequest.department}</Badge>
              <Badge
                variant={
                  currentRequest.priority === 'Critical'
                    ? 'critical'
                    : currentRequest.priority === 'High'
                    ? 'error'
                    : currentRequest.priority === 'Medium'
                    ? 'warning'
                    : 'neutral'
                }
              >
                {currentRequest.priority} Priority
              </Badge>
              <Badge
                variant={
                  currentRequest.status === 'Approved'
                    ? 'success'
                    : currentRequest.status === 'Under Review'
                    ? 'info'
                    : currentRequest.status === 'Rejected'
                    ? 'error'
                    : 'warning'
                }
              >
                {currentRequest.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold"
            onClick={() => {
              setActiveRequest(currentRequest);
              navigate(`/purchase-requests/${currentRequest.id}/edit`);
            }}
          >
            Edit Request
          </Button>
          <Button
            size="sm"
            className="text-xs font-semibold gap-1.5"
            onClick={() => {
              setActiveRequest(currentRequest);
              navigate('/upload-quotations');
            }}
          >
            <Upload size={14} />
            Upload Quotation
          </Button>
        </div>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper currentStage={stepperStage} />

      {/* Detail statistics card strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center gap-3.5 shadow-sm">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
            <DollarSign size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Estimated Budget</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">${currentRequest.budget.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center gap-3.5 shadow-sm">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
            <Calendar size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Deadline Date</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{currentRequest.deadline}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center gap-3.5 shadow-sm">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
            <User size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Requisition Officer</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{currentRequest.officer}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center gap-3.5 shadow-sm">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
            <Layers size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Quotations Saved</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{currentRequest.numQuotations} Quotes</h4>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-2">
        {(['overview', 'quotations', 'comparison', 'approvals', 'audit'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overview Left column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Requisition Description
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {currentRequest.notes || 'No description provided.'}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Item Requirements
                </h3>
                <div className="border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-150 dark:border-slate-800">
                        <th className="p-3 font-semibold text-slate-500">Category</th>
                        <th className="p-3 font-semibold text-slate-500">Quantity Needed</th>
                        <th className="p-3 font-semibold text-slate-500">Target Delivery</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{currentRequest.itemCategory}</td>
                        <td className="p-3 font-bold">{currentRequest.quantity} units</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{currentRequest.deliveryDate}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Overview Right column (Approvals, Policy compliance summary) */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Approval Status Path
                </h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Requisition Initiator:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{currentRequest.requestedBy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Assigned Approver:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{currentRequest.approver}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Signature Status:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">Pending Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quotations' && (
          <div>
            <QuotationLibrary filterRequestId={currentRequest.id} />
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <div className="max-w-md mx-auto space-y-3">
              <Scale size={24} className="mx-auto text-primary-600 dark:text-primary-400" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Vendor Comparison Matrix</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Compare quotation prices, warranties, and delivery rates. Upload at least 2 quotations under the **Quotations** tab to unlock comparisons.
              </p>
              <div className="pt-2">
                <Button size="sm" className="text-xs" onClick={() => setActiveTab('quotations')}>
                  Manage Quotations
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <div className="max-w-md mx-auto space-y-3">
              <Signature size={24} className="mx-auto text-primary-600 dark:text-primary-400" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Director Signatures</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Approval sequences run following vendor selection and contract matches. Verify vendor details before signature launch.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <div className="max-w-md mx-auto space-y-3">
              <FileCheck size={24} className="mx-auto text-primary-600 dark:text-primary-400" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Audit Ledger Trail</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Trace cryptographic audits, rule evaluations, and manual overrides logs. Ledger updates automatically with every change.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
