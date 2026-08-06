import { useState } from 'react';
import { useToast } from '@/components/common/Toast';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Trash2
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  category: 'Success' | 'Warning' | 'Info' | 'Critical';
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, title: 'AI Extraction Completed', desc: 'Quotation CS-2026-004 parsed from CompSource Inc. successfully.', category: 'Success', time: '10 mins ago', read: false },
  { id: 2, title: 'Compliance Policy Violation', desc: 'SysLogistics Solutions quote failed GSTIN checklist match.', category: 'Critical', time: '40 mins ago', read: false },
  { id: 3, title: 'Manager Approval Exception Override', desc: 'PR-2045 budget constraint overridden by Jenkins (Procurement Director).', category: 'Warning', time: '2 hours ago', read: false },
  { id: 4, title: 'Purchase Order Dispatched', desc: 'PO-2026-9043 synchronized to ERP node.', category: 'Success', time: '5 hours ago', read: true },
  { id: 5, title: 'System Maintenance Window', desc: 'Database nodes upgrade scheduled for Saturday at 03:00 GMT.', category: 'Info', time: '1 day ago', read: true }
];

export const NotificationsCenter: React.FC = () => {
  const { showToast } = useToast();

  const [notesList, setNotesList] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleMarkAllRead = () => {
    setNotesList((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'success');
  };

  const handleClearAll = () => {
    setNotesList([]);
    showToast('Notification queue cleared.', 'warning');
  };

  const handleToggleRead = (id: number) => {
    setNotesList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filteredNotes = notesList.filter((n) => {
    if (filterCategory === 'all') return true;
    return n.category.toLowerCase() === filterCategory.toLowerCase();
  });

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-50 dark:bg-primary-950/20 border border-primary-200/50 dark:border-primary-800/40 rounded-xl flex items-center justify-center text-primary-600">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Notifications Center</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live transactional updates logging compliance checks, OCR extractions, and manager signatures.
            </p>
          </div>
        </div>

        {notesList.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-slate-500 hover:text-primary-650 cursor-pointer"
            >
              Mark all as read
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-slate-500 hover:text-red-650 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={12} />
              Clear queue
            </button>
          </div>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-wrap gap-2">
        {['all', 'success', 'warning', 'info', 'critical'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer',
              filterCategory === cat
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications feed */}
      {filteredNotes.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 shadow-sm">
          No notifications in this inbox channel.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const isSuccess = note.category === 'Success';
            const isWarning = note.category === 'Warning';
            const isCritical = note.category === 'Critical';
            
            return (
              <div
                key={note.id}
                onClick={() => handleToggleRead(note.id)}
                className={cn(
                  'bg-white dark:bg-slate-900 border rounded-2xl p-4 flex gap-4 transition-all relative overflow-hidden cursor-pointer',
                  note.read ? 'opacity-70 border-slate-150 dark:border-slate-850' : 'border-slate-200 dark:border-slate-800 shadow-sm'
                )}
              >
                {/* Visual marker for unread */}
                {!note.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600" />
                )}

                {/* Category Icon */}
                <div className={cn(
                  'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                  isSuccess ? 'bg-green-50 dark:bg-green-950/20 text-green-600' :
                  isWarning ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' :
                  isCritical ? 'bg-red-50 dark:bg-red-950/20 text-red-650' : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600'
                )}>
                  {isSuccess && <CheckCircle2 size={16} />}
                  {isWarning && <AlertTriangle size={16} />}
                  {isCritical && <XCircle size={16} />}
                  {note.category === 'Info' && <Info size={16} />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{note.title}</h4>
                    <span className="text-[9px] text-slate-400 font-semibold">{note.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed font-normal">{note.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
