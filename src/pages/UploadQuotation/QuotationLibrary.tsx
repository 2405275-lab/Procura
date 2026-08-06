import { useNavigate } from 'react-router-dom';
import { useProcurement } from '@/hooks/useProcurement';
import { useToast } from '@/components/common/Toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  DollarSign,
  Truck,
  ShieldCheck,
  Eye,
  Trash2,
  GitCompare,
  AlertCircle,
  Percent
} from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/utils/cn';

interface QuotationLibraryProps {
  filterRequestId?: string;
}

export const QuotationLibrary: React.FC<QuotationLibraryProps> = ({ filterRequestId }) => {
  const { quotations, deleteQuotation } = useProcurement();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const filteredQuotes = filterRequestId
    ? quotations.filter((q) => q.requestId === filterRequestId)
    : quotations;

  const handleDelete = (id: string, vendor: string) => {
    if (confirm(`Are you sure you want to delete quotation for ${vendor}?`)) {
      deleteQuotation(id);
      showToast(`Quotation from ${vendor} deleted successfully.`, 'warning');
    }
  };

  const handleCompare = () => {
    navigate('/vendor-comparison');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header controls for main library page */}
      {!filterRequestId && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quotation Library</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Browse and review all parsed supplier quotations saved in the Veridion system.
            </p>
          </div>
          {filteredQuotes.length >= 2 && (
            <Button
              className="text-xs gap-1.5 font-semibold py-2"
              onClick={handleCompare}
            >
              <GitCompare size={15} />
              Compare Saved Quotations
            </Button>
          )}
        </div>
      )}

      {filteredQuotes.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No Quotations Saved"
          description={
            filterRequestId
              ? `There are no quotations associated with request ${filterRequestId} yet.`
              : 'There are no parsed vendor quotations in the library.'
          }
          actionText="Upload New Quotation"
          onAction={() => navigate('/upload-quotations')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredQuotes.map((quote) => {
            const isHighConfidence = quote.confidence >= 90;
            const isMedConfidence = quote.confidence >= 70 && quote.confidence < 90;
            
            return (
              <div
                key={quote.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
              >
                {/* Visual confidence indicator line */}
                <div
                  className={cn('absolute left-0 top-0 bottom-0 w-1.5', {
                    'bg-green-500': isHighConfidence,
                    'bg-amber-500': isMedConfidence,
                    'bg-red-500': !isHighConfidence && !isMedConfidence,
                  })}
                />

                <div className="space-y-3 pl-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {quote.id} • {quote.quoteNumber}
                      </h4>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {quote.vendorName}
                      </h3>
                    </div>

                    <Badge
                      variant={
                        isHighConfidence
                          ? 'success'
                          : isMedConfidence
                          ? 'warning'
                          : 'error'
                      }
                      className="gap-0.5 text-[9px] px-1.5 py-0.5 font-bold"
                    >
                      <Percent size={8} />
                      {quote.confidence}% Conf.
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={14} className="text-slate-400" />
                      <div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase font-semibold">Total Cost</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {quote.currency === 'USD' ? '$' : '₹'}
                          {quote.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Truck size={14} className="text-slate-400" />
                      <div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase font-semibold">SLA Delivery</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{quote.deliveryDays} Days</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 col-span-2">
                      <ShieldCheck size={14} className="text-slate-400" />
                      <div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase font-semibold">Warranty Terms</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{quote.warranty}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/80 pl-2 mt-4">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">
                    Ref: {quote.requestId}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/quotations/${quote.id}/preview`)}
                      title="Split-Screen View"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-primary-600 transition-colors cursor-pointer"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(quote.id, quote.vendorName)}
                      title="Delete Quotation"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
