import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PlusCircle, Eye, X, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface PurchaseOrderData {
  poNumber: string;
  vendor: string;
  amount: string;
  deliveryStatus: 'In Transit' | 'Delivered' | 'Pending' | 'Shipped' | 'Cancelled';
  billingStatus: 'Pending Invoice' | 'Paid' | 'Processing' | 'Unpaid';
  erpSync: string;
  date: string; // YYYY-MM-DD
  items: Array<{ name: string; qty: number; unitPrice: string; subtotal: string }>;
}

const MOCK_PURCHASE_ORDERS: PurchaseOrderData[] = [
  {
    poNumber: 'PO-2026-9043',
    vendor: 'CompSource Inc.',
    amount: '$62,500',
    deliveryStatus: 'In Transit',
    billingStatus: 'Pending Invoice',
    erpSync: 'Synced (SAP)',
    date: '2026-08-08',
    items: [
      { name: 'ThinkPad L14 Gen 4 Laptops', qty: 50, unitPrice: '$1,000', subtotal: '$50,000' },
      { name: 'Premier Corporate Support Pack', qty: 1, unitPrice: '$12,500', subtotal: '$12,500' }
    ]
  },
  {
    poNumber: 'PO-2026-9039',
    vendor: 'Staples Corporate',
    amount: '$3,420',
    deliveryStatus: 'Delivered',
    billingStatus: 'Paid',
    erpSync: 'Synced (SAP)',
    date: '2026-08-07',
    items: [
      { name: 'Ergonomic Mesh Office Chairs', qty: 10, unitPrice: '$250', subtotal: '$2,500' },
      { name: 'Heavy Duty Document Shredder', qty: 2, unitPrice: '$460', subtotal: '$920' }
    ]
  },
  {
    poNumber: 'PO-2026-9045',
    vendor: 'GlobalTech Logistics',
    amount: '$14,900',
    deliveryStatus: 'Shipped',
    billingStatus: 'Processing',
    erpSync: 'Synced (Oracle)',
    date: '2026-08-08',
    items: [
      { name: 'Premium Cloud Storage (12mo)', qty: 1, unitPrice: '$9,800', subtotal: '$9,800' },
      { name: 'Database Replication License', qty: 3, unitPrice: '$1,700', subtotal: '$5,100' }
    ]
  },
  {
    poNumber: 'PO-2026-9046',
    vendor: 'Office Depot',
    amount: '$2,850',
    deliveryStatus: 'Delivered',
    billingStatus: 'Paid',
    erpSync: 'Synced (SAP)',
    date: '2026-08-06',
    items: [
      { name: 'High-Volume A4 Laser Paper Reams', qty: 100, unitPrice: '$15', subtotal: '$1,500' },
      { name: 'Replacement Toner Cartridges (CMYK)', qty: 5, unitPrice: '$270', subtotal: '$1,350' }
    ]
  },
  {
    poNumber: 'PO-2026-9047',
    vendor: 'SysLogistics Solutions',
    amount: '$18,450',
    deliveryStatus: 'Pending',
    billingStatus: 'Pending Invoice',
    erpSync: 'Synced (SAP)',
    date: '2026-08-05',
    items: [
      { name: 'Third-Party Logistics Integration SLA', qty: 1, unitPrice: '$18,450', subtotal: '$18,450' }
    ]
  },
  {
    poNumber: 'PO-2026-9048',
    vendor: 'CompSource Inc.',
    amount: '$12,000',
    deliveryStatus: 'Delivered',
    billingStatus: 'Paid',
    erpSync: 'Synced (SAP)',
    date: '2026-08-07',
    items: [
      { name: 'Dual 27-inch 4K IPS Workstation Monitors', qty: 24, unitPrice: '$500', subtotal: '$12,000' }
    ]
  }
];

