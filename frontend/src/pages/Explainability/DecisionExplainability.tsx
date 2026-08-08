import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/common/Toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Scale,
  Download,
  Eye,
  CheckCircle,
  Cpu
} from 'lucide-react';

export const DecisionExplainability: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleDownload = () => {
    showToast('Decision summary report downloaded.', 'success');
  };

  const WEIGHTS = [
    { name: 'Quoted Bid Price', weight: 40, detail: 'Prioritizes lower total pricing including tax and discounts.' },
    { name: 'SLA Delivery Days', weight: 20, detail: 'Shorter shipping schedules receive priority scaling.' },
    { name: 'Warranty Support Period', weight: 20, detail: 'Longer vendor coverage increments points.' },
    { name: 'Historical Vendor Rating', weight: 10, detail: 'Past purchase order fulfillment metrics.' },
    { name: 'Risk Assessment Score', weight: 10, detail: 'Absence of unresolved policy overrides.' }
  ];

  return (
    <div className="space-y-6 text-left max-w-5xl">
      
      {/* Top Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">AI Decision Explainability</h2>
            <Badge variant="success" className="gap-0.5 font-bold text-[9px] py-0">96% Conf.</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent breakdown of factors and weights that led to the recommended supplier selection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={() => navigate('/vendor-comparison')} className="text-xs font-semibold gap-1 py-1.5 cursor-pointer">
            <Eye size={13} />
            Raw Comparison
          </Button>
          <Button size="sm" onClick={handleDownload} className="text-xs font-semibold gap-1.5 py-1.5 cursor-pointer">
            <Download size={13} />
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* Flagship explanation split panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        
        {/* LEFT PANEL - Decision Tree Flow Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-primary-600" />
              <h3 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
                Interactive Decision Evaluation Tree
              </h3>
            </div>

            {/* Tree Flow Visualization */}
            <div className="space-y-4 relative pl-4 border-l-2 border-slate-150 dark:border-slate-800/80">
              
              {/* Node 1 */}
              <div className="relative space-y-1.5">
                <div className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full bg-primary-600 border-2 border-white dark:border-slate-900 shadow-sm" />
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Root Criterion</span>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl max-w-sm">
                  <h4 className="font-bold text-slate-800 dark:text-slate-250 text-xs">Total Requisitions Limit</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Check if total bid price is within department allocation ceiling ($184,500).</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="success" className="text-[8px] py-0">Passed</Badge>
                  </div>
                </div>
              </div>

              {/* Node 2 */}
              <div className="relative space-y-1.5">
                <div className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full bg-primary-600 border-2 border-white dark:border-slate-900 shadow-sm" />
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Compliance Scanner</span>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl max-w-sm">
                  <h4 className="font-bold text-slate-800 dark:text-slate-250 text-xs">Legal Credentials Verification</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Scan GSTIN status matching official registries.</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="success" className="text-[8px] py-0">CompSource Pass</Badge>
                    <Badge variant="error" className="text-[8px] py-0">SysLogistics Flagged</Badge>
                  </div>
                </div>
              </div>

              {/* Node 3 */}
              <div className="relative space-y-1.5">
                <div className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-slate-900 shadow-sm animate-pulse" />
                <span className="text-[9px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest block">Final Decision</span>
                <div className="p-3 bg-green-50/20 border border-green-200/50 rounded-xl max-w-sm">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Recommend CompSource Inc.</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Overall score: **94/100**. Best balance of metrics.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="text-[10px] text-slate-400 leading-normal flex items-start gap-1.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
            <CheckCircle size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
            <p>Every node can be audited against official regulatory rulebooks to verify AI compliance.</p>
          </div>
        </div>

        {/* RIGHT PANEL - Weighted scores criteria list */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <Scale size={16} className="text-primary-600" />
            <h3 className="text-xs font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
              Scoring Weights Allocation
            </h3>
          </div>

          <div className="space-y-4">
            {WEIGHTS.map((weight, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                  <span>{weight.name}</span>
                  <span>{weight.weight}%</span>
                </div>
                {/* Custom Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${weight.weight}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-normal">{weight.detail}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
