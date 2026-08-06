import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProcurement } from '@/hooks/useProcurement';
import { useToast } from '@/components/common/Toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  PlusCircle,
  Search,
  Eye,
  Edit,
  Upload,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { ProgressStepper } from '@/components/procurement/ProgressStepper';

export const PurchaseRequestList: React.FC = () => {
  const { requests, deleteRequest, setActiveRequest } = useProcurement();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Available filters based on requests
  const departments = ['All', ...new Set(requests.map((r) => r.department))];
  const statuses = ['All', 'Draft', 'Open', 'Under Review', 'Approved', 'Rejected', 'Closed'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete purchase request ${id}?`)) {
      deleteRequest(id);
      showToast(`Purchase request ${id} was deleted successfully.`, 'warning');
    }
  };

  const handleViewDetails = (req: any) => {
    setActiveRequest(req);
    navigate(`/purchase-requests/${req.id}`);
  };

  const handleEdit = (req: any) => {
    setActiveRequest(req);
    navigate(`/purchase-requests/${req.id}/edit`);
  };

  const handleUpload = (req: any) => {
    setActiveRequest(req);
    navigate('/upload-quotations');
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === 'All' || req.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || req.priority === priorityFilter;

    return matchesSearch && matchesDept && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Purchase Requests</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Initiate, track, and manage all corporate purchase requests.
          </p>
        </div>
        <Button
          className="text-xs gap-1.5 font-semibold py-2"
          onClick={() => {
            setActiveRequest(null);
            navigate('/purchase-requests/new');
          }}
        >
          <PlusCircle size={15} />
          Create New Request
        </Button>
      </div>

      {/* Stepper tracking overall progress */}
      <ProgressStepper currentStage="Purchase Request" />

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-600" />
            <input
              type="text"
              placeholder="Search by ID, title, or requested by..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Department Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase">Department</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Request Table */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No Requests Found"
          description="Could not find any purchase requests matching the specified search parameters or filters."
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setDeptFilter('All');
            setStatusFilter('All');
            setPriorityFilter('All');
          }}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                  <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Request ID</th>
                  <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Title</th>
                  <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Department</th>
                  <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Requested By</th>
                  <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Budget</th>
                  <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Priority</th>
                  <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Quotes</th>
                  <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{req.id}</td>
                    <td className="p-4 max-w-xs truncate font-medium">{req.title}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{req.department}</td>
                    <td className="p-4">{req.requestedBy}</td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      ${req.budget.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          req.priority === 'Critical'
                            ? 'critical'
                            : req.priority === 'High'
                            ? 'error'
                            : req.priority === 'Medium'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {req.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          req.status === 'Approved'
                            ? 'success'
                            : req.status === 'Under Review'
                            ? 'info'
                            : req.status === 'Rejected'
                            ? 'error'
                            : req.status === 'Draft'
                            ? 'neutral'
                            : 'warning'
                        }
                      >
                        {req.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-slate-600 dark:text-slate-400">
                      {req.numQuotations}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(req)}
                          title="View Details"
                          className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-primary-600 transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleEdit(req)}
                          title="Edit Request"
                          className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleUpload(req)}
                          title="Upload Quotations"
                          className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-green-600 transition-colors cursor-pointer"
                        >
                          <Upload size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(req.id)}
                          title="Delete Request"
                          className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
