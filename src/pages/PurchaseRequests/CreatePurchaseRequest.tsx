import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProcurement } from '@/hooks/useProcurement';
import { useToast } from '@/components/common/Toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, Plus } from 'lucide-react';

const requestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  department: z.string().min(1, 'Department is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  itemCategory: z.string().min(1, 'Item Category is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  budget: z.number().min(1, 'Estimated budget must be greater than 0'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  officer: z.string().min(1, 'Procurement officer is required'),
  approver: z.string().min(1, 'Approver is required'),
  notes: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export const CreatePurchaseRequest: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { requests, addRequest, editRequest } = useProcurement();
  const { showToast } = useToast();

  const isEditMode = !!id;
  const currentRequest = requests.find((r) => r.id === id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: '',
      department: 'Engineering',
      description: '',
      itemCategory: 'Hardware',
      quantity: 1,
      budget: 0,
      deliveryDate: '',
      priority: 'Medium',
      officer: 'Sarah Jenkins',
      approver: 'David Vance',
      notes: '',
    },
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (isEditMode && currentRequest) {
      setValue('title', currentRequest.title);
      setValue('department', currentRequest.department);
      setValue('description', currentRequest.description || '');
      setValue('itemCategory', currentRequest.itemCategory);
      setValue('quantity', currentRequest.quantity);
      setValue('budget', currentRequest.budget);
      setValue('deliveryDate', currentRequest.deliveryDate);
      setValue('priority', currentRequest.priority);
      setValue('officer', currentRequest.officer);
      setValue('approver', currentRequest.approver);
      setValue('notes', currentRequest.notes || '');
    }
  }, [isEditMode, currentRequest, setValue]);

  const onSubmit = async (data: RequestFormValues) => {
    try {
      if (isEditMode && id) {
        editRequest(id, data);
        showToast(`Purchase request ${id} updated successfully.`, 'success');
      } else {
        const newId = addRequest({
          ...data,
          requestedBy: 'Sarah Jenkins', // Mock currently signed in user
          status: 'Open',
          deadline: data.deliveryDate,
        });
        showToast(`Purchase request ${newId} created successfully.`, 'success');
      }
      navigate('/purchase-requests');
    } catch (err) {
      showToast('Error saving purchase request. Please try again.', 'error');
    }
  };

  const handleSaveDraft = () => {
    // Save as draft bypasses complete form validation
    const titleVal = (document.getElementById('title') as HTMLInputElement)?.value || 'Draft Request';
    const deptVal = (document.getElementById('department') as HTMLSelectElement)?.value || 'Procurement';
    
    if (isEditMode && id) {
      editRequest(id, { status: 'Draft' });
      showToast(`Purchase request ${id} set as Draft.`, 'info');
    } else {
      const newId = addRequest({
        title: titleVal,
        department: deptVal,
        description: 'Draft description',
        itemCategory: 'General',
        quantity: 1,
        budget: 0,
        deliveryDate: new Date().toISOString().split('T')[0],
        priority: 'Low',
        officer: 'Sarah Jenkins',
        approver: 'David Vance',
        notes: 'Saved as draft',
        requestedBy: 'Sarah Jenkins',
        status: 'Draft',
        deadline: new Date().toISOString().split('T')[0],
      });
      showToast(`Draft request ${newId} created successfully.`, 'info');
    }
    navigate('/purchase-requests');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/purchase-requests')}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {isEditMode ? `Edit Request ${id}` : 'Create Purchase Request'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fill in details to set up a new purchase requisition and assign procurement controls.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Basic Requisition Details
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="title"
              label="Request Title"
              placeholder="e.g. Dell Laptops Refresh"
              error={errors.title?.message}
              {...register('title')}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Initiating Department
              </label>
              <select
                id="department"
                {...register('department')}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Procurement">Procurement</option>
                <option value="Finance & HR">Finance & HR</option>
                <option value="Operations">Operations</option>
              </select>
              {errors.department && (
                <p className="text-xs text-red-500 font-medium">{errors.department.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              placeholder="Provide a detailed explanation of the purchase intent..."
              rows={3}
              {...register('description')}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-primary-500"
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Procurement Specific details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Procurement & Commercials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Item Category
              </label>
              <select
                {...register('itemCategory')}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary-500"
              >
                <option value="Hardware">Hardware</option>
                <option value="Software License">Software License</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Safety Equipment">Safety Equipment</option>
                <option value="Services">Services</option>
              </select>
            </div>

            <Input
              label="Quantity"
              type="number"
              error={errors.quantity?.message}
              {...register('quantity', { valueAsNumber: true })}
            />

            <Input
              label="Estimated Budget (USD)"
              type="number"
              error={errors.budget?.message}
              {...register('budget', { valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Required Delivery Date"
              type="date"
              error={errors.deliveryDate?.message}
              {...register('deliveryDate')}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Priority Requisition
              </label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignment and Additional notes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Controls & Ownership
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Procurement Officer Assigned"
              error={errors.officer?.message}
              {...register('officer')}
            />

            <Input
              label="Approving Director / Manager"
              error={errors.approver?.message}
              {...register('approver')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Additional Notes
            </label>
            <textarea
              placeholder="Any specific delivery instructions, supplier constraints, or override details..."
              rows={2}
              {...register('notes')}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="text-xs font-semibold py-2"
            onClick={() => navigate('/purchase-requests')}
          >
            Cancel
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="text-xs font-semibold py-2"
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              className="text-xs font-semibold py-2 gap-1.5"
              isLoading={isSubmitting}
            >
              {isEditMode ? <Save size={14} /> : <Plus size={14} />}
              {isEditMode ? 'Update Request' : 'Create Request'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
