import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { RuleBlock } from '@/services/api';
import { useToast } from '@/components/common/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Sliders,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export const RuleBuilder: React.FC = () => {
  const { showToast } = useToast();

  const [rules, setRules] = useState<RuleBlock[]>([]);
  
  // Rule builder form fields
  const [field, setField] = useState('Price');
  const [operator, setOperator] = useState('>');
  const [value, setValue] = useState('');
  const [action, setAction] = useState('Require Finance Approval');

  useEffect(() => {
    api.getRules().then(setRules);
  }, []);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      showToast('Please specify a rule condition value.', 'warning');
      return;
    }

    const newRule: RuleBlock = {
      id: `RUL-${Math.floor(100 + Math.random() * 900)}`,
      field,
      operator,
      value: value.trim(),
      action
    };

    api.saveRule(newRule).then(() => {
      setRules((prev) => [...prev, newRule]);
      setValue('');
      showToast('New procurement policy rule registered successfully.', 'success');
    });
  };

  const handleDeleteRule = (id: string) => {
    api.deleteRule(id).then((success) => {
      if (success) {
        setRules((prev) => prev.filter((r) => r.id !== id));
        showToast('Rule removed from validation engine.', 'warning');
      }
    });
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Visual Procurement Rule Builder</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Establish automated validation triggers. Bids that violate these parameters will flag exceptions in the policy center.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* NEW RULE FORM BUILDER */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sliders size={16} className="text-primary-650" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Rule Definition
              </h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 dark:text-slate-350">If Field Target</label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-250 focus:outline-none"
              >
                <option value="Price">Quoted Price ($)</option>
                <option value="Warranty">Warranty Period</option>
                <option value="Delivery">Delivery SLA Days</option>
                <option value="GST Status">GST Verification</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 dark:text-slate-350">Logical Condition</label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-250 focus:outline-none"
              >
                <option value=">">Exceeds (&gt;)</option>
                <option value="<">Fails below (&lt;)</option>
                <option value="==">Equals (==)</option>
                <option value="!=">Does not equal (!=)</option>
              </select>
            </div>

            <Input
              label="Evaluation Target Value"
              placeholder="e.g. 100000 or 2 Years"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-xs"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 dark:text-slate-350">Trigger Consequence</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-250 focus:outline-none"
              >
                <option value="Require Finance Approval">Require Manager Approval</option>
                <option value="Flag Warning">Flag Warning Notification</option>
                <option value="Reject Vendor">Reject Bid Automatically</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Button
              onClick={handleCreateRule}
              className="w-full text-xs font-semibold gap-1 py-2 cursor-pointer"
            >
              <Plus size={14} />
              Register Policy Rule
            </Button>
          </div>
        </div>

        {/* ACTIVE RULES LIST TABLE */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Active Validation Engine Policies
              </h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {rules.map((rule) => (
                <div key={rule.id} className="p-4 flex items-center justify-between gap-4 text-xs font-semibold">
                  <div className="space-y-1 leading-normal">
                    <span className="text-[9px] font-bold text-primary-650 uppercase tracking-widest block">{rule.id}</span>
                    <p className="text-slate-750 dark:text-slate-200">
                      IF <strong className="text-slate-900 dark:text-white font-bold">{rule.field}</strong> {rule.operator} {rule.value}
                    </p>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      THEN {rule.action}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-red-650 transition-colors cursor-pointer"
                    title="Remove rule"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-[10px] text-slate-450 leading-normal flex items-start gap-1.5">
            <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p>Policy updates immediately apply to active quotation pipelines. Overriding rules requires director signatures.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
