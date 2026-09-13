import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Language, OperationalRecord } from '../types';
import { t } from '../utils/translations';

interface ImportModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onImport: (records: OperationalRecord[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  language,
  isOpen,
  onClose,
  onImport,
}) => {
  const strings = t[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState<OperationalRecord[]>([]);
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFileContent = (content: string, name: string) => {
    setFileName(name);
    setErrorMessage('');
    try {
      if (name.endsWith('.json') || content.trim().startsWith('[') || content.trim().startsWith('{')) {
        const json = JSON.parse(content);
        const list = Array.isArray(json) ? json : [json];
        const validRecords: OperationalRecord[] = list.map((item, idx) => ({
          id: item.id || 'rec-' + Date.now() + '-' + idx,
          recordNumber: item.recordNumber || `SND-IMP-${Math.floor(1000 + idx)}`,
          title: item.title || 'Imported Record ' + (idx + 1),
          category: item.category || 'financial',
          sourceSystem: item.sourceSystem || 'Import File',
          status: item.status || 'verified',
          valueAmount: Number(item.valueAmount) || 0,
          confidenceScore: Number(item.confidenceScore) || 95,
          timestamp: item.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19),
          operator: item.operator || 'Import Agent',
          notes: item.notes || 'Imported from ' + name,
        }));
        setParsedData(validRecords);
      } else {
        // Simple CSV parser
        const lines = content.split('\n').filter(l => l.trim().length > 0);
        if (lines.length <= 1) {
          throw new Error('CSV has no data rows');
        }
        const rows = lines.slice(1);
        const records: OperationalRecord[] = rows.map((line, idx) => {
          const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          return {
            id: 'rec-' + Date.now() + '-' + idx,
            recordNumber: cols[0] || `SND-CSV-${1000 + idx}`,
            title: cols[1] || `CSV Row ${idx + 1}`,
            category: (cols[2] as any) || 'financial',
            sourceSystem: cols[3] || 'CSV Import',
            status: (cols[4] as any) || 'verified',
            valueAmount: Number(cols[5]) || 0,
            confidenceScore: Number(cols[6]) || 90,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            operator: 'CSV Batch',
            notes: 'Imported from CSV',
          };
        });
        setParsedData(records);
      }
    } catch (err: any) {
      setErrorMessage(language === 'fa' 
        ? 'فرمت فایل معتبر نیست. لطفاً فایل JSON یا CSV استاندارد انتخاب کنید.' 
        : 'Invalid file format. Please upload valid JSON or standard CSV.');
      setParsedData([]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processFileContent(event.target.result as string, file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processFileContent(event.target.result as string, file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmImport = () => {
    if (parsedData.length === 0) return;
    onImport(parsedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-base text-white">{strings.importData}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-cyan-400 bg-cyan-950/20' 
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>

          <span className="text-xs font-semibold text-white block mb-1">
            {language === 'fa' 
              ? 'فایل CSV یا JSON را اینجا بکشید و رها کنید یا کلیک کنید' 
              : 'Drag and drop CSV or JSON file here or click to browse'}
          </span>
          <span className="text-[11px] text-slate-500">
            {language === 'fa' ? 'پشتیبانی از فرمت‌های استاندارد UTF-8' : 'Standard UTF-8 CSV & JSON supported'}
          </span>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {parsedData.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'fa' ? 'فایل آماده بارگذاری' : 'Ready for ingestion'}</span>
              </div>
              <span className="font-mono text-white">{parsedData.length} {language === 'fa' ? 'رکورد' : 'rows'}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono truncate">
              {fileName}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
          >
            {language === 'fa' ? 'انصراف' : 'Cancel'}
          </button>
          <button
            type="button"
            disabled={parsedData.length === 0}
            onClick={handleConfirmImport}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20"
          >
            {language === 'fa' ? `تایید و واردسازی (${parsedData.length})` : `Confirm Import (${parsedData.length})`}
          </button>
        </div>

      </div>
    </div>
  );
};
