import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Kanban, 
  Table as TableIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  DollarSign,
  Tag
} from 'lucide-react';
import { Language, WorkOrder, WorkOrderStatus, Priority, Department } from '../types';
import { t, formatNumber, formatCurrency } from '../utils/translations';

interface WorkOrdersViewProps {
  language: Language;
  workOrders: WorkOrder[];
  onOpenNewModal: () => void;
  onEditWorkOrder: (order: WorkOrder) => void;
  onDeleteWorkOrder: (id: string) => void;
  onStatusChange: (id: string, newStatus: WorkOrderStatus) => void;
  searchQuery: string;
}

export const WorkOrdersView: React.FC<WorkOrdersViewProps> = ({
  language,
  workOrders = [],
  onOpenNewModal,
  onEditWorkOrder,
  onDeleteWorkOrder,
  onStatusChange,
  searchQuery: initialSearch,
}) => {
  const strings = t[language];
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>(initialSearch);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);

  const safeWorkOrders = Array.isArray(workOrders) ? workOrders : [];

  const filteredOrders = useMemo(() => {
    return safeWorkOrders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && order.priority !== priorityFilter) return false;
      if (deptFilter !== 'all' && order.department !== deptFilter) return false;
      if (localSearch.trim()) {
        const query = localSearch.toLowerCase();
        const matchTitle = (order.title || '').toLowerCase().includes(query) || (order.titleEn || '').toLowerCase().includes(query);
        const matchCode = (order.code || '').toLowerCase().includes(query);
        const matchAssignee = (order.assignee || '').toLowerCase().includes(query);
        const matchTags = (order.tags || []).some(t => (t || '').toLowerCase().includes(query));
        if (!matchTitle && !matchCode && !matchAssignee && !matchTags) return false;
      }
      return true;
    });
  }, [safeWorkOrders, statusFilter, priorityFilter, deptFilter, localSearch]);

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-rose-950/80 text-rose-400 border border-rose-800/60';
      case 'high':
        return 'bg-amber-950/80 text-amber-400 border border-amber-800/60';
      case 'medium':
        return 'bg-blue-950/80 text-blue-400 border border-blue-800/60';
      case 'low':
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  const getStatusBadge = (status: WorkOrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60';
      case 'in_progress':
        return 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/60';
      case 'review':
        return 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/60';
      case 'pending':
        return 'bg-amber-950/80 text-amber-400 border border-amber-800/60';
      case 'blocked':
        return 'bg-rose-950/80 text-rose-400 border border-rose-800/60';
    }
  };

  const kanbanColumns: { id: WorkOrderStatus; label: string; color: string }[] = [
    { id: 'pending', label: strings.pending, color: 'border-amber-500/50' },
    { id: 'in_progress', label: strings.in_progress, color: 'border-cyan-500/50' },
    { id: 'review', label: strings.review, color: 'border-indigo-500/50' },
    { id: 'completed', label: strings.completed, color: 'border-emerald-500/50' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Controls: Title, Search, Filters, View Switcher */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {strings.tabWorkOrders}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'fa' 
                ? 'مدیریت و پیگیری دستور کارهای عملیاتی، تخصیص منابع و پایش وضعیت پیشرفت'
                : 'Manage and track operational work orders, resource allocation, and progress state'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                id="view-mode-table-btn"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>{strings.tableView}</span>
              </button>
              <button
                id="view-mode-kanban-btn"
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'kanban' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>{strings.kanbanView}</span>
              </button>
            </div>

            {/* Create New Button */}
            <button
              id="new-work-order-action-btn"
              onClick={onOpenNewModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{strings.newWorkOrder}</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          
          {/* Search Field */}
          <div className="relative">
            <Search className={`absolute top-2.5 w-3.5 h-3.5 text-slate-400 ${language === 'fa' ? 'right-3' : 'left-3'}`} />
            <input
              id="work-order-search"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={strings.searchPlaceholder}
              className={`w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 py-2 outline-none ${
                language === 'fa' ? 'pr-8 pl-3 text-right' : 'pl-8 pr-3 text-left'
              }`}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 py-2 px-3 outline-none"
            >
              <option value="all">{strings.filterByStatus}: {strings.filterAll}</option>
              <option value="in_progress">{strings.in_progress}</option>
              <option value="pending">{strings.pending}</option>
              <option value="review">{strings.review}</option>
              <option value="completed">{strings.completed}</option>
              <option value="blocked">{strings.blocked}</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              id="priority-filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 py-2 px-3 outline-none"
            >
              <option value="all">{strings.filterByPriority}: {strings.filterAll}</option>
              <option value="critical">{strings.critical}</option>
              <option value="high">{strings.high}</option>
              <option value="medium">{strings.medium}</option>
              <option value="low">{strings.low}</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              id="dept-filter-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 py-2 px-3 outline-none"
            >
              <option value="all">{strings.filterByDept}: {strings.filterAll}</option>
              <option value="core_tech">{language === 'fa' ? 'فناوری هسته' : 'Core Tech'}</option>
              <option value="data_eng">{language === 'fa' ? 'مهندسی داده' : 'Data Eng'}</option>
              <option value="security">{language === 'fa' ? 'امنیت سایبری' : 'Security'}</option>
              <option value="infrastructure">{language === 'fa' ? 'زیرساخت و سرور' : 'Infrastructure'}</option>
              <option value="operations">{language === 'fa' ? 'پایش عملیات' : 'Operations'}</option>
            </select>
          </div>

        </div>
      </div>

      {/* Content: Table View */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4 text-start">{strings.code}</th>
                  <th className="py-3 px-4 text-start">{strings.title}</th>
                  <th className="py-3 px-4 text-start">{strings.priority}</th>
                  <th className="py-3 px-4 text-start">{strings.status}</th>
                  <th className="py-3 px-4 text-start">{strings.assignee}</th>
                  <th className="py-3 px-4 text-start">{strings.dueDate}</th>
                  <th className="py-3 px-4 text-start">{strings.progress}</th>
                  <th className="py-3 px-4 text-end">{strings.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                      {strings.noWorkOrdersFound}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-cyan-400">
                        {order.code}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white max-w-xs">
                        <div className="truncate">
                          {language === 'fa' ? order.title : order.titleEn}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {order.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getPriorityBadge(order.priority)}`}>
                          {strings[order.priority]}
                        </span>
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => onStatusChange(order.id, e.target.value as WorkOrderStatus)}
                          className={`text-[10px] font-semibold rounded-lg px-2 py-1 outline-none cursor-pointer ${getStatusBadge(order.status)}`}
                        >
                          <option value="pending">{strings.pending}</option>
                          <option value="in_progress">{strings.in_progress}</option>
                          <option value="review">{strings.review}</option>
                          <option value="completed">{strings.completed}</option>
                          <option value="blocked">{strings.blocked}</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {order.assignee}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {order.dueDate}
                      </td>
                      <td className="py-3.5 px-4 w-28">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400">{order.progress}٪</span>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${order.progress === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`} 
                              style={{ width: `${order.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-end" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditWorkOrder(order)}
                            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-cyan-300 transition-colors"
                            title={strings.edit}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(language === 'fa' ? 'آیا از حذف این دستور کار اطمینان دارید؟' : 'Are you sure you want to delete this work order?')) {
                                onDeleteWorkOrder(order.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                            title={strings.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colOrders = filteredOrders.filter(o => o.status === col.id);
            return (
              <div 
                key={col.id} 
                className={`p-4 rounded-2xl bg-slate-900/80 border ${col.color} flex flex-col justify-between min-h-[480px] shadow-sm`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{col.label}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {colOrders.length}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {colOrders.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-slate-500">
                        {language === 'fa' ? 'موردی در این ستون نیست' : 'No tasks in this column'}
                      </div>
                    ) : (
                      colOrders.map((order) => (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer space-y-2 group shadow-sm"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono text-cyan-400 font-semibold">{order.code}</span>
                            <span className={`px-1.5 py-0.2 rounded-full font-semibold ${getPriorityBadge(order.priority)}`}>
                              {strings[order.priority]}
                            </span>
                          </div>

                          <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {language === 'fa' ? order.title : order.titleEn}
                          </h4>

                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {order.description}
                          </p>

                          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="truncate max-w-[120px]">{order.assignee}</span>
                            <span className="font-mono">{order.dueDate}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Work Order Detail Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-cyan-400">{selectedOrder.code}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityBadge(selectedOrder.priority)}`}>
                  {strings[selectedOrder.priority]}
                </span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-2">
                {language === 'fa' ? selectedOrder.title : selectedOrder.titleEn}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {selectedOrder.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-1">{strings.assignee}:</span>
                <span className="font-semibold text-slate-200">{selectedOrder.assignee}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-1">{strings.dueDate}:</span>
                <span className="font-mono font-semibold text-cyan-300">{selectedOrder.dueDate}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-1">{language === 'fa' ? 'بودجه مصوب:' : 'Allocated Budget:'}</span>
                <span className="font-mono font-semibold text-emerald-400">{formatCurrency(selectedOrder.budgetRial, language)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-1">{strings.status}:</span>
                <span className="font-semibold text-cyan-400">{strings[selectedOrder.status]}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  const current = selectedOrder;
                  setSelectedOrder(null);
                  onEditWorkOrder(current);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                {strings.edit}
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors"
              >
                {language === 'fa' ? 'بستن پنجره' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
