import React from 'react';
import { ShieldAlert, Users, LayoutDashboard, BarChart3, CopyCheck, Sliders, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, metrics, openSettings, aiStatus }) {
  const isCloudOnline = aiStatus?.status === 'cloud_active';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('citizen')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-white">Civic<span className="text-blue-400">Lens</span></span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded">AI TRIAGE</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Turning Citizen Complaints Into Action</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('citizen')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'citizen'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('officer')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'officer'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Officer Dashboard</span>
              {metrics?.critical > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                  {metrics.critical}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all hidden md:flex ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Ward Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('duplicates')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all hidden lg:flex ${
                activeTab === 'duplicates'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <CopyCheck className="w-4 h-4" />
              <span>Duplicates</span>
              {metrics?.duplicateCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                  {metrics.duplicateCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Actions: Truthful AI status indicator & Settings */}
          <div className="flex items-center space-x-2">
            <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs ${
              isCloudOnline
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
            }`}>
              <span className="relative flex h-2 w-2">
                {isCloudOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isCloudOnline ? 'bg-emerald-500' : 'bg-amber-400'
                }`}></span>
              </span>
              <span className="font-mono text-[11px] font-semibold">
                {aiStatus?.statusLabel || (isCloudOnline ? 'Gemini Cloud AI Active' : 'Local Fallback Active (Deterministic NLP)')}
              </span>
            </div>

            <button
              onClick={openSettings}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="AI Engine Configuration"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
