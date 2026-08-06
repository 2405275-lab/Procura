import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PlusCircle, Eye } from 'lucide-react';

export const PurchaseOrders: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Purchase Orders</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track generated purchase orders, vendor dispatch updates, and billing statuses.
          </p>
        </div>
        <Button className="text-xs gap-1.5 font-semibold py-2">
          <PlusCircle size={15} />
          Create Custom PO
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Enterprise Purchase Orders (ERP Sync)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80">
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">PO Number</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Vendor</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Delivery Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Billing Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">ERP Sync</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              <tr>
                <td className="p-4 font-bold text-slate-800 dark:text-slate-200">PO-2026-9043</td>
                <td className="p-4">CompSource Inc.</td>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">$62,500</td>
                <td className="p-4">
                  <Badge variant="warning">In Transit</Badge>
                </td>
                <td className="p-4">
                  <Badge variant="neutral">Pending Invoice</Badge>
                </td>
                <td className="p-4 text-green-600 font-semibold">Synced (SAP)</td>
                <td className="p-4">
                  <Button variant="outline" size="sm" className="text-[10px] py-1 px-2.5 gap-1">
                    <Eye size={12} /> View Details
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-800 dark:text-slate-200">PO-2026-9039</td>
                <td className="p-4">Staples Corporate</td>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">$3,420</td>
                <td className="p-4">
                  <Badge variant="success">Delivered</Badge>
                </td>
                <td className="p-4">
                  <Badge variant="success">Paid</Badge>
                </td>
                <td className="p-4 text-green-600 font-semibold">Synced (SAP)</td>
                <td className="p-4">
                  <Button variant="outline" size="sm" className="text-[10px] py-1 px-2.5 gap-1">
                    <Eye size={12} /> View Details
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
