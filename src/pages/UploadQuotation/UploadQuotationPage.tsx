import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProcurement } from '@/hooks/useProcurement';
import { useToast } from '@/components/common/Toast';
import { ProgressStepper } from '@/components/procurement/ProgressStepper';
import { AIProgressTimeline } from '@/components/upload/AIProgressTimeline';
import { ExtractionForm } from '@/components/upload/ExtractionForm';
import { EmptyState } from '@/components/common/EmptyState';
import { MOCK_EXTRACTION_TEMPLATES } from '@/mock/mockData';
import type { Quotation } from '@/types';
import { Button } from '@/components/ui/Button';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileCheck,
  Sparkles,
  Link2
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface UploadQueueItem {
  id: string;
  name: string;
  size: string;
  status: 'completed' | 'processing' | 'waiting';
  progress: number;
  templateKey: string;
}

export const UploadQuotationPage: React.FC = () => {
  const { requests, activeRequest, setActiveRequest, addQuotation } = useProcurement();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [dragActive, setDragActive] = useState(false);
  const [queue, setQueue] = useState<UploadQueueItem[]>([
    { id: '1', name: 'OfficeDepot-Quotation-908.pdf', size: '2.4 MB', status: 'completed', progress: 100, templateKey: 'default' },
    { id: '2', name: 'Staples-Office-Supplies-Q4.pdf', size: '1.8 MB', status: 'completed', progress: 100, templateKey: 'staples' },
  ]);

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
  // AI extraction state
  const [timelineStep, setTimelineStep] = useState(0);
  const [isTimelineRunning, setIsTimelineRunning] = useState(false);
  const timelineIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set the first completed file as default selected
  useEffect(() => {
    const firstCompleted = queue.find((item) => item.status === 'completed');
    if (firstCompleted && !selectedFileId) {
      setSelectedFileId(firstCompleted.id);
    }
  }, [queue, selectedFileId]);

  // Handle step updates during simulation
  useEffect(() => {
    if (isTimelineRunning) {
      timelineIntervalRef.current = setInterval(() => {
        setTimelineStep((prev) => {
          if (prev >= 4) {
            clearInterval(timelineIntervalRef.current!);
            setIsTimelineRunning(false);
            
            // Mark selected file as completed
            setQueue((prevQueue) =>
              prevQueue.map((item) =>
                item.status === 'processing' ? { ...item, status: 'completed', progress: 100 } : item
              )
            );
            showToast('AI document parsing completed successfully!', 'success');
            return 5;
          }
          return prev + 1;
        });
      }, 600);
    }

    return () => {
      if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
    };
  }, [isTimelineRunning]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!activeRequest) {
      showToast('Please select or create an active Purchase Request first.', 'warning');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleNewFile(file);
    }
  };

  const handleNewFile = (file: File) => {
    const id = Math.random().toString(36).substring(2, 9);
    const size = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const isStaples = file.name.toLowerCase().includes('staples');
    const templateKey = isStaples ? 'staples' : 'default';

    const newItem: UploadQueueItem = {
      id,
      name: file.name,
      size,
      status: 'processing',
      progress: 40,
      templateKey,
    };

    // If another is processing, queue it as waiting
    const hasActiveProcessing = queue.some((item) => item.status === 'processing');
    if (hasActiveProcessing) {
      newItem.status = 'waiting';
      newItem.progress = 0;
    }

    setQueue((prev) => [...prev, newItem]);
    setSelectedFileId(id);

    if (!hasActiveProcessing) {
      startSimulatedExtraction();
    }
  };

  const startSimulatedExtraction = () => {
    setTimelineStep(0);
    setIsTimelineRunning(true);
  };

  const handleSelectFile = (id: string) => {
    const item = queue.find((f) => f.id === id);
    if (!item) return;

    setSelectedFileId(id);
    if (item.status === 'processing') {
      startSimulatedExtraction();
    } else if (item.status === 'waiting') {
      // Transition from waiting to processing
      setQueue((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'processing', progress: 40 } : f))
      );
      startSimulatedExtraction();
    }
  };

  const removeQueueItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
    if (selectedFileId === id) {
      setSelectedFileId(null);
    }
    showToast('File removed from queue.', 'info');
  };

  // Get active quotation data loaded for the form
  const selectedItem = queue.find((item) => item.id === selectedFileId);
  
  const getSelectedQuotationData = (): Quotation | null => {
    if (!selectedItem || selectedItem.status !== 'completed') return null;
    
    const template = MOCK_EXTRACTION_TEMPLATES[selectedItem.templateKey] || MOCK_EXTRACTION_TEMPLATES.default;
    return {
      id: `QT-${Math.floor(9000 + Math.random() * 1000)}`,
      requestId: activeRequest?.id || 'PR-2041',
      vendorName: template.vendorName || 'ABC Technologies',
      quoteNumber: template.quoteNumber || 'QT-001',
      quoteDate: template.quoteDate || '',
      gstNumber: template.gstNumber || '',
      contactName: template.contactName || '',
      email: template.email || '',
      phone: template.phone || '',
      price: template.price || 0,
      currency: template.currency || 'USD',
      taxAmount: template.taxAmount || 0,
      discount: template.discount || 0,
      warranty: template.warranty || '3 Years',
      deliveryDays: template.deliveryDays || 5,
      paymentTerms: template.paymentTerms || '',
      validityDays: template.validityDays || 30,
      confidence: template.confidence || 95,
      confidenceLevel: template.confidenceLevel || 'High',
      aiNotes: template.aiNotes || [],
      status: 'Ready',
      fileName: selectedItem.name,
      fileSize: selectedItem.size,
      items: template.items || [],
    };
  };

  const handleSaveQuotation = (quote: Quotation) => {
    addQuotation(quote);
    showToast(`Quotation from ${quote.vendorName} saved to request ${quote.requestId}!`, 'success');
    
    // Remove from queue or update status
    setQueue((prev) => prev.filter((item) => item.id !== selectedFileId));
    setSelectedFileId(null);
    
    // Navigate to request detail quotations tab
    if (activeRequest) {
      navigate(`/purchase-requests/${activeRequest.id}`);
    }
  };

  const activeQuotationData = getSelectedQuotationData();

  return (
    <div className="space-y-6 text-left">
      {/* Header Requisition Link Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Intelligent Quotation Extractor</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload vendor quotation sheets and let AI agents parse values into structured databases automatically.
          </p>
        </div>

        {/* Requisition selector */}
        <div className="flex items-center gap-2">
          <Link2 size={15} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Associate Request:</span>
          <select
            value={activeRequest?.id || ''}
            onChange={(e) => {
              const req = requests.find((r) => r.id === e.target.value);
              setActiveRequest(req || null);
            }}
            className="px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="">-- Select Active Request --</option>
            {requests.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} - {r.title.substring(0, 25)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stepper progress tracker */}
      <ProgressStepper currentStage="Upload Quotations" />

      {/* Split panel setup */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* LEFT PANEL - Drag-drop & upload queue */}
        <div className="lg:col-span-2 space-y-5">
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all bg-white dark:bg-slate-900',
              dragActive ? 'border-primary-500 bg-primary-50/10' : 'border-slate-200 dark:border-slate-800'
            )}
          >
            <UploadCloud size={28} className="text-primary-600 dark:text-primary-400 mb-3" />
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Drag & Drop files here
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[200px] leading-normal">
              Supports PDF, PNG, JPG, or JPEG up to 10MB per file.
            </p>
            <div className="mt-4">
              <input
                type="file"
                id="file-input"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleNewFile(e.target.files[0]);
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => document.getElementById('file-input')?.click()}
                className="text-xs font-semibold py-1.5 px-3"
              >
                Browse Files
              </Button>
            </div>
          </div>

          {/* Upload Queue */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
              Document Queue ({queue.length})
            </h3>
            
            {queue.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                Queue is empty. Drop files to begin.
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectFile(item.id)}
                    className={cn(
                      'p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer',
                      selectedFileId === item.id
                        ? 'border-primary-500 bg-primary-50/10 dark:bg-primary-950/5'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/10'
                    )}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText size={16} className={selectedFileId === item.id ? 'text-primary-600' : 'text-slate-400'} />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px] sm:max-w-[200px]">
                          {item.name}
                        </h4>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === 'processing' && (
                        <div className="flex items-center gap-1.5 text-[9px] bg-amber-50 text-amber-600 font-bold px-1.5 py-0.5 rounded border border-amber-100">
                          <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                          Extracting
                        </div>
                      )}
                      {item.status === 'waiting' && (
                        <div className="text-[9px] bg-slate-50 text-slate-500 font-bold px-1.5 py-0.5 rounded border border-slate-100">
                          Waiting
                        </div>
                      )}
                      {item.status === 'completed' && (
                        <div className="flex items-center gap-1 text-[9px] bg-green-50 text-green-600 font-bold px-1.5 py-0.5 rounded border border-green-100">
                          <CheckCircle size={10} />
                          Ready
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeQueueItem(item.id);
                        }}
                        className="text-slate-400 hover:text-red-500 p-0.5 hover:bg-slate-100 rounded transition-colors"
                      >
                        <XCircle size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Extraction details */}
        <div className="lg:col-span-3">
          {!selectedItem ? (
            <EmptyState
              icon={UploadCloud}
              title="No Document Selected"
              description="Please upload or select an item from the left queue panel to view the parsed AI extraction report."
            />
          ) : selectedItem.status === 'processing' || isTimelineRunning ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles size={16} className="text-amber-500" />
                    AI Agent Processing Document
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Analyzing page layouts, checking tabular line items, and validating tax data.
                  </p>
                </div>
              </div>
              <AIProgressTimeline currentStep={timelineStep} />
            </div>
          ) : selectedItem.status === 'waiting' ? (
            <EmptyState
              icon={Clock}
              title="Quotation Waiting in Queue"
              description="Click 'Begin Extraction' to launch the AI optical character recognition agent on this document."
              actionText="Begin Extraction"
              onAction={() => handleSelectFile(selectedItem.id)}
            />
          ) : activeQuotationData ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl shadow-sm">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Parsed Document Preview
                  </h3>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{selectedItem.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold gap-1"
                  onClick={() => navigate(`/quotations/${selectedFileId}/preview`)}
                >
                  <FileCheck size={13} />
                  Open Split View
                </Button>
              </div>
              
              <ExtractionForm
                initialData={activeQuotationData}
                onSave={handleSaveQuotation}
                onCancel={() => setSelectedFileId(null)}
              />
            </div>
          ) : (
            <EmptyState
              icon={AlertCircle}
              title="Extraction Template Error"
              description="There was a problem loading the mock extraction parameters for this file."
            />
          )}
        </div>
      </div>
    </div>
  );
};
