import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Zap, 
  Server, 
  ArrowUpRight, 
  ArrowDownRight, 
  Cpu, 
  HardDrive, 
  ShieldAlert, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Language, WorkOrder, SubsystemStatus, IncidentAlert, SystemLog } from '../types';
import { t, formatNumber } from '../utils/translations';

interface DashboardViewProps {
  language: Language;
  workOrders: WorkOrder[];
  subsystems: SubsystemStatus[];
  incidents: IncidentAlert[];
  logs: SystemLog[];
  onNavigateTab: (tab: string) => void;
  onRefreshData: () => void;
  onOpenNewWorkOrder: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  language,
  workOrders = [],
  subsystems = [],
  incidents = [],
  logs = [],
  onNavigateTab,
  onRefreshData,
  onOpenNewWorkOrder,
}) => {
  const strings = t[language];
  const [selectedRange, setSelectedRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const safeWorkOrders = Array.isArray(workOrders) ? workOrders : [];
  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  const safeSubsystems = Array.isArray(subsystems) ? subsystems : [];
  const safeLogs = Array.isArray(logs) ? logs : [];

  const activeWorkOrders = safeWorkOrders.filter(w => w.status === 'in_progress' || w.status === 'pending');
  const completedWorkOrders = safeWorkOrders.filter(w => w.status === 'completed');
  const openIncidents = safeIncidents.filter(i => !i.resolved);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Mock hourly data for the 24h chart
  const hourlyThroughput = [
    { hour: '00:00', val: 42000 },
    { hour: '02:00', val: 38000 },
    { hour: '04:00', val: 31000 },
    { hour: '06:00', val: 45000 },
    { hour: '08:00', val: 78000 },
    { hour: '10:00', val: 112000 },
    { hour: '12:00', val: 128000 },
    { hour: '14:00', val: 135000 },
    { hour: '16:00', val: 119000 },
    { hour: '18:00', val: 98000 },
    { hour: '20:00', val: 84000 },
    { hour: '22:00', val: 62000 },
  ];

  const maxVal = Math.max(...hourlyThroughput.map(h => h.val));

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Welcome Bar & Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white tracking-tight">
              {strings.systemTagline}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              Live
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'fa' 
              ? 'پایش مداوم داده‌ها، صف اجرای وظایف توزیع‌شده، ارزیابی بلادرنگ ریسک و شاخص‌های پایداری'
              : 'Continuous data monitoring, distributed task execution queue, live risk assessment & SLA compliance'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="refresh-dashboard-btn"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all active:scale-95"
            title="بروزرسانی شاخص‌ها"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            <span>{language === 'fa' ? 'بروزرسانی' : 'Refresh'}</span>
          </button>

          <button
            id="open-ai-advisor-hero-btn"
            onClick={() => onNavigateTab('ai_advisor')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{strings.tabAIAdvisor}</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: 24h Operations */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>{strings.kpiTotalOperations}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold font-mono text-white">
              {formatNumber(1489200, language)}
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +۱۴.۲٪
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">۲۱،۴۰۰</span>
            <span>{language === 'fa' ? 'تراکنش در ساعت گذشته' : 'transactions in last hour'}</span>
          </div>
        </div>

        {/* KPI 2: SLA Success Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>{strings.kpiSuccessRate}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              ۹۹.۹۴٪
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +۰.۰۸٪
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.94%' }}></div>
          </div>
        </div>

        {/* KPI 3: Active Task Queue */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>{strings.kpiActiveQueue}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold font-mono text-white">
              {formatNumber(activeWorkOrders.length, language)}
              <span className="text-xs font-normal text-slate-400 mr-1.5">
                {language === 'fa' ? 'دستورکار' : 'tasks'}
              </span>
            </span>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md font-medium">
              {formatNumber(completedWorkOrders.length, language)} {language === 'fa' ? 'تکمیل شده' : 'done'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>{language === 'fa' ? 'تخصیص یافته به ۴ تیم فنی' : 'Allocated across 4 teams'}</span>
            <button 
              onClick={() => onNavigateTab('work_orders')}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              {language === 'fa' ? 'مشاهده' : 'View'} →
            </button>
          </div>
        </div>

        {/* KPI 4: Network & Cluster Latency */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>{strings.kpiAvgLatency}</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              ۱۱۸ <span className="text-sm font-normal">{language === 'fa' ? 'میلی‌ثانیه' : 'ms'}</span>
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              -۲۴ms
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{language === 'fa' ? 'محدوده بهینه و ایمن زیر ۲۰۰ میلی‌ثانیه' : 'Optimal threshold < 200ms'}</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Operational Trend Chart & Subsystems Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 24h Interactive Throughput SVG Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm text-white">{strings.trend24h}</h3>
                <span className="text-xs text-slate-400">
                  {language === 'fa' ? 'نرخ تراکنش‌ها بر حسب ثانیه و توزیع اوج ترافیک روزانه' : 'Transactions throughput per hour and peak load distribution'}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {(['24h', '7d', '30d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      selectedRange === range
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {range === '24h' ? (language === 'fa' ? '۲۴ ساعت' : '24h') :
                     range === '7d' ? (language === 'fa' ? '۷ روز' : '7d') :
                     (language === 'fa' ? '۳۰ روز' : '30d')}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom SVG Bar & Trend Chart */}
            <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-1">
              {hourlyThroughput.map((item, idx) => {
                const heightPercent = (item.val / maxVal) * 100;
                const isPeak = item.val > 120000;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap pointer-events-none mb-1 shadow-lg">
                      {formatNumber(item.val, language)}
                    </div>
                    <div className="w-full max-w-[28px] bg-slate-800/80 rounded-t-lg relative overflow-hidden flex items-end transition-all group-hover:bg-slate-700 h-full">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isPeak
                            ? 'bg-gradient-to-t from-cyan-600 via-cyan-500 to-blue-400 shadow-lg shadow-cyan-500/20'
                            : 'bg-gradient-to-t from-slate-700 to-slate-500 group-hover:from-cyan-700 group-hover:to-cyan-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">
                      {item.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-cyan-600 to-blue-400"></span>
                <span>{language === 'fa' ? 'اوج بار پردازشی' : 'Peak Throughput'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600"></span>
                <span>{language === 'fa' ? 'ترافیک نرمال' : 'Standard Baseline'}</span>
              </div>
            </div>
            <span className="font-mono text-slate-500">
              {language === 'fa' ? 'حداکثر توان ثبت شده: ۱۳۵،۰۰۰ در ساعت' : 'Peak recorded: 135,000 / hr'}
            </span>
          </div>
        </div>

        {/* Right 1 Col: Status Distribution & Quick Work Orders */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-white">{strings.statusDistribution}</h3>
              <button
                onClick={onOpenNewWorkOrder}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                + {strings.newWorkOrder}
              </button>
            </div>

            <div className="space-y-3">
              {[
                { status: 'in_progress', label: strings.in_progress, count: safeWorkOrders.filter(w => w.status === 'in_progress').length, color: 'bg-cyan-500' },
                { status: 'completed', label: strings.completed, count: safeWorkOrders.filter(w => w.status === 'completed').length, color: 'bg-emerald-500' },
                { status: 'pending', label: strings.pending, count: safeWorkOrders.filter(w => w.status === 'pending').length, color: 'bg-amber-500' },
                { status: 'review', label: strings.review, count: safeWorkOrders.filter(w => w.status === 'review').length, color: 'bg-indigo-500' },
                { status: 'blocked', label: strings.blocked, count: safeWorkOrders.filter(w => w.status === 'blocked').length, color: 'bg-rose-500' },
              ].map((item) => {
                const percent = Math.round((item.count / (safeWorkOrders.length || 1)) * 100);
                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                        <span>{item.label}</span>
                      </div>
                      <span className="font-mono text-slate-400">
                        {formatNumber(item.count, language)} ({percent}٪)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
              <span>{language === 'fa' ? 'گلوگاه‌های جاری فرایندها' : 'Current Workflow Bottlenecks'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">
                {openIncidents.length} {language === 'fa' ? 'مورد' : 'items'}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {openIncidents.length > 0 
                ? (language === 'fa' ? openIncidents[0].title : openIncidents[0].titleEn)
                : (language === 'fa' ? 'هیچ گلوگاه بحرانی ثبت نشده است.' : 'No critical bottlenecks logged.')}
            </p>
          </div>
        </div>

      </div>

      {/* Subsystem Health Matrix & Real-time Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Subsystems Matrix */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-sm text-white">{strings.subsystemsOverview}</h3>
            </div>
            <span className="text-xs text-slate-400">
              {language === 'fa' ? 'بررسی بلادرنگ شاخص‌های کارایی' : 'Real-time performance heartbeat'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {subsystems.map((sub) => {
              const isHealthy = sub.status === 'healthy';
              return (
                <div 
                  key={sub.id} 
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-200">
                        {language === 'fa' ? sub.name : sub.nameEn}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">{sub.type}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      isHealthy 
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' 
                        : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                    }`}>
                      {isHealthy ? strings.healthy : strings.degraded}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{language === 'fa' ? 'تاخیر پینگ:' : 'Latency:'}</span>
                      <span className="font-mono text-cyan-300 font-semibold">{sub.latencyMs}ms</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{language === 'fa' ? 'پایداری (Uptime):' : 'Uptime:'}</span>
                      <span className="font-mono text-slate-300">{sub.uptime}٪</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full rounded-full ${sub.loadPercent > 80 ? 'bg-amber-500' : 'bg-cyan-500'}`} 
                        style={{ width: `${sub.loadPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live System Log Stream */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-sm text-white">{strings.recentActivity}</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">LIVE</span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/70 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-300">{log.action}</span>
                    <span className="font-mono text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{log.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>{log.actor}</span>
                    <span className={`px-1.5 py-0.2 rounded font-semibold ${
                      log.level === 'success' ? 'bg-emerald-950 text-emerald-400' :
                      log.level === 'warn' ? 'bg-amber-950 text-amber-400' :
                      log.level === 'error' ? 'bg-rose-950 text-rose-400' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {log.level.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              onClick={() => onNavigateTab('incidents')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              {strings.viewAllLogs} →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
