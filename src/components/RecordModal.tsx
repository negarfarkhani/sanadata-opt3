import React, { useState } from 'react';
import { X, Plus, ShieldCheck } from 'lucide-react';
import { Language, OperationalRecord, RecordCategory, RecordStatus } from '../types';
import { t } from '../utils/translations';

interface RecordModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: OperationalRecord) => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  language,
  isOpen,
  onClose,
  onSave,
}) => {
  const strings = t[language];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RecordCategory>('financial');
  const [sourceSystem, setSourceSystem] = useState('');
  const [status, setStatus] = useState<RecordStatus>('verified');
  const [valueAmount, setValueAmount] = useState(1000000);
  const [confidenceScore, setConfidenceScore] = useState(98.5);
  const [operator, setOperator] = useState('اپراتور سیستم');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sourceSystem.trim()) return;

    const newRecord: OperationalRecord = {
      id: 'rec-' + Date.now(),
      recordNumber: `SND-DAT-${Math.floor(10000 + Math.random() * 90000)}`,
      title,
      category,
      sourceSystem,
      status,
      valueAmount: Number(valueAmount),
      confidenceScore: Number(confidenceScore),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      operator: operator || 'سیستم',
      notes,
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-base text-white">{strings.newRecord}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">{strings.title} *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'fa' ? 'مثال: لاگ تراکنش‌های بین‌بانکی شاپرک' : 'e.g. Banking settlement log batch'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">{language === 'fa' ? 'دسته‌بندی' : 'Category'}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RecordCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
              >
                <option value="financial">{strings.financial}</option>
                <option value="telecom">{strings.telecom}</option>
                <option value="security">{strings.security}</option>
                <option value="logistics">{strings.logistics}</option>
                <option value="iot">{strings.iot}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">{strings.status}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RecordStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
              >
                <option value="verified">{strings.verified}</option>
                <option value="processing">{strings.processing}</option>
                <option value="flagged">{strings.flagged}</option>
                <option value="archived">{strings.archived}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">{strings.sourceSystem} *</label>
            <input
              type="text"
              required
              value={sourceSystem}
              onChange={(e) => setSourceSystem(e.target.value)}
              placeholder={language === 'fa' ? 'مثال: سوئیچ سنا-پایا (FinGateway)' : 'e.g. Gateway Core'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">{strings.valueAmount}</label>
              <input
                type="number"
                value={valueAmount}
                onChange={(e) => setValueAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">{strings.confidenceScore} (٪)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">{language === 'fa' ? 'توضیحات و یادداشت فنی' : 'Technical Notes'}</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'fa' ? 'اطلاعات تکمیلی پرونده...' : 'Additional remarks...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              {language === 'fa' ? 'انصراف' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-600/20"
            >
              {language === 'fa' ? 'افزودن رکورد' : 'Add Record'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
