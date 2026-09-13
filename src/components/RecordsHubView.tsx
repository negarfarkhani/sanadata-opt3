import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Upload, 
  Plus, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Trash2, 
  Filter,
  DollarSign
} from 'lucide-react';
import { Language, OperationalRecord, RecordCategory, RecordStatus } from '../types';
import { t, formatNumber, formatCurrency } from '../utils/translations';
import { StorageService } from '../services/storage';

interface RecordsHubViewProps {
  language: Language;
  records: OperationalRecord[];
  onAddRecord: (record: OperationalRecord) => void;
  onDeleteRecord: (id: string) => void;
  onImportRecords: (records: OperationalRecord[]) => void;
  onOpenNewRecordModal: () => void;
  onOpenImportModal: () => void;
  searchQuery: string;
}

export const RecordsHubView: React.FC<RecordsHubViewProps> = ({
  language,
  records = [],
  onAddRecord,
  onDeleteRecord,
  onImportRecords,
  onOpenNewRecordModal,
  onOpenImportModal,
  searchQuery: initialSearch,
}) => {
  const strings = t[language];
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>(initialSearch);

  const safeRecords = Array.isArray(records) ? records : [];

  const filteredRecords = useMemo(() => {
    return safeRecords.filter((rec) => {
      if (categoryFilter !== 'all' && rec.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && rec.status !== statusFilter) return false;
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const matchTitle = (rec.title || '').toLowerCase().includes(q);
        const matchNumber = (rec.recordNumber || '').toLowerCase().includes(q);
        const matchSource = (rec.sourceSystem || '').toLowerCase().includes(q);
        const matchOperator = (rec.operator || '').toLowerCase().includes(q);
        if (!matchTitle && !matchNumber && !matchSource && !matchOperator) return false;
      }
      return true;
    });
  }, [safeRecords, categoryFilter, statusFilter, localSearch]);

  const handleExportCSV = () => {
    StorageService.exportRecordsToCSV(filteredRecords, `sana-records-${Date.now()}.csv`);
  };

  const handleExportJSON = () => {
    StorageService.exportJSON(filteredRecords, `sana-records-${Date.now()}.json`);
  };

  const getStatusBadge = (status: RecordStatus) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60';
      case 'processing':
        return 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/60';
      case 'flagged':
        return 'bg-rose-950/80 text-rose-400 border border-rose-800/60';
      case 'archived':
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {strings.tabRecords}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'fa' 
                ? 'پایگاه رکوردهای تراکنش‌ها، ارتباطات شبکه، تله‌متری و پرونده‌های عملیاتی سنا'
                : 'Central repository of transaction logs, network telemetry, and Sana operational records'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>{strings.exportCSV}</span>
            </button>

            <button
              id="export-json-btn"
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>{strings.exportJSON}</span>
            </button>

            <button
              id="import-records-btn"
              onClick={onOpenImportModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>{strings.importData}</span>
            </button>

            <button
              id="new-record-btn"
              onClick={onOpenNewRecordModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{strings.newRecord}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          <div className="relative">
            <Search className={`absolute top-2.5 w-3.5 h-3.5 text-slate-400 ${language === 'fa' ? 'right-3' : 'left-3'}`} />
            <input
              id="record-search-input"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={strings.searchPlaceholder}
              className={`w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 py-2 outline-none ${
                language === 'fa' ? 'pr-8 pl-3 text-right' : 'pl-8 pr-3 text-left'
              }`}
            />
          </div>

          <div>
            <select
              id="record-category-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 py-2 px-3 outline-none"
            >
              <option value="all">{language === 'fa' ? 'همه دسته‌بندی‌ها' : 'All Categories'}</option>
              <option value="financial">{strings.financial}</option>
              <option value="telecom">{strings.telecom}</option>
              <option value="security">{strings.security}</option>
              <option value="logistics">{strings.logistics}</option>
              <option value="iot">{strings.iot}</option>
            </select>
          </div>

          <div>
            <select
              id="record-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 py-2 px-3 outline-none"
            >
              <option value="all">{language === 'fa' ? 'همه وضعیت‌ها' : 'All Statuses'}</option>
              <option value="verified">{strings.verified}</option>
              <option value="processing">{strings.processing}</option>
              <option value="flagged">{strings.flagged}</option>
              <option value="archived">{strings.archived}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4 text-start">{strings.recordNumber}</th>
                <th className="py-3 px-4 text-start">{strings.title}</th>
                <th className="py-3 px-4 text-start">{language === 'fa' ? 'دسته‌بندی' : 'Category'}</th>
                <th className="py-3 px-4 text-start">{strings.sourceSystem}</th>
                <th className="py-3 px-4 text-start">{strings.status}</th>
                <th className="py-3 px-4 text-start">{strings.confidenceScore}</th>
                <th className="py-3 px-4 text-start">{strings.timestamp}</th>
                <th className="py-3 px-4 text-end">{strings.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    {language === 'fa' ? 'هیچ رکوردی یافت نشد.' : 'No operational records found.'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-cyan-400">
                      {rec.recordNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                      {rec.title}
                      {rec.notes && (
                        <div className="text-[10px] text-slate-500 font-normal truncate">
                          {rec.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-medium">
                        {strings[rec.category]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {rec.sourceSystem}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(rec.status)}`}>
                        {strings[rec.status]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-300">
                      {rec.confidenceScore}٪
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {rec.timestamp}
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <button
                        onClick={() => {
                          if (confirm(language === 'fa' ? 'آیا از حذف این رکورد اطمینان دارید؟' : 'Are you sure you want to delete this record?')) {
                            onDeleteRecord(rec.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                        title={strings.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            {strings.totalRecords}: <strong className="text-white font-mono">{formatNumber(filteredRecords.length, language)}</strong>
          </span>
          <span className="text-[11px] text-slate-500">
            {language === 'fa' ? 'پروتکل ذخیره‌سازی رمزنگاری‌شده AES-256' : 'Encrypted AES-256 local operational cache'}
          </span>
        </div>
      </div>

    </div>
  );
};
