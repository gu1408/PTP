import React from 'react';
import { Building2, Users, LayoutDashboard, BarChart3, CopyCheck, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, metrics, openSettings, aiStatus }) {
  const isCloudOnline = aiStatus?.status === 'cloud_active';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-fluent-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Portal Identity */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('citizen')}
          >
            <div className="w-9 h-9 rounded-fluent-md bg-[#0078d4] flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-[#242424]">
                  Civic<span className="text-[#0078d4]">Lens</span>
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200 rounded">
                  Municipal Portal
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">City Complaint & Service Triage</p>
            </div>
          </div>

          {/* Fluent 2 Navigation Tabs */}
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('citizen')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-sm font-semibold rounded-fluent-md transition-colors ${
                activeTab === 'citizen'
                  ? 'bg-[#eff6fc] text-[#0078d4] border-b-2 border-[#0078d4]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('officer')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-sm font-semibold rounded-fluent-md transition-colors ${
                activeTab === 'officer'
                  ? 'bg-[#eff6fc] text-[#0078d4] border-b-2 border-[#0078d4]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Officer Dashboard</span>
              {metrics?.critical > 0 && (
                <span className="px-1.5 py-0.2 text-[11px] font-bold bg-[#fde7e9] text-[#c42b1c] border border-[#f8b8bc] rounded-full">
                  {metrics.critical}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-sm font-semibold rounded-fluent-md transition-colors hidden md:flex ${
                activeTab === 'analytics'
                  ? 'bg-[#eff6fc] text-[#0078d4] border-b-2 border-[#0078d4]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Ward Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('duplicates')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-sm font-semibold rounded-fluent-md transition-colors hidden lg:flex ${
                activeTab === 'duplicates'
                  ? 'bg-[#eff6fc] text-[#0078d4] border-b-2 border-[#0078d4]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <CopyCheck className="w-4 h-4" />
              <span>Duplicates</span>
              {metrics?.duplicateCount > 0 && (
                <span className="px-1.5 py-0.2 text-[11px] font-bold bg-[#fff4ce] text-[#8a6100] border border-[#feec9e] rounded-full">
                  {metrics.duplicateCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Actions: System Status & Settings */}
          <div className="flex items-center space-x-2.5">
            <div className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded border text-xs font-medium ${
              isCloudOnline
                ? 'bg-[#dff6dd] text-[#107c41] border-[#a8e5ab]'
                : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              {isCloudOnline ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#107c41]" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
              )}
              <span>{isCloudOnline ? 'Cloud AI Active' : 'Automated Triage Active'}</span>
            </div>

            <button
              onClick={openSettings}
              className="p-2 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-fluent-md transition-colors"
              title="System Configuration"
              aria-label="System Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
