import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, CheckSquare, Square, MoreHorizontal, Edit, Eye, ShieldCheck, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface AdminDataTableProps<T extends { id: string; status?: any }> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  statusFilterKey?: string;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  onVerify?: (item: T) => void;
  onDelete?: (item: T) => void;
  actionsHeader?: string;
  extraActions?: (item: T) => React.ReactNode;
  headerButton?: React.ReactNode;
}

export function AdminDataTable<T extends { id: string; status?: any }>({
  data,
  columns,
  title,
  description,
  searchPlaceholder = 'Search records...',
  onEdit,
  onView,
  onVerify,
  onDelete,
  extraActions,
  headerButton,
}: AdminDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status Filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      // Text Search
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const stringified = JSON.stringify(item).toLowerCase();
      return stringified.includes(query);
    });
  }, [data, searchQuery, selectedStatus]);

  // Bulk selection handlers
  const isAllSelected = filteredData.length > 0 && selectedIds.size === filteredData.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map((d) => d.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {title && <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>}
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>

        <div className="flex items-center gap-3">
          {headerButton}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 border-b border-slate-200/80 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
            <option value="new">New (Submissions)</option>
          </select>
        </div>
      </div>

      {/* Selected Items Bulk Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-navy text-white px-5 py-2.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-gold">
            {selectedIds.size} record{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Table Region */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <th className="py-3 px-4 w-10 text-center">
                <button onClick={toggleSelectAll} className="text-slate-400 hover:text-navy cursor-pointer">
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-navy" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              {columns.map((col) => (
                <th key={col.key} className={`py-3 px-4 ${col.className || ''}`}>
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown
                        className="w-3 h-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                        onClick={() => {
                          if (sortKey === col.key) {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortKey(col.key);
                            setSortDirection('asc');
                          }
                        }}
                      />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onView || onVerify || onDelete || extraActions) && (
                <th className="py-3 px-4 text-right w-28">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleSelectRow(item.id)}
                        className="text-slate-400 hover:text-navy cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-navy" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {columns.map((col) => (
                      <td key={col.key} className={`py-3.5 px-4 ${col.className || ''}`}>
                        {col.accessor(item)}
                      </td>
                    ))}

                    {(onEdit || onView || onVerify || onDelete || extraActions) && (
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onView && (
                            <button
                              onClick={() => onView(item)}
                              title="View details"
                              className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              title="Edit record"
                              className="p-1.5 text-slate-400 hover:text-gold hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onVerify && (
                            <button
                              onClick={() => onVerify(item)}
                              title="Verify content governance"
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              title="Archive record"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {extraActions && extraActions(item)}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="py-12 px-4 text-center text-slate-500 bg-slate-50/30"
                >
                  <p className="font-semibold text-slate-700 mb-1">No matching records found</p>
                  <p className="text-xs text-slate-400 mb-3">
                    Try adjusting your search query or status filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedStatus('all');
                    }}
                    className="text-xs font-bold text-navy hover:text-gold underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredData.length}</span> of{' '}
          <span className="font-bold text-slate-800">{data.length}</span> total records
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-400 opacity-60 cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-2 font-bold text-slate-700">Page 1 of 1</span>
          <button
            disabled
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-400 opacity-60 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
