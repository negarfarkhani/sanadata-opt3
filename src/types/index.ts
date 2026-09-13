export type Language = 'fa' | 'en';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type WorkOrderStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'blocked';

export type Department = 'core_tech' | 'data_eng' | 'security' | 'infrastructure' | 'operations' | 'support';

export interface WorkOrder {
  id: string;
  code: string;
  title: string;
  titleEn: string;
  department: Department;
  priority: Priority;
  status: WorkOrderStatus;
  assignee: string;
  assigneeAvatar?: string;
  createdAt: string;
  dueDate: string;
  progress: number; // 0 to 100
  budgetRial: number;
  description: string;
  tags: string[];
}

export type RecordCategory = 'financial' | 'telecom' | 'logistics' | 'security' | 'iot';
export type RecordStatus = 'verified' | 'processing' | 'flagged' | 'archived';

export interface OperationalRecord {
  id: string;
  recordNumber: string;
  category: RecordCategory;
  title: string;
  sourceSystem: string;
  status: RecordStatus;
  valueAmount: number;
  confidenceScore: number; // 0 to 100
  timestamp: string;
  operator: string;
  notes?: string;
}

export type IncidentSeverity = 'critical' | 'warning' | 'info' | 'resolved';

export interface IncidentAlert {
  id: string;
  code: string;
  title: string;
  titleEn: string;
  severity: IncidentSeverity;
  subsystem: string;
  subsystemEn: string;
  timestamp: string;
  message: string;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type HealthStatus = 'healthy' | 'degraded' | 'maintenance' | 'down';

export interface SubsystemStatus {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  latencyMs: number;
  uptime: number; // e.g. 99.98
  status: HealthStatus;
  loadPercent: number;
  lastCheck: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  level: 'info' | 'warn' | 'error' | 'success';
  details: string;
}

export interface SystemSettings {
  autoRefreshInterval: number; // seconds (0 = off)
  cpuAlertThreshold: number; // percent
  latencyAlertThreshold: number; // ms
  slaTargetPercent: number; // percent
  maintenanceMode: boolean;
  systemName: string;
  notificationsEnabled: boolean;
}
