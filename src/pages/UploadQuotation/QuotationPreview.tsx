import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProcurement } from '@/hooks/useProcurement';
import { useToast } from '@/components/common/Toast';
import { ExtractionForm } from '@/components/upload/ExtractionForm';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ZoomIn, ZoomOut, FileText, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export const QuotationPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quotations, updateQuotation } = useProcurement();
  const { showToast } = useToast();

  const [highlightField, setHighlightField] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  const quote = quotations.find((q) => q.id === id);

  if (!quote) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-left">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Quotation Not Found</h3>
        <p className="text-xs text-slate-500 mt-2">The quotation with ID {id} does not exist or was deleted.</p>
        <Button size="sm" className="mt-4" onClick={() => navigate('/purchase-requests')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleSave = (updatedQuote: typeof quote) => {
    updateQuotation(quote.id, updatedQuote);
    showToast(`Quotation for ${quote.vendorName} corrected and saved successfully.`, 'success');
    navigate(`/purchase-requests/${quote.requestId}`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Document Split-Screen Viewer</h2>
              <span className="text-slate-400 dark:text-slate-600 font-light">|</span>
              <span className="text-xs text-slate-500 font-semibold">{quote.fileName}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Review OCR bounding overlays on the original document sheet against parsed form inputs.
            </p>
          </div>
        </div>
      </div>

      {/* Split screen content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch min-h-[600px]">
        
        {/* LEFT PANEL: Original Document Viewer */}
        <div className="bg-slate-800 dark:bg-slate-950 rounded-2xl border border-slate-700/60 dark:border-slate-900 overflow-hidden flex flex-col justify-between shadow-2xl relative">
          
          {/* Viewer Header toolbar */}
          <div className="px-4 py-2 bg-slate-900 text-white flex justify-between items-center border-b border-slate-700/50">
            <div className="flex items-center gap-2 text-xs">
              <FileText size={14} className="text-slate-400" />
              <span className="font-semibold text-slate-300">Invoice_Preview.pdf ({zoom}%)</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="text-[10px] px-2 py-0.5 bg-slate-850 hover:bg-slate-800 rounded text-slate-300 transition-colors cursor-pointer"
              >
                Fit Width
              </button>
            </div>
          </div>

          {/* Document Content Canvas */}
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-900/60">
            <div
              style={{ transform: `scale(${zoom / 100})` }}
              className="w-[500px] bg-white text-slate-900 p-8 rounded shadow-2xl border border-slate-200 transition-transform duration-200 select-none relative font-sans scale-100"
            >
              
              {/* Highlight Overlay - Vendor Details */}
              <div
                onMouseEnter={() => setHighlightField('vendor')}
                onMouseLeave={() => setHighlightField(null)}
                className={cn(
                  'absolute top-8 left-8 right-8 h-16 border-2 border-transparent rounded cursor-pointer transition-all',
                  highlightField === 'vendor' ? 'border-yellow-500 bg-yellow-500/10' : 'hover:border-primary-500/40 hover:bg-primary-500/5'
                )}
              />

              {/* Highlight Overlay - Quote metadata */}
              <div
                onMouseEnter={() => setHighlightField('quote')}
                onMouseLeave={() => setHighlightField(null)}
                className={cn(
                  'absolute top-28 right-8 w-44 h-16 border-2 border-transparent rounded cursor-pointer transition-all',
                  highlightField === 'quote' ? 'border-yellow-500 bg-yellow-500/10' : 'hover:border-primary-500/40 hover:bg-primary-500/5'
                )}
              />

              {/* Highlight Overlay - Items Table */}
              <div
                onMouseEnter={() => setHighlightField('items')}
                onMouseLeave={() => setHighlightField(null)}
                className={cn(
                  'absolute bottom-32 left-8 right-8 h-24 border-2 border-transparent rounded cursor-pointer transition-all',
                  highlightField === 'items' ? 'border-yellow-500 bg-yellow-500/10' : 'hover:border-primary-500/40 hover:bg-primary-500/5'
                )}
              />

              {/* Highlight Overlay - Total details */}
              <div
                onMouseEnter={() => setHighlightField('total')}
                onMouseLeave={() => setHighlightField(null)}
                className={cn(
                  'absolute bottom-8 right-8 w-48 h-20 border-2 border-transparent rounded cursor-pointer transition-all',
                  highlightField === 'total' ? 'border-yellow-500 bg-yellow-500/10' : 'hover:border-primary-500/40 hover:bg-primary-500/5'
                )}
              />

              {/* Mock Invoice Structure */}
              <div className="space-y-6 text-left">
                {/* Invoice Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-bold text-slate-800 m-0">{quote.vendorName}</h1>
                    <p className="text-[10px] text-slate-400 mt-1">
                      124 Business Plaza, Tower A<br />
                      Bangalore, KA, 560001<br />
                      GSTIN: {quote.gstNumber || '29ABCDE1234F1Z5'}
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-slate-600 tracking-wider">QUOTATION</h2>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Quote #: {quote.quoteNumber}<br />
                      Date: {quote.quoteDate}<br />
                      Validity: {quote.validityDays} Days
                    </p>
                  </div>
                </div>

                {/* Billing details */}
                <div className="text-xs pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-500 mb-1">PREPARED FOR:</h4>
                  <p className="font-semibold text-slate-700">Veridion Procurement Inc.</p>
                  <p className="text-[10px] text-slate-400">Request reference: {quote.requestId}</p>
                </div>

                {/* Items Table */}
                <table className="w-full text-left text-xs border-collapse mt-4">
                  <thead>
                    <tr className="border-b border-slate-200 font-bold text-slate-500 text-[10px]">
                      <th className="pb-2 w-1/2">Item & Description</th>
                      <th className="pb-2 text-center w-1/12">Qty</th>
                      <th className="pb-2 text-right w-1/6">Rate</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.items.map((item, index) => (
                      <tr key={index} className="border-b border-slate-150 text-[10px]">
                        <td className="py-2">
                          <p className="font-semibold text-slate-700">{item.name}</p>
                          <p className="text-[9px] text-slate-400">{item.specs}</p>
                        </td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="py-2 text-right font-semibold">
                          ${(item.quantity * item.unitPrice).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Subtotals */}
                <div className="flex justify-end pt-4">
                  <div className="w-48 text-xs space-y-1.5 text-right font-medium">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal:</span>
                      <span className="text-slate-800">${(quote.price - quote.taxAmount + quote.discount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Discount:</span>
                      <span className="text-green-600">-${quote.discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Tax GST:</span>
                      <span className="text-slate-800">+${quote.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900 text-sm">
                      <span>Total Amount:</span>
                      <span>${quote.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer toolbar */}
          <div className="px-4 py-2.5 bg-slate-900/90 text-slate-400 text-[10px] flex justify-between items-center border-t border-slate-700/50">
            <span>Hover highlighted sections to match parsed form segments.</span>
            <span className="flex items-center gap-1 text-green-400">
              <Check size={11} /> Ready
            </span>
          </div>
        </div>

        {/* RIGHT PANEL: Extraction fields editor */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm overflow-y-auto max-h-[700px]">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Extracted Fields Validation
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Verify values parsed from the invoice before saving to the comparison database.
              </p>
            </div>
          </div>

          <ExtractionForm
            initialData={quote}
            onSave={handleSave}
            onCancel={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  );
};
