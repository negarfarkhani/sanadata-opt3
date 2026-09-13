import { WorkOrder, OperationalRecord, IncidentAlert, SubsystemStatus, SystemLog, SystemSettings } from '../types';
import { initialWorkOrders, initialOperationalRecords, initialIncidents, initialSubsystems, initialLogs, initialSettings } from '../data/mockInitialData';

const KEYS = {
  WORK_ORDERS: 'sana_work_orders_v1',
  RECORDS: 'sana_records_v1',
  INCIDENTS: 'sana_incidents_v1',
  SUBSYSTEMS: 'sana_subsystems_v1',
  LOGS: 'sana_logs_v1',
  SETTINGS: 'sana_settings_v1',
  LANGUAGE: 'sana_language_v1',
};

export const StorageService = {
  getLanguage(): 'fa' | 'en' {
    const saved = localStorage.getItem(KEYS.LANGUAGE);
    return (saved === 'en' ? 'en' : 'fa');
  },

  setLanguage(lang: 'fa' | 'en') {
    localStorage.setItem(KEYS.LANGUAGE, lang);
  },

  getWorkOrders(): WorkOrder[] {
    try {
      const data = localStorage.getItem(KEYS.WORK_ORDERS);
      if (!data) {
        localStorage.setItem(KEYS.WORK_ORDERS, JSON.stringify(initialWorkOrders));
        return initialWorkOrders;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : initialWorkOrders;
    } catch {
      return initialWorkOrders;
    }
  },

  saveWorkOrders(orders: WorkOrder[]) {
    localStorage.setItem(KEYS.WORK_ORDERS, JSON.stringify(orders));
  },

  getRecords(): OperationalRecord[] {
    return this.getOperationalRecords();
  },

  getOperationalRecords(): OperationalRecord[] {
    try {
      const data = localStorage.getItem(KEYS.RECORDS);
      if (!data) {
        localStorage.setItem(KEYS.RECORDS, JSON.stringify(initialOperationalRecords));
        return initialOperationalRecords;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : initialOperationalRecords;
    } catch {
      return initialOperationalRecords;
    }
  },

  saveRecords(records: OperationalRecord[]) {
    this.saveOperationalRecords(records);
  },

  saveOperationalRecords(records: OperationalRecord[]) {
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
  },

  getIncidents(): IncidentAlert[] {
    try {
      const data = localStorage.getItem(KEYS.INCIDENTS);
      if (!data) {
        localStorage.setItem(KEYS.INCIDENTS, JSON.stringify(initialIncidents));
        return initialIncidents;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : initialIncidents;
    } catch {
      return initialIncidents;
    }
  },

  saveIncidents(incidents: IncidentAlert[]) {
    localStorage.setItem(KEYS.INCIDENTS, JSON.stringify(incidents));
  },

  getSubsystems(): SubsystemStatus[] {
    try {
      const data = localStorage.getItem(KEYS.SUBSYSTEMS);
      if (!data) {
        localStorage.setItem(KEYS.SUBSYSTEMS, JSON.stringify(initialSubsystems));
        return initialSubsystems;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : initialSubsystems;
    } catch {
      return initialSubsystems;
    }
  },

  saveSubsystems(subsystems: SubsystemStatus[]) {
    localStorage.setItem(KEYS.SUBSYSTEMS, JSON.stringify(subsystems));
  },

  getLogs(): SystemLog[] {
    try {
      const data = localStorage.getItem(KEYS.LOGS);
      if (!data) {
        localStorage.setItem(KEYS.LOGS, JSON.stringify(initialLogs));
        return initialLogs;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : initialLogs;
    } catch {
      return initialLogs;
    }
  },

  addLog(
    paramOrAction: string | { action: string; details: string; level?: 'info' | 'warn' | 'error' | 'success'; actor?: string },
    details?: string,
    level: 'info' | 'warn' | 'error' | 'success' = 'info',
    actor = 'کاربر سامانه'
  ) {
    let finalAction = '';
    let finalDetails = '';
    let finalLevel: 'info' | 'warn' | 'error' | 'success' = 'info';
    let finalActor = actor;

    if (typeof paramOrAction === 'object') {
      finalAction = paramOrAction.action;
      finalDetails = paramOrAction.details;
      finalLevel = paramOrAction.level || 'info';
      finalActor = paramOrAction.actor || 'کاربر سامانه';
    } else {
      finalAction = paramOrAction;
      finalDetails = details || '';
      finalLevel = level;
      finalActor = actor;
    }

    const logs = this.getLogs();
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: SystemLog = {
      id: 'log-' + Date.now(),
      timestamp: timeStr,
      actor: finalActor,
      action: finalAction,
      details: finalDetails,
      level: finalLevel,
    };
    const updated = [newLog, ...logs.slice(0, 49)];
    localStorage.setItem(KEYS.LOGS, JSON.stringify(updated));
    return updated;
  },

  getSettings(): SystemSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(initialSettings));
        return initialSettings;
      }
      return JSON.parse(data);
    } catch {
      return initialSettings;
    }
  },

  saveSettings(settings: SystemSettings) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  resetToDefaults() {
    return this.resetAll();
  },

  resetAll(): {
    workOrders: WorkOrder[];
    records: OperationalRecord[];
    incidents: IncidentAlert[];
    subsystems: SubsystemStatus[];
    logs: SystemLog[];
    settings: SystemSettings;
  } {
    localStorage.setItem(KEYS.WORK_ORDERS, JSON.stringify(initialWorkOrders));
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(initialOperationalRecords));
    localStorage.setItem(KEYS.INCIDENTS, JSON.stringify(initialIncidents));
    localStorage.setItem(KEYS.SUBSYSTEMS, JSON.stringify(initialSubsystems));
    localStorage.setItem(KEYS.LOGS, JSON.stringify(initialLogs));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(initialSettings));

    return {
      workOrders: initialWorkOrders,
      records: initialOperationalRecords,
      incidents: initialIncidents,
      subsystems: initialSubsystems,
      logs: initialLogs,
      settings: initialSettings,
    };
  },

  exportJSON(data: unknown, filename = 'sana-system-backup.json') {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  exportRecordsToCSV(records: OperationalRecord[], filename = 'sana-operational-records.csv') {
    const headers = ['کد رکورد', 'عنوان', 'دسته‌بندی', 'سامانه مبدا', 'وضعیت', 'مبلغ یا مقدار', 'امتیاز اطمینان', 'زمان ثبت', 'اپراتور', 'توضیحات'];
    const rows = records.map(r => [
      r.recordNumber,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      r.category,
      `"${(r.sourceSystem || '').replace(/"/g, '""')}"`,
      r.status,
      r.valueAmount,
      r.confidenceScore,
      r.timestamp,
      `"${(r.operator || '').replace(/"/g, '""')}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
};
