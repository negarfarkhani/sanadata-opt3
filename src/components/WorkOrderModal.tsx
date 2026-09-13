import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { Language, WorkOrder, WorkOrderStatus, Priority, Department } from '../types';
import { t } from '../utils/translations';

interface WorkOrderModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: WorkOrder) => void;
  initialOrder?: WorkOrder | null;
}

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  language,
  isOpen,
  onClose,
  onSave,
  initialOrder,
}) => {
  const strings = t[language];

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('core_tech');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<WorkOrderStatus>('pending');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [budgetRial, setBudgetRial] = useState(250000000);
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (initialOrder) {
      setTitle(initialOrder.title);
      setDepartment(initialOrder.department);
      setPriority(initialOrder.priority);
      setStatus(initialOrder.status);
      setAssignee(initialOrder.assignee);
      setDueDate(initialOrder.dueDate);
      setProgress(initialOrder.progress);
      setBudgetRial(initialOrder.budgetRial);
      setDescription(initialOrder.description);
      setTagsInput(initialOrder.tags.join(', '));
    } else {
      setTitle('');
      setDepartment('core_tech');
      setPriority('medium');
      setStatus('pending');
      setAssignee('');
      setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setProgress(0);
      setBudgetRial(250000000);
      setDescription('');
      setTagsInput('Operations, Sana');
    }
  }, [initialOrder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assignee.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const orderData: WorkOrder = {
      id: initialOrder ? initialOrder.id : 'wo-' + Date.now(),
      code: initialOrder ? initialOrder.code : `SND-OPS-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      titleEn: title,
      department,
      priority,
      status,
      assignee,
      createdAt: initialOrder ? initialOrder.createdAt : new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      progress: Number(progress),
      budgetRial: Number(budgetRial),
      description,
      tags: tags.length > 0 ? tags : ['General'],
    };

    onSave(orderData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-base text-white">
            {initialOrder ? strings.edit : strings.newWorkOrder}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">{strings.title} *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'fa' ? 'مثال: ارتقای کارایی موتور تطبیق داده‌ها' : 'e.g. Data Engine Optimization'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">{strings.department}</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
              >
                <option value="core_tech">{language === 'fa' ? 'فناوری هسته' : 'Core Tech'}</option>
                <option value="data_eng">{language === 'fa' ? 'مهندسی داده' : 'Data Eng'}</option>
                <option value="security">{language === 'fa' ? 'امنیت سایبری' : 'Security'}</option>
                <option value="infrastructure">{language === 'fa' ? 'زیرساخت و سرور' : 'Infrastructure'}</option>
                <option value="operations">{language === 'fa' ? 'پایش عملیات' : 'Operations'}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">{strings.priority}</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
              >
                <option value="critical">{strings.critical}</option>
                <option value="high">{strings.high}</option>
                <option value="medium">{strings.medium}</option>
                <option value="low">{strings.low}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">{strings.status}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WorkOrderStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
              >
                <option value="pending">{strings.pending}</option>
                <option value="in_progress">{strings.in_progress}</option>
                <option value="review">{strings.review}</option>
                <option value="completed">{strings.completed}</option>
                <option value="blocked">{strings.blocked}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">{strings.assignee} *</label>
              <input
                type="text"
                required
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder={language === 'fa' ? 'مثال: مهندس رضایی' : 'e.g. Sarah Connor'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">{strings.dueDate}</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">{strings.progress} ({progress}٪)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full mt-2 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {language === 'fa' ? 'بودجه برآورد شده (ریال)' : 'Allocated Budget (IRR)'}
            </label>
            <input
              type="number"
              value={budgetRial}
              onChange={(e) => setBudgetRial(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">{language === 'fa' ? 'شرح و الزامات فنی' : 'Description'}</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'fa' ? 'جزئیات اجرایی، نیازمندی‌ها و تست...' : 'Task execution details...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {language === 'fa' ? 'برچسب‌ها (با کاما جدا کنید)' : 'Tags (comma-separated)'}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="DB, Postgres, Network"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
            />
          </div>

          {/* Buttons */}
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-600/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{initialOrder ? (language === 'fa' ? 'ذخیره تغییرات' : 'Save Changes') : (language === 'fa' ? 'ثبت دستور کار' : 'Create Work Order')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
