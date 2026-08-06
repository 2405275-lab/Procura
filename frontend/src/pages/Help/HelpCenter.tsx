import {
  HelpCircle,
  BookOpen,
  Mail,
  FileText,
  UploadCloud,
  GitCompare,
  ShieldCheck
} from 'lucide-react';

export const HelpCenter: React.FC = () => {
  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Knowledge Base & Support</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Step-by-step guides, frequently asked questions, and help contacts for the Procura procurement suite.
        </p>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <BookOpen size={16} className="text-primary-650" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Getting Started Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
          {[
            { step: '1. Create Requisition', desc: 'Enter department budget, quantities, and timelines.', icon: FileText },
            { step: '2. Upload Proposals', desc: 'Drag-and-drop PDF invoices to run AI OCR extraction.', icon: UploadCloud },
            { step: '3. Compare Vendors', desc: 'Review pricing, warranties, and SLAs side-by-side.', icon: GitCompare },
            { step: '4. Validate & Sign', desc: 'Check policy criteria and sign override exceptions.', icon: ShieldCheck }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1.5 font-medium">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{item.step}</span>
              <p className="text-slate-650 dark:text-slate-450 leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <HelpCircle size={16} className="text-primary-650" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          {[
            { q: 'How does AI extract information from quotations?', a: 'Procura uses multi-modal OCR systems to capture invoice headers, table items, tax rates, and delivery details directly from raw PDF sheets or scanned images.' },
            { q: 'What happens when a policy fails verification?', a: 'Policy violations (e.g. invalid GST identification) flag red warnings. Direct PO syncing to ERPs is blocked until a manager grants an override signature with written justification.' },
            { q: 'How is data security managed?', a: 'Procura implements multi-factor login (MFA), role-based permissions, and cryptographically signs override audits to ensure transparency.' }
          ].map((faq, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="font-bold text-slate-850 dark:text-slate-250">{faq.q}</h4>
              <p className="text-slate-600 dark:text-slate-450 leading-relaxed font-normal">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Info */}
      <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 text-xs font-semibold">
        <div className="flex items-center gap-3">
          <Mail size={16} className="text-primary-650" />
          <div>
            <h4 className="text-slate-800 dark:text-slate-250">Need custom integrations?</h4>
            <p className="text-[10px] text-slate-450 font-normal">Contact our systems support team to sync Procura to SAP or Microsoft Dynamics.</p>
          </div>
        </div>
        <a href="mailto:support@procura.io" className="text-xs text-primary-600 hover:underline">
          support@procura.io
        </a>
      </div>

    </div>
  );
};
