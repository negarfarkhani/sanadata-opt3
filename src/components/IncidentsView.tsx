import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Plus, 
  Check, 
  Activity,
  Filter
} from 'lucide-react';
import { Language, IncidentAlert, IncidentSeverity } from '../types';
import { t, formatNumber } from '../utils/translations';

interface IncidentsViewProps {
  language: Language;
  incidents: IncidentAlert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onReportIncident: (incident: Omit<IncidentAlert, 'id' | 'code' | 'acknowledged' | 'resolved'>) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  language,
  incidents = [],
  onAcknowledge,
  onResolve,
  onReportIncident,
}) => {
  const strings = t[language];
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // New incident form state
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('warning');
  const [subsystem, setSubsystem] = useState('');
  const [message, setMessage] = useState('');

  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  const unresolved = safeIncidents.filter(i => !i.resolved);
  const resolved = safeIncidents.filter(i => i.resolved);

  const filteredIncidents = safeIncidents.filter((inc) => {
    if (severityFilter === 'active') return !inc.resolved;
    if (severityFilter === 'resolved') return inc.resolved;
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
    return true;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subsystem.trim() || !message.trim()) return;
    onReportIncident({
      title,
      titleEn: title,
      severity,
      subsystem,
      subsystemEn: subsystem,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      message,
    });
    setTitle('');
    setMessage('');
    setSubsystem('');
    setShowNewModal(false);
  };

  const getSeverityBadge = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-950/80 text-rose-400 border border-rose-800/60';
      case 'warning':
        return 'bg-amber-950/80 text-amber-400 border border-amber-800/60';
      case 'info':
        return 'bg-blue-950/80 text-blue-400 border border-blue-800/60';
      case 'resolved':
        return 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">{strings.openIncidents}</span>
            <span className="text-2xl font-bold font-mono text-rose-400">
              {formatNumber(unresolved.length, language)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">{strings.mttrTime}</span>
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {strings.mttrValue}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">{strings.resolvedIncidents}</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {formatNumber(resolved.length, language)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action and Filter Header */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {strings.tabIncidents}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'fa' 
              ? 'پایش حوادث، هشدارهای غیرمنتظره و ثبت اقدامات بازیابی و کاهش زمان قطعی'
              : 'Monitor operational incidents, automated alerts, and execute fast resolution protocols'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'all', label: strings.filterAll },
              { id: 'active', label: strings.openIncidents },
              { id: 'critical', label: strings.critical },
              { id: 'resolved', label: strings.resolvedIncidents },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSeverityFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  severityFilter === f.id ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            id="report-incident-btn"
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{strings.reportIncident}</span>
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <span>{strings.allSystemsOperational}</span>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const isResolved = incident.resolved;
            return (
              <div 
                key={incident.id} 
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isResolved 
                    ? 'bg-slate-900/40 border-slate-800 opacity-70' 
                    : incident.severity === 'critical'
                    ? 'bg-rose-950/20 border-rose-900/60 shadow-lg shadow-rose-950/20'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-cyan-400">{incident.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getSeverityBadge(isResolved ? 'resolved' : incident.severity)}`}>
                      {isResolved ? strings.completed : strings[incident.severity]}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {language === 'fa' ? incident.subsystem : incident.subsystemEn}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {incident.timestamp}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white">
                    {language === 'fa' ? incident.title : incident.titleEn}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {incident.message}
                  </p>

                  {isResolved && incident.resolvedAt && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {language === 'fa' 
                          ? `رفع شده در ${incident.resolvedAt} توسط ${incident.resolvedBy || 'اپراتور'}`
                          : `Resolved at ${incident.resolvedAt} by ${incident.resolvedBy || 'Operator'}`}
                      </span>
                    </div>
                  )}
                </div>

                {!isResolved && (
                  <div className="flex items-center gap-2 shrink-0">
                    {!incident.acknowledged ? (
                      <button
                        onClick={() => onAcknowledge(incident.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
                      >
                        {strings.acknowledge}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 px-2 py-1 bg-slate-800/40 rounded-lg">
                        {language === 'fa' ? 'تایید دریافت' : 'Acknowledged'}
                      </span>
                    )}

                    <button
                      onClick={() => onResolve(incident.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors"
                    >
                      {strings.markResolved}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Report Incident Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">{strings.reportIncident}</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitNew} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">{strings.title}</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={language === 'fa' ? 'مثال: افت توان پهنای باند خط دیتاسنتر' : 'e.g. Bandwidth drop in DC link'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">{strings.priority}</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                  >
                    <option value="critical">{strings.critical}</option>
                    <option value="warning">{strings.high}</option>
                    <option value="info">{strings.low}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{language === 'fa' ? 'زیرسیستم مربوطه' : 'Subsystem'}</label>
                  <input
                    type="text"
                    required
                    value={subsystem}
                    onChange={(e) => setSubsystem(e.target.value)}
                    placeholder={language === 'fa' ? 'کلاستر پایگاه داده' : 'Database Cluster'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{language === 'fa' ? 'شرح رخداد و اثرات عملیاتی' : 'Description'}</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'fa' ? 'توضیحات دقیق فنی...' : 'Detailed technical details...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  {language === 'fa' ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-lg shadow-rose-600/20"
                >
                  {language === 'fa' ? 'ثبت حادثه' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
