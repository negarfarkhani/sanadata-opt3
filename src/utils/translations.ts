import { Language } from '../types';

export const t = {
  fa: {
    systemName: 'سامانه مدیریت عملیات و هوش داده سنا',
    systemTagline: 'مرکز جامع پایش، مدیریت فرایندها و تحلیل هوشمند داده‌ها',
    brandName: 'سنا داده',
    brandSub: 'سامانه جامع عملیاتی',
    allSystemsOperational: 'کلیه سرویس‌ها فعال و برخط هستند',
    systemAlerts: 'هشدارهای فعال',
    newWorkOrder: 'ثبت دستور کار جدید',
    newRecord: 'ثبت رکورد عملیاتی',
    searchPlaceholder: 'جستجو در شناسه‌ها، عناوین و رویدادها...',
    liveClock: 'ساعت زنده سیستم',
    
    // Tabs
    tabDashboard: 'داشبورد عملیات',
    tabWorkOrders: 'دستور کارها و فرایندها',
    tabRecords: 'پایگاه رکوردهای داده',
    tabIncidents: 'مرکز حوادث و مانیتورینگ',
    tabAIAdvisor: 'تحلیلگر هوشمند (Gemini)',
    tabSettings: 'تنظیمات و گزارش رسمی',

    // Dashboard
    kpiTotalOperations: 'کل پردازش‌های ۲۴ ساعت',
    kpiSuccessRate: 'نرخ موفقیت عملیاتی',
    kpiActiveQueue: 'صف کارهای در دست اقدام',
    kpiAvgLatency: 'میانگین تاخیر شبکه و سرور',
    trend24h: 'روند بار و تراکنش‌ها در ۲۴ ساعت گذشته',
    statusDistribution: 'توزیع وضعیت دستور کارهای سازمانی',
    subsystemsOverview: 'ماتریس سلامت زیرسیستم‌های اصلی',
    recentActivity: 'لاگ زنده رویدادهای سیستمی',
    noRecentLogs: 'هیچ لاگ جدیدی ثبت نشده است.',
    viewAllLogs: 'مشاهده جزئیات بیشتر',

    // Statuses
    pending: 'در انتظار',
    in_progress: 'در حال انجام',
    review: 'در دست بررسی',
    completed: 'تکمیل شده',
    blocked: 'مسدود / توقف',

    // Priorities
    critical: 'بحرانی',
    high: 'بالا',
    medium: 'متوسط',
    low: 'پایین',

    // Categories
    financial: 'مالی و بانکی',
    telecom: 'مخابرات و شبکه',
    logistics: 'لجستیک و تامین',
    security: 'امنیت و کنترل دسترسی',
    iot: 'اینترنت اشیاء و تجهیزات',

    // Subsystems
    healthy: 'نرمال و پایدار',
    degraded: 'کاهش کارایی',
    maintenance: 'درحال نگهداری',
    down: 'قطع ارتباط',

    // Work Orders
    filterAll: 'همه موارد',
    filterByStatus: 'فیلتر بر اساس وضعیت',
    filterByPriority: 'فیلتر بر اساس اولویت',
    filterByDept: 'فیلتر بر اساس دپارتمان',
    tableView: 'نمای جدول',
    kanbanView: 'نمای کانبان',
    code: 'شناسه',
    title: 'عنوان دستور کار',
    department: 'دپارتمان',
    assignee: 'مجری / مسئول',
    dueDate: 'موعد تحویل',
    progress: 'پیشرفت',
    priority: 'اولویت',
    status: 'وضعیت',
    actions: 'عملیات',
    edit: 'ویرایش',
    delete: 'حذف',
    changeStatus: 'تغییر وضعیت',
    workOrderDetails: 'مشخصات کامل دستور کار',
    noWorkOrdersFound: 'هیچ دستور کاری با این شرایط یافت نشد.',

    // Records
    recordNumber: 'شماره پرونده',
    sourceSystem: 'سامانه مبدا',
    valueAmount: 'مقدار / حجم',
    confidenceScore: 'شاخص اطمینان',
    timestamp: 'زمان ثبت',
    verified: 'تایید شده',
    processing: 'درحال پردازش',
    flagged: 'نشاندار (بررسی)',
    archived: 'بایگانی شده',
    exportCSV: 'خروجی CSV',
    exportJSON: 'پشتیبان JSON',
    importData: 'ورود اطلاعات (Import)',
    totalRecords: 'مجموع رکوردهای ثبت شده',

    // Incidents
    openIncidents: 'حوادث و هشدارهای باز',
    resolvedIncidents: 'حوادث رفع شده',
    acknowledge: 'تایید دریافت هشدار',
    markResolved: 'علامت‌گذاری به عنوان رفع شده',
    reportIncident: 'گزارش رویداد جدید',
    mttrTime: 'میانگین زمان رفع حوادث (MTTR)',
    mttrValue: '۱۸ دقیقه',

    // AI Advisor
    aiTitle: 'دستیار ارشد تحلیل و بهینه‌سازی عملیات (Gemini 3.8 Flash)',
    aiDescription: 'تحلیل هوشمند بلادرنگ بارهای پردازشی، شناسایی گلوگاه‌ها و ارائه راهکارهای عملیاتی برخط',
    generateDiagnosis: 'تحلیل جامع وضعیت سامانه با هوش مصنوعی',
    aiAnalyzing: 'درحال پردازش اطلاعات عملیاتی با مدل جمینای...',
    askAIPrompt: 'پرسش یا دستور تحلیل خود را بنویسید (مثال: گلوگاه‌های اصلی سامانه در ساعات اوج چیست؟)',
    sendToAI: 'ارسال و تحلیل',
    aiQuickPrompts: 'دستورات تحلیلی آماده:',
    prompt1: 'ارزیابی ریسک‌های امنیتی و بار کلاستر پایگاه داده',
    prompt2: 'پیشنهاد جدول زمان‌بندی بهینه برای دستورکارهای معوق',
    prompt3: 'تحلیل عملکرد و ارائه راهکارهای کاهش تاخیر شبکه',

    // Settings
    systemSettings: 'تنظیمات و پیکربندی عملیاتی سامانه',
    autoRefresh: 'نرخ بازنشانی خودکار اطلاعات',
    seconds: 'ثانیه',
    off: 'خاموش',
    cpuAlertThreshold: 'آستانه هشدار مصرف پردازنده',
    latencyAlertThreshold: 'آستانه هشدار تاخیر شبکه (میلی‌ثانیه)',
    slaTarget: 'هدف شاخص دسترسی (SLA)',
    maintenanceMode: 'حالت تعمیرات و نگهداری اضطراری',
    saveSettings: 'ذخیره تنظیمات',
    settingsSaved: 'تنظیمات با موفقیت ذخیره شد.',
    dangerZone: 'منطقه عملیات حساس',
    resetToFactory: 'بازنشانی کلیه داده‌ها به مقادیر اولیه',
    resetConfirm: 'آیا از بازنشانی داده‌ها اطمینان دارید؟ تمامی تغییرات به داده‌های پیش‌فرض بازخواهد گشت.',
    printReport: 'تولید و چاپ گزارش رسمی عملیات',
  },
  en: {
    systemName: 'Sana Data Operations & Intelligence System',
    systemTagline: 'Integrated Operations Monitoring, Process Management & AI Analytics',
    brandName: 'Sana Data',
    brandSub: 'Operations Platform',
    allSystemsOperational: 'All systems operational & online',
    systemAlerts: 'Active Alerts',
    newWorkOrder: 'New Work Order',
    newRecord: 'New Data Record',
    searchPlaceholder: 'Search IDs, work orders, logs...',
    liveClock: 'System Clock',

    tabDashboard: 'Operations Dashboard',
    tabWorkOrders: 'Work Orders & Tasks',
    tabRecords: 'Data Records Hub',
    tabIncidents: 'Incident & Alert Center',
    tabAIAdvisor: 'AI Intelligence (Gemini)',
    tabSettings: 'Settings & Official Report',

    kpiTotalOperations: '24h Total Throughput',
    kpiSuccessRate: 'Operational Success Rate',
    kpiActiveQueue: 'Active Task Queue',
    kpiAvgLatency: 'Average Network Latency',
    trend24h: 'Throughput & Load Trend (Last 24 Hours)',
    statusDistribution: 'Work Order Status Distribution',
    subsystemsOverview: 'Subsystem Health Matrix',
    recentActivity: 'Live System Activity Stream',
    noRecentLogs: 'No new logs recorded.',
    viewAllLogs: 'View log history',

    pending: 'Pending',
    in_progress: 'In Progress',
    review: 'Review',
    completed: 'Completed',
    blocked: 'Blocked',

    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',

    financial: 'Financial & Banking',
    telecom: 'Telecom & Network',
    logistics: 'Logistics & Supply',
    security: 'Cybersecurity',
    iot: 'IoT & Telemetry',

    healthy: 'Healthy & Stable',
    degraded: 'Performance Degraded',
    maintenance: 'Maintenance',
    down: 'Offline',

    filterAll: 'All Items',
    filterByStatus: 'Filter by Status',
    filterByPriority: 'Filter by Priority',
    filterByDept: 'Filter by Department',
    tableView: 'Table View',
    kanbanView: 'Kanban Board',
    code: 'Code',
    title: 'Work Order Title',
    department: 'Department',
    assignee: 'Assignee',
    dueDate: 'Due Date',
    progress: 'Progress',
    priority: 'Priority',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    changeStatus: 'Change Status',
    workOrderDetails: 'Work Order Details',
    noWorkOrdersFound: 'No work orders matching your filters.',

    recordNumber: 'Record ID',
    sourceSystem: 'Source System',
    valueAmount: 'Amount / Value',
    confidenceScore: 'Confidence Score',
    timestamp: 'Timestamp',
    verified: 'Verified',
    processing: 'Processing',
    flagged: 'Flagged',
    archived: 'Archived',
    exportCSV: 'Export CSV',
    exportJSON: 'Export JSON',
    importData: 'Import Data',
    totalRecords: 'Total Registered Records',

    openIncidents: 'Active Incidents & Alerts',
    resolvedIncidents: 'Resolved Incidents',
    acknowledge: 'Acknowledge',
    markResolved: 'Mark as Resolved',
    reportIncident: 'Report Incident',
    mttrTime: 'Mean Time to Recovery (MTTR)',
    mttrValue: '18 Minutes',

    aiTitle: 'Chief AI Operations Advisor (Gemini 3.8 Flash)',
    aiDescription: 'Autonomous system diagnosis, bottleneck detection, and live operational optimizations',
    generateDiagnosis: 'Run Full System AI Diagnosis',
    aiAnalyzing: 'Analyzing system metrics with Gemini...',
    askAIPrompt: 'Type your operational inquiry (e.g. What are the key bottlenecks during peak load?)',
    sendToAI: 'Analyze with AI',
    aiQuickPrompts: 'Quick Operational Queries:',
    prompt1: 'Evaluate security risks & database cluster load',
    prompt2: 'Suggest optimal scheduling for delayed work orders',
    prompt3: 'Analyze performance and recommend network latency fixes',

    systemSettings: 'System Operations & Configuration',
    autoRefresh: 'Auto Refresh Interval',
    seconds: 'seconds',
    off: 'Off',
    cpuAlertThreshold: 'CPU Alert Threshold',
    latencyAlertThreshold: 'Network Latency Alert Threshold (ms)',
    slaTarget: 'Target SLA Availability',
    maintenanceMode: 'Emergency Maintenance Mode',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved successfully.',
    dangerZone: 'Sensitive Operations',
    resetToFactory: 'Reset All Data to Defaults',
    resetConfirm: 'Are you sure you want to reset all data to default mock records?',
    printReport: 'Generate & Print Official Report',
  }
};

export function formatNumber(num: number, lang: Language): string {
  if (lang === 'fa') {
    return new Intl.NumberFormat('fa-IR').format(num);
  }
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCurrency(amount: number, lang: Language): string {
  if (lang === 'fa') {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال';
  }
  return new Intl.NumberFormat('en-US').format(amount) + ' IRR';
}
