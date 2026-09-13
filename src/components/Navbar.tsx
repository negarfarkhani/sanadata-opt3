import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Bell, 
  Clock, 
  Globe, 
  Plus, 
  Search, 
  ShieldCheck, 
  Server, 
  CheckCircle2, 
  AlertTriangle,
  X
} from 'lucide-react';
import { Language, IncidentAlert } from '../types';
import { t } from '../utils/translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  incidents?: IncidentAlert[];
  onOpenNewWorkOrder?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onAcknowledgeIncident?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  incidents = [],
  onOpenNewWorkOrder,
  searchQuery = '',
  onSearchChange,
  onAcknowledgeIncident,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [showAlertsDropdown, setShowAlertsDropdown] = useState<boolean>(false);

  const strings = t[language];
  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  const unresolvedIncidents = safeIncidents.filter(i => !i.resolved);
  const criticalCount = unresolvedIncidents.filter(i => i.severity === 'critical').length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Operational Status */}
          <div className="flex items-center gap-4 shrink-0">
            <div 
              id="brand-logo-btn"
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
                <Server className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    {strings.brandName}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-medium">
                    OPS 3.8
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {strings.brandSub}
                </span>
              </div>
            </div>

            {/* Live Status Badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{strings.allSystemsOperational}</span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className={`absolute top-2.5 w-4 h-4 text-slate-400 ${language === 'fa' ? 'right-3' : 'left-3'}`} />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={strings.searchPlaceholder}
                className={`w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-slate-200 placeholder-slate-500 py-2 transition-all outline-none ${
                  language === 'fa' ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className={`absolute top-2.5 text-slate-400 hover:text-white ${language === 'fa' ? 'left-3' : 'right-3'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions: Clock, Language, Notifications, New Work Order */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Live Clock */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono font-semibold tracking-wider text-cyan-300">{timeStr}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">{dateStr}</span>
            </div>

            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={() => onLanguageChange(language === 'fa' ? 'en' : 'fa')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:border-slate-600"
              title="تغییر زبان / Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'fa' ? 'English (EN)' : 'فارسی (FA)'}</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                id="notifications-bell-btn"
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
                title={strings.systemAlerts}
              >
                <Bell className="w-4 h-4" />
                {unresolvedIncidents.length > 0 && (
                  <span className={`absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold text-white ${
                    criticalCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-600'
                  }`}>
                    {unresolvedIncidents.length}
                  </span>
                )}
              </button>

              {/* Alerts Dropdown Menu */}
              {showAlertsDropdown && (
                <div 
                  className={`absolute mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 ${
                    language === 'fa' ? 'left-0 sm:left-auto sm:-right-4' : 'right-0 sm:right-auto sm:-left-4'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold text-sm text-slate-100">{strings.systemAlerts}</span>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                        {unresolvedIncidents.length}
                      </span>
                    </div>
                    <button 
                      onClick={() => setShowAlertsDropdown(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5">
                    {unresolvedIncidents.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <span>{strings.allSystemsOperational}</span>
                      </div>
                    ) : (
                      unresolvedIncidents.map((incident) => (
                        <div 
                          key={incident.id} 
                          className={`p-3 rounded-xl border text-xs transition-colors ${
                            incident.severity === 'critical'
                              ? 'bg-rose-950/30 border-rose-900/60 text-rose-200'
                              : 'bg-amber-950/30 border-amber-900/60 text-amber-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className="text-white">{language === 'fa' ? incident.title : incident.titleEn}</span>
                            <span className="font-mono text-[10px] text-slate-400">{incident.code}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] mb-2 leading-relaxed">{incident.message}</p>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">{incident.timestamp}</span>
                            {!incident.acknowledged && (
                              <button
                                onClick={() => onAcknowledgeIncident(incident.id)}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium border border-slate-700 transition-colors"
                              >
                                {strings.acknowledge}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-800 text-center">
                    <button
                      onClick={() => {
                        setShowAlertsDropdown(false);
                        onTabChange('incidents');
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      {strings.tabIncidents} →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action: New Work Order */}
            <button
              id="header-new-work-order-btn"
              onClick={onOpenNewWorkOrder}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{strings.newWorkOrder}</span>
            </button>

          </div>
        </div>

        {/* Operational Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {[
            { id: 'dashboard', label: strings.tabDashboard, icon: Activity },
            { id: 'work_orders', label: strings.tabWorkOrders, icon: Server },
            { id: 'records', label: strings.tabRecords, icon: ShieldCheck },
            { id: 'incidents', label: strings.tabIncidents, icon: AlertTriangle, badge: unresolvedIncidents.length },
            { id: 'ai_advisor', label: strings.tabAIAdvisor, icon: Activity },
            { id: 'settings', label: strings.tabSettings, icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
