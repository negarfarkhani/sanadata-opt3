import React, { useState, useEffect, useCallback } from 'react';
import { 
  Language, 
  WorkOrder, 
  WorkOrderStatus, 
  OperationalRecord, 
  SubsystemStatus, 
  IncidentAlert, 
  SystemLog, 
  SystemSettings 
} from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { WorkOrdersView } from './components/WorkOrdersView';
import { RecordsHubView } from './components/RecordsHubView';
import { IncidentsView } from './components/IncidentsView';
import { AIOperationsView } from './components/AIOperationsView';
import { SettingsAndReportsView } from './components/SettingsAndReportsView';
import { WorkOrderModal } from './components/WorkOrderModal';
import { RecordModal } from './components/RecordModal';
import { ImportModal } from './components/ImportModal';
import { t } from './utils/translations';
import { AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('fa');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Data Collections from StorageService
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => StorageService.getWorkOrders() || []);
  const [records, setRecords] = useState<OperationalRecord[]>(() => StorageService.getRecords() || []);
  const [subsystems, setSubsystems] = useState<SubsystemStatus[]>(() => StorageService.getSubsystems() || []);
  const [incidents, setIncidents] = useState<IncidentAlert[]>(() => StorageService.getIncidents() || []);
  const [logs, setLogs] = useState<SystemLog[]>(() => StorageService.getLogs() || []);
  const [settings, setSettings] = useState<SystemSettings>(() => StorageService.getSettings());

  // Modal States
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Critical Incident Banner dismiss state
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    setWorkOrders(StorageService.getWorkOrders() || []);
    setRecords(StorageService.getRecords() || []);
    setSubsystems(StorageService.getSubsystems() || []);
    setIncidents(StorageService.getIncidents() || []);
    setLogs(StorageService.getLogs() || []);
    setSettings(StorageService.getSettings());
  }, []);

  // Sync document direction and title with language
  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Periodic Auto-refresh telemetry simulation if enabled in settings
  useEffect(() => {
    if (!settings.autoRefreshInterval || settings.autoRefreshInterval <= 0) return;

    const interval = setInterval(() => {
      // Simulate minor live latency fluctuations on healthy subsystems
      setSubsystems(prev => {
        const updated = prev.map(s => {
          const jitter = Math.floor(Math.random() * 5) - 2;
          const newLatency = Math.max(8, s.latencyMs + jitter);
          return { ...s, latencyMs: newLatency };
        });
        StorageService.saveSubsystems(updated);
        return updated;
      });
    }, settings.autoRefreshInterval * 1000);

    return () => clearInterval(interval);
  }, [settings.autoRefreshInterval]);

  // Work Orders Handlers
  const handleSaveWorkOrder = (order: WorkOrder) => {
    const isEdit = workOrders.some(w => w.id === order.id);
    let updated: WorkOrder[];
    if (isEdit) {
      updated = workOrders.map(w => w.id === order.id ? order : w);
      StorageService.addLog({
        actor: 'اپراتور عملیات',
        action: 'بروزرسانی دستور کار',
        details: `دستور کار ${order.code} - ${order.title} ویرایش گردید.`,
        level: 'info'
      });
    } else {
      updated = [order, ...workOrders];
      StorageService.addLog({
        actor: 'اپراتور عملیات',
        action: 'ایجاد دستور کار جدید',
        details: `دستور کار جدید با شناسه ${order.code} تعریف شد.`,
        level: 'success'
      });
    }
    setWorkOrders(updated);
    StorageService.saveWorkOrders(updated);
    setLogs(StorageService.getLogs());
  };

  const handleDeleteWorkOrder = (id: string) => {
    const deleted = workOrders.find(w => w.id === id);
    const updated = workOrders.filter(w => w.id !== id);
    setWorkOrders(updated);
    StorageService.saveWorkOrders(updated);
    if (deleted) {
      StorageService.addLog({
        actor: 'اپراتور عملیات',
        action: 'حذف دستور کار',
        details: `دستور کار ${deleted.code} از چرخه سیستم حذف شد.`,
        level: 'warn'
      });
      setLogs(StorageService.getLogs());
    }
  };

  const handleStatusChangeWorkOrder = (id: string, newStatus: WorkOrderStatus) => {
    const updated = workOrders.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status: newStatus,
          progress: newStatus === 'completed' ? 100 : w.progress
        };
      }
      return w;
    });
    setWorkOrders(updated);
    StorageService.saveWorkOrders(updated);
    StorageService.addLog({
      actor: 'اپراتور عملیات',
      action: 'تغییر وضعیت دستور کار',
      details: `وضعیت وظیفه به ${newStatus} تغییر یافت.`,
      level: 'info'
    });
    setLogs(StorageService.getLogs());
  };

  // Operational Records Handlers
  const handleAddRecord = (record: OperationalRecord) => {
    const updated = [record, ...records];
    setRecords(updated);
    StorageService.saveRecords(updated);
    StorageService.addLog({
      actor: record.operator,
      action: 'ثبت رکورد داده',
      details: `رکورد ${record.recordNumber} با موفقیت افزوده شد.`,
      level: 'success'
    });
    setLogs(StorageService.getLogs());
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    StorageService.saveRecords(updated);
    StorageService.addLog({
      actor: 'اپراتور داده',
      action: 'حذف رکورد',
      details: `رکورد از پایگاه عملیاتی حذف شد.`,
      level: 'warn'
    });
    setLogs(StorageService.getLogs());
  };

  const handleImportRecords = (imported: OperationalRecord[]) => {
    const updated = [...imported, ...records];
    setRecords(updated);
    StorageService.saveRecords(updated);
    StorageService.addLog({
      actor: 'سیستم واردسازی داده',
      action: 'واردسازی دسته‌ای داده',
      details: `تعداد ${imported.length} رکورد عملیاتی با موفقیت بارگذاری شد.`,
      level: 'success'
    });
    setLogs(StorageService.getLogs());
  };

  // Incidents Handlers
  const handleAcknowledgeIncident = (id: string) => {
    const updated = incidents.map(i => i.id === id ? { ...i, acknowledged: true } : i);
    setIncidents(updated);
    StorageService.saveIncidents(updated);
    StorageService.addLog({
      actor: 'تیم کشیک NOC',
      action: 'تایید هشدار',
      details: `حادثه با موفقیت تایید دریافت شد.`,
      level: 'info'
    });
    setLogs(StorageService.getLogs());
  };

  const handleResolveIncident = (id: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const updated = incidents.map(i => i.id === id ? {
      ...i,
      resolved: true,
      resolvedAt: now,
      resolvedBy: 'تیم پشتیبانی سنا'
    } : i);
    setIncidents(updated);
    StorageService.saveIncidents(updated);
    StorageService.addLog({
      actor: 'مدیر بحران',
      action: 'رفع حادثه',
      details: `حادثه با موفقیت برطرف و بایگانی شد.`,
      level: 'success'
    });
    setLogs(StorageService.getLogs());
  };

  const handleReportIncident = (data: Omit<IncidentAlert, 'id' | 'code' | 'acknowledged' | 'resolved'>) => {
    const newInc: IncidentAlert = {
      id: 'inc-' + Date.now(),
      code: `INC-${Math.floor(100 + Math.random() * 900)}`,
      title: data.title,
      titleEn: data.titleEn,
      severity: data.severity,
      subsystem: data.subsystem,
      subsystemEn: data.subsystemEn,
      timestamp: data.timestamp,
      message: data.message,
      acknowledged: false,
      resolved: false,
    };
    const updated = [newInc, ...incidents];
    setIncidents(updated);
    StorageService.saveIncidents(updated);
    StorageService.addLog({
      actor: 'سنسور پایش',
      action: 'ثبت هشدار جدید',
      details: `حادثه جدید: ${newInc.title}`,
      level: newInc.severity === 'critical' ? 'error' : 'warn'
    });
    setLogs(StorageService.getLogs());
    setDismissedBanner(false);
  };

  // Settings Handlers
  const handleSaveSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
    StorageService.addLog({
      actor: 'مدیر ارشد سیستم',
      action: 'بروزرسانی پیکربندی',
      details: 'پارامترها و آستانه‌های عملیاتی ذخیره شدند.',
      level: 'info'
    });
    setLogs(StorageService.getLogs());
  };

  const handleResetAllData = () => {
    StorageService.resetToDefaults();
    setWorkOrders(StorageService.getWorkOrders());
    setRecords(StorageService.getRecords());
    setSubsystems(StorageService.getSubsystems());
    setIncidents(StorageService.getIncidents());
    setLogs(StorageService.getLogs());
    setSettings(StorageService.getSettings());
  };

  // Refresh trigger for dashboard
  const handleManualRefresh = () => {
    setWorkOrders(StorageService.getWorkOrders());
    setSubsystems(StorageService.getSubsystems());
    setIncidents(StorageService.getIncidents());
    setLogs(StorageService.getLogs());
  };

  const openIncidentsCount = (incidents || []).filter(i => !i.resolved).length;
  const criticalIncident = (incidents || []).find(i => !i.resolved && i.severity === 'critical');

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white ${
      language === 'fa' ? 'font-vazir' : 'font-sans'
    }`}>
      
      {/* Top Navbar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        incidents={incidents}
        onOpenNewWorkOrder={() => {
          setEditingWorkOrder(null);
          setIsWorkOrderModalOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAcknowledgeIncident={handleAcknowledgeIncident}
      />

      {/* Critical Incident Banner (if unresolved critical alert exists) */}
      {criticalIncident && !dismissedBanner && (
        <div className="bg-rose-950 border-b border-rose-900/80 px-4 py-2.5 text-xs text-rose-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <strong className="font-mono text-rose-300">[{criticalIncident.code}]</strong>
              <span>{language === 'fa' ? criticalIncident.title : criticalIncident.titleEn}</span>
              <span className="hidden sm:inline text-rose-300/80 font-mono">({criticalIncident.subsystem})</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('incidents')}
                className="px-2.5 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 font-semibold text-[11px] transition-colors"
              >
                {language === 'fa' ? 'مشاهده و اقدام' : 'Resolve'}
              </button>
              <button
                onClick={() => setDismissedBanner(true)}
                className="p-1 hover:text-white text-rose-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            language={language}
            workOrders={workOrders}
            subsystems={subsystems}
            incidents={incidents}
            logs={logs}
            onNavigateTab={setActiveTab}
            onRefreshData={handleManualRefresh}
            onOpenNewWorkOrder={() => {
              setEditingWorkOrder(null);
              setIsWorkOrderModalOpen(true);
            }}
          />
        )}

        {activeTab === 'work_orders' && (
          <WorkOrdersView
            language={language}
            workOrders={workOrders}
            onOpenNewModal={() => {
              setEditingWorkOrder(null);
              setIsWorkOrderModalOpen(true);
            }}
            onEditWorkOrder={(order) => {
              setEditingWorkOrder(order);
              setIsWorkOrderModalOpen(true);
            }}
            onDeleteWorkOrder={handleDeleteWorkOrder}
            onStatusChange={handleStatusChangeWorkOrder}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'records' && (
          <RecordsHubView
            language={language}
            records={records}
            onAddRecord={handleAddRecord}
            onDeleteRecord={handleDeleteRecord}
            onImportRecords={handleImportRecords}
            onOpenNewRecordModal={() => setIsRecordModalOpen(true)}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentsView
            language={language}
            incidents={incidents}
            onAcknowledge={handleAcknowledgeIncident}
            onResolve={handleResolveIncident}
            onReportIncident={handleReportIncident}
          />
        )}

        {activeTab === 'ai_advisor' && (
          <AIOperationsView
            language={language}
            workOrders={workOrders}
            subsystems={subsystems}
            incidents={incidents}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsAndReportsView
            language={language}
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onResetAllData={handleResetAllData}
            workOrders={workOrders}
            subsystems={subsystems}
            incidents={incidents}
          />
        )}
      </main>

      {/* Modals */}
      <WorkOrderModal
        language={language}
        isOpen={isWorkOrderModalOpen}
        onClose={() => {
          setIsWorkOrderModalOpen(false);
          setEditingWorkOrder(null);
        }}
        onSave={handleSaveWorkOrder}
        initialOrder={editingWorkOrder}
      />

      <RecordModal
        language={language}
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSave={handleAddRecord}
      />

      <ImportModal
        language={language}
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportRecords}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 sm:px-8 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t[language].systemTagline}</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-400">v2.4.0-prod</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>sanadata.net@gmail.com</span>
            <span>{language === 'fa' ? 'امنیت رمزنگاری سازمانی فعال است' : 'Enterprise Encryption Active'}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
