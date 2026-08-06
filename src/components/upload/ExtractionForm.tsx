import React, { useState, useEffect } from 'react';
import type { Quotation, QuotationItem } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Edit, RefreshCw, CheckCircle, Percent } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ExtractionFormProps {
  initialData: Quotation;
  onSave: (data: Quotation) => void;
  onCancel: () => void;
}

export const ExtractionForm: React.FC<ExtractionFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Quotation>(initialData);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof Quotation, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Determine confidence color class
  const confidenceColor = 
    formData.confidence >= 90 
      ? 'bg-green-500' 
      : formData.confidence >= 70 
      ? 'bg-amber-500' 
      : 'bg-red-500';

  const confidenceText = 
    formData.confidence >= 90 
      ? 'High' 
      : formData.confidence >= 70 
      ? 'Medium' 
      : 'Low';

  const confidenceBg = 
    formData.confidence >= 90 
      ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border-green-150' 
      : formData.confidence >= 70 
      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-150' 
      : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-150';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* AI Confidence Banner */}
      <div className={cn('p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm', confidenceBg)}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/80 dark:bg-slate-900 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">
            <Percent size={14} className="mr-0.5" />
            {formData.confidence}%
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">AI Extraction Confidence: {confidenceText}</h4>
            <p className="text-[10px] opacity-80 mt-0.5 leading-normal">
              High confidence rating based on layout matching and standard fields matching.
            </p>
          </div>
        </div>
        <div className="w-full sm:w-28 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex-shrink-0">
          <div className={cn('h-full', confidenceColor)} style={{ width: `${formData.confidence}%` }} />
        </div>
      </div>

      {/* AI Notes panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Agent Extraction Flags
        </h4>
        <div className="space-y-1.5">
          {formData.aiNotes.map((note, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editable Fields wrapper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
        {/* Vendor Details section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Vendor & Contact Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Vendor Company Name"
              value={formData.vendorName}
              disabled={!isEditable}
              onChange={(e) => handleChange('vendorName', e.target.value)}
            />
            <Input
              label="Quotation Number"
              value={formData.quoteNumber}
              disabled={!isEditable}
              onChange={(e) => handleChange('quoteNumber', e.target.value)}
            />
            <Input
              label="GST Number"
              value={formData.gstNumber}
              disabled={!isEditable}
              onChange={(e) => handleChange('gstNumber', e.target.value)}
            />
            <Input
              label="Contact Person"
              value={formData.contactName}
              disabled={!isEditable}
              onChange={(e) => handleChange('contactName', e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              disabled={!isEditable}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              disabled={!isEditable}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </div>

        {/* Commercial details section */}
        <div className="space-y-4 pt-6 border-t border-slate-150 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Pricing & Commercials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Quoted Price"
              type="number"
              value={formData.price}
              disabled={!isEditable}
              onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Currency</label>
              <select
                value={formData.currency}
                disabled={!isEditable}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <Input
              label="Tax Amount"
              type="number"
              value={formData.taxAmount}
              disabled={!isEditable}
              onChange={(e) => handleChange('taxAmount', parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Discount"
              type="number"
              value={formData.discount}
              disabled={!isEditable}
              onChange={(e) => handleChange('discount', parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Warranty Period"
              value={formData.warranty}
              disabled={!isEditable}
              onChange={(e) => handleChange('warranty', e.target.value)}
            />
            <Input
              label="Delivery SLA (Days)"
              type="number"
              value={formData.deliveryDays}
              disabled={!isEditable}
              onChange={(e) => handleChange('deliveryDays', parseInt(e.target.value) || 0)}
            />
            <Input
              label="Payment Terms"
              value={formData.paymentTerms}
              disabled={!isEditable}
              onChange={(e) => handleChange('paymentTerms', e.target.value)}
            />
            <Input
              label="Validity Period (Days)"
              type="number"
              value={formData.validityDays}
              disabled={!isEditable}
              onChange={(e) => handleChange('validityDays', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Item Information Table */}
        <div className="space-y-4 pt-6 border-t border-slate-150 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-semibold">
            Line Items
          </h3>
          <div className="border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/30 border-b border-slate-150 dark:border-slate-800 font-semibold text-slate-500">
                  <th className="p-3 w-1/3">Item Name</th>
                  <th className="p-3 w-1/6">Qty</th>
                  <th className="p-3 w-1/6">Unit Rate</th>
                  <th className="p-3">Specifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.name}
                        disabled={!isEditable}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none rounded text-xs font-medium"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.quantity}
                        disabled={!isEditable}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none rounded text-xs font-semibold"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        disabled={!isEditable}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none rounded text-xs font-semibold"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.specs}
                        disabled={!isEditable}
                        onChange={(e) => handleItemChange(index, 'specs', e.target.value)}
                        className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none rounded text-xs text-slate-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Button Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (confirm("Reset current edits? All un-saved corrections will be lost.")) {
              setFormData(initialData);
              setIsEditable(false);
            }
          }}
          className="text-xs font-semibold py-2 gap-1.5"
        >
          <RefreshCw size={13} />
          Re-run Extraction
        </Button>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="text-xs font-semibold py-2"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={isEditable ? 'secondary' : 'outline'}
            onClick={() => setIsEditable(!isEditable)}
            className="text-xs font-semibold py-2 gap-1.5"
          >
            <Edit size={13} />
            {isEditable ? 'Cancel Edit' : 'Edit Fields'}
          </Button>
          
          <Button
            type="submit"
            className="text-xs font-semibold py-2 gap-1.5"
          >
            <CheckCircle size={14} />
            Accept & Save Quote
          </Button>
        </div>
      </div>
    </form>
  );
};
