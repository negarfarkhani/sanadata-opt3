import React, { useState } from 'react';
import { 
  Printer, 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  Server, 
  Clock,
  Layers,
  Database
} from 'lucide-react';
import { Language, SystemSettings, WorkOrder, SubsystemStatus, IncidentAlert } from '../types';
import { t, formatNumber, formatCurrency } from '../utils/translations';
import { StorageService } from '../services/storage';

interface SettingsAndReportsViewProps {
  language: Language;
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
  onResetAllData: () => void;
  workOrders: WorkOrder[];
  subsystems: SubsystemStatus[];
  incidents: IncidentAlert[];
}

export const SettingsAndReportsView: React.FC<SettingsAndReportsViewProps> = ({
  language,
  settings: initialSettings,
  onSaveSettings,
  onResetAllData,
  workOrders = [],
  subsystems = [],
  incidents = [],
}) => {
  const strings = t[language];
  const [currentSettings, setCurrentSettings] = useState<SystemSettings>(initialSettings);
  const [saveToast, setSaveToast] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  const safeWorkOrders = Array.isArray(workOrders) ? workOrders : [];
  const safeSubsystems = Array.isArray(subsystems) ? subsystems : [];
  const safeIncidents = Array.isArray(incidents) ? incidents : [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(currentSettings);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleReset = () => {
    if (confirm(strings.resetConfirm)) {
      onResetAllData();
    }
  };

  const handleExportFullBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      settings: currentSettings,
      workOrders,
      subsystems,
      incidents,
    };
    StorageService.exportJSON(backup, `sana-data-full-backup-${Date.now()}.json`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* View Switcher: Settings vs Official Report */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {strings.systemSettings}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'fa' 
              ? 'پیکربندی پارامترهای پایشی، حدود آستانه هشدارها و تولید گزارش رسمی'
              : 'Configure operational parameters, threshold limits, and generate official briefings'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrintView(!showPrintView)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showPrintView 
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-md' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{showPrintView ? (language === 'fa' ? 'بازگشت به تنظیمات' : 'Back to Settings') : strings.printReport}</span>
          </button>
        </div>
      </div>

      {showPrintView ? (
        /* Printable Official Report Document */
        <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-300 print:m-0 print:p-0 print:border-none space-y-8">
          
          {/* Official Document Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base">
                  س
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {language === 'fa' ? 'سامانه جامع پایش عملیات و داده‌کاوی سنا' : 'Sana Data Operations & Analytics Platform'}
                </h1>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                {language === 'fa' ? 'گزارش رسمی تراز عملکرد و وضعیت تاب‌آوری زیرساخت' : 'Official Operational Resilience & Status Audit Report'}
              </span>
            </div>

            <div className="text-end text-xs space-y-1 font-mono text-slate-600">
              <div>{language === 'fa' ? 'شماره سند:' : 'Doc No:'} <strong className="text-slate-900">SND-REP-2026-981</strong></div>
              <div>{language === 'fa' ? 'تاریخ صدور:' : 'Issue Date:'} <strong className="text-slate-900">{new Date().toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</strong></div>
              <div>{language === 'fa' ? 'طبقه بندی:' : 'Classification:'} <strong className="text-rose-600 font-bold">{language === 'fa' ? 'محرمانه - اداری' : 'Confidential'}</strong></div>
            </div>
          </div>

          {/* Key Executive Metrics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">{strings.kpiTotalOperations}</span>
              <span className="text-lg font-bold font-mono text-slate-900">1,489,200</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">{strings.kpiSuccessRate}</span>
              <span className="text-lg font-bold font-mono text-emerald-700">99.94%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">{strings.kpiAvgLatency}</span>
              <span className="text-lg font-bold font-mono text-blue-700">118 ms</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">{strings.openIncidents}</span>
              <span className="text-lg font-bold font-mono text-amber-700">{safeIncidents.filter(i => !i.resolved).length}</span>
            </div>
          </div>

          {/* Work Orders Snapshot Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-1">
              {language === 'fa' ? 'وضعیت دستور کارهای استراتژیک در دست اقدام' : 'Active Strategic Work Orders'}
            </h3>
            <table className="w-full text-xs text-slate-700 border border-slate-200">
              <thead className="bg-slate-100 text-slate-900 font-semibold">
                <tr>
                  <th className="p-2 border text-start">{strings.code}</th>
                  <th className="p-2 border text-start">{strings.title}</th>
                  <th className="p-2 border text-start">{strings.assignee}</th>
                  <th className="p-2 border text-start">{strings.status}</th>
                  <th className="p-2 border text-start">{strings.progress}</th>
                </tr>
              </thead>
              <tbody>
                {safeWorkOrders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2 font-mono font-semibold border">{order.code}</td>
                    <td className="p-2 border">{language === 'fa' ? order.title : order.titleEn}</td>
                    <td className="p-2 border">{order.assignee}</td>
                    <td className="p-2 border font-semibold">{strings[order.status]}</td>
                    <td className="p-2 font-mono border">{order.progress}٪</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subsystems Audit */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-1">
              {language === 'fa' ? 'ارزیابی زیرسیستم‌های حیاتی پایگاه داده و شبکه' : 'Critical Subsystems Audit'}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {safeSubsystems.map((sub) => (
                <div key={sub.id} className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block">{language === 'fa' ? sub.name : sub.nameEn}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Latency: {sub.latencyMs}ms | Uptime: {sub.uptime}%</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    sub.status === 'healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {sub.status === 'healthy' ? strings.healthy : strings.degraded}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Signatures */}
          <div className="pt-8 border-t-2 border-slate-900 flex items-center justify-between text-xs font-semibold text-slate-800">
            <div className="text-center space-y-6">
              <span>{language === 'fa' ? 'مدیر ارشد عملیات و پایش (COO)' : 'Chief Operating Officer'}</span>
              <div className="text-[11px] text-slate-400 font-serif italic">[امضا و تایید سیستمی]</div>
            </div>
            <div className="text-center space-y-6">
              <span>{language === 'fa' ? 'رئیس امنیت اطلاعات و زیرساخت (CISO)' : 'Chief Information Security Officer'}</span>
              <div className="text-[11px] text-slate-400 font-serif italic">[امضا و تایید سیستمی]</div>
            </div>
            <div className="text-center space-y-6">
              <span>{language === 'fa' ? 'مهر رسمی دپارتمان داده سنا' : 'Sana Official Department Seal'}</span>
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-[9px] text-slate-400">
                SEAL
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-lg active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'fa' ? 'چاپ یا دریافت نسخه PDF' : 'Print or Save as PDF'}</span>
            </button>
          </div>

        </div>
      ) : (
        /* Settings Forms & Configurations */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Form */}
          <form onSubmit={handleSave} className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-sm">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>{language === 'fa' ? 'پارامترهای فنی و آستانه‌های نظارتی' : 'Technical & Alert Thresholds'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">{strings.autoRefresh}</label>
                <select
                  value={currentSettings.autoRefreshInterval}
                  onChange={(e) => setCurrentSettings({ ...currentSettings, autoRefreshInterval: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500"
                >
                  <option value={0}>{strings.off}</option>
                  <option value={5}>۵ {strings.seconds}</option>
                  <option value={10}>۱۰ {strings.seconds}</option>
                  <option value={30}>۳۰ {strings.seconds}</option>
                  <option value={60}>۶۰ {strings.seconds}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">{strings.cpuAlertThreshold} (٪)</label>
                <input
                  type="number"
                  min="50"
                  max="99"
                  value={currentSettings.cpuAlertThreshold}
                  onChange={(e) => setCurrentSettings({ ...currentSettings, cpuAlertThreshold: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">{strings.latencyAlertThreshold}</label>
                <input
                  type="number"
                  min="50"
                  max="1000"
                  value={currentSettings.latencyAlertThreshold}
                  onChange={(e) => setCurrentSettings({ ...currentSettings, latencyAlertThreshold: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">{strings.slaTarget} (٪)</label>
                <input
                  type="number"
                  step="0.01"
                  min="90"
                  max="100"
                  value={currentSettings.slaTargetPercent}
                  onChange={(e) => setCurrentSettings({ ...currentSettings, slaTargetPercent: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Emergency Toggle */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">{strings.maintenanceMode}</span>
                <span className="text-[11px] text-slate-400">
                  {language === 'fa' 
                    ? 'تعلیق موقت پردازش وظایف غیرضروری جهت انجام عملیات بهینه‌سازی دیتابیس'
                    : 'Temporarily pause non-essential batch worker jobs for database optimization'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={currentSettings.maintenanceMode}
                onChange={(e) => setCurrentSettings({ ...currentSettings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {saveToast && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{strings.settingsSaved}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mr-auto">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{strings.saveSettings}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Right 1 Col: Backup & Danger Zone */}
          <div className="space-y-4">
            
            {/* Backup Box */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>{language === 'fa' ? 'پشتیبان‌گیری کامل پایگاه داده' : 'Full Platform Backup'}</span>
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {language === 'fa' 
                  ? 'دریافت نسخه پشتیبان رمزگذاری‌شده از کلیه دستور کارها، رکوردهای عملیاتی و تنظیمات به فرمت JSON'
                  : 'Download complete snapshot of all work orders, data records, and settings in JSON format.'}
              </p>
              <button
                onClick={handleExportFullBackup}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'fa' ? 'دانلود فایل پشتیبان (JSON)' : 'Download Full Backup'}</span>
              </button>
            </div>

            {/* Danger Zone */}
            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/50 shadow-sm space-y-3">
              <h3 className="font-bold text-xs text-rose-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>{strings.dangerZone}</span>
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {language === 'fa' 
                  ? 'بازنشانی تمام داده‌های محلی و بازگردانی نمونه اولیه سیستم سنا داده'
                  : 'Clear local database cache and restore initial Sana operational data.'}
              </p>
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 text-xs font-semibold border border-rose-800/80 transition-colors active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{strings.resetToFactory}</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