export const PurchaseOrders: React.FC = () => {
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('All');
  const [activeDetailsPO, setActiveDetailsPO] = useState<PurchaseOrderData | null>(null);

  const filteredPOs = selectedDateFilter === 'All'
    ? MOCK_PURCHASE_ORDERS
    : MOCK_PURCHASE_ORDERS.filter(po => po.date === selectedDateFilter);

  return (
    <div className="space-y-6 text-left relative">
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
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Enterprise Purchase Orders (ERP Sync)
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
              Filter by Date:
            </span>
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:border-primary-500 font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Dates</option>
              <option value="2026-08-08">Today (Aug 8, 2026)</option>
              <option value="2026-08-07">Yesterday (Aug 7, 2026)</option>
              <option value="2026-08-06">Aug 6, 2026</option>
              <option value="2026-08-05">Aug 5, 2026</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80">
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">PO Number</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Vendor</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Delivery Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Billing Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">ERP Sync</th>
                <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                    No purchase orders found on the selected date.
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => (
                  <tr key={po.poNumber} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{po.poNumber}</td>
                    <td className="p-4 font-semibold text-slate-500">{po.date}</td>
                    <td className="p-4">{po.vendor}</td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{po.amount}</td>
                    <td className="p-4">
                      <Badge variant={po.deliveryStatus === 'Delivered' ? 'success' : po.deliveryStatus === 'In Transit' || po.deliveryStatus === 'Shipped' ? 'warning' : 'neutral'}>
                        {po.deliveryStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={po.billingStatus === 'Paid' ? 'success' : po.billingStatus === 'Pending Invoice' ? 'neutral' : 'warning'}>
                        {po.billingStatus}
                      </Badge>
                    </td>
                    <td className="p-4 text-green-600 font-semibold">{po.erpSync}</td>
                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveDetailsPO(po)}
                        className="text-[10px] py-1 px-2.5 gap-1 cursor-pointer"
                      >
                        <Eye size={12} /> View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DATE-WISE PURCHASE ORDER DETAILS POPUP MODAL */}
      <AnimatePresence>
        {activeDetailsPO && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDetailsPO(null)}
              className="fixed inset-0 z-40 bg-slate-950"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-xl h-max bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-left"
            >
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                    SAP ERP Transaction Log
                  </span>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-0.5">
                    Order Details: {activeDetailsPO.poNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveDetailsPO(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-4 text-xs font-normal">
                {/* Meta details list */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 dark:border-slate-850">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Purchase Date</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{activeDetailsPO.date}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Total Amount</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{activeDetailsPO.amount}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Delivery</span>
                    <Badge variant={activeDetailsPO.deliveryStatus === 'Delivered' ? 'success' : 'warning'} className="mt-0.5">
                      {activeDetailsPO.deliveryStatus}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Billing Status</span>
                    <Badge variant={activeDetailsPO.billingStatus === 'Paid' ? 'success' : 'neutral'} className="mt-0.5">
                      {activeDetailsPO.billingStatus}
                    </Badge>
                  </div>
                </div>

                {/* Itemized breakdown table */}
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">
                    Itemized Order Manifest
                  </span>
                  <div className="border border-slate-150 dark:border-slate-850 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 text-slate-500 font-semibold">
                          <th className="p-3">Item Description</th>
                          <th className="p-3 text-center">Qty</th>
                          <th className="p-3 text-right">Unit Price</th>
                          <th className="p-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {activeDetailsPO.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/5">
                            <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{item.name}</td>
                            <td className="p-3 text-center font-medium text-slate-600 dark:text-slate-400">{item.qty}</td>
                            <td className="p-3 text-right font-medium text-slate-600 dark:text-slate-400">{item.unitPrice}</td>
                            <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100">{item.subtotal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-150 dark:border-slate-850 rounded-xl flex gap-2 items-start text-[10px] text-slate-450 leading-relaxed font-normal">
                  <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                  <p>
                    This purchase order was authorized under corporate policy rules and synchronized with {activeDetailsPO.erpSync} databases.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-150 dark:border-slate-850">
                <Button
                  onClick={() => setActiveDetailsPO(null)}
                  size="sm"
                  className="text-xs py-1.5"
                >
                  Close Details
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
