import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BarChart3, MapPin, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

const CATEGORY_COLORS = {
  Roads: '#3b82f6',
  Waste: '#10b981',
  Water: '#06b6d4',
  Electricity: '#f59e0b',
  Trees: '#22c55e',
  Drainage: '#8b5cf6'
};

const SEVERITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#22c55e'
};

export default function AnalyticsView({ analytics }) {
  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading civic intelligence analytics...
      </div>
    );
  }

  const { metrics, categoryDistribution = [], wardAnalytics = [], departmentDistribution = [] } = analytics;

  // Prepare severity chart data
  const severityData = [
    { name: 'Critical', count: metrics.critical, fill: '#ef4444' },
    { name: 'High', count: metrics.high, fill: '#f97316' },
    { name: 'Medium', count: metrics.medium, fill: '#eab308' },
    { name: 'Low', count: metrics.low, fill: '#22c55e' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ward-Level Civic Intelligence & Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time spatial distribution, severity density, and municipal infrastructure health metrics.
        </p>
      </div>

      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Resolution Rate</span>
            <span className="text-3xl font-extrabold text-emerald-400">{metrics.resolutionRate}%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Target municipal SLA: &gt;80%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-red-500/30 p-5 rounded-2xl shadow flex items-center justify-between">
          <div>
            <span className="text-xs text-red-400 block mb-1">Critical Urgency Backlog</span>
            <span className="text-3xl font-extrabold text-red-400">{metrics.critical}</span>
            <span className="text-[11px] text-slate-500 block mt-1">Requires immediate field dispatch</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Monitored Municipal Wards</span>
            <span className="text-3xl font-extrabold text-blue-400">{wardAnalytics.length}</span>
            <span className="text-[11px] text-slate-500 block mt-1">Spatial surveillance active</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Breakdown (Pie Chart) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Complaint Category Distribution</h3>
            <span className="text-xs font-mono text-slate-400">{metrics.total} tickets</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryDistribution.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={CATEGORY_COLORS[entry.name] || '#64748b'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution (Bar Chart) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Severity Tier Breakdown</h3>
            <span className="text-xs font-mono text-slate-400">Public Safety Index</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Ward Analytics Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Ward-by-Ward Incident Concentration</h3>
          </div>
          <span className="text-xs text-slate-400">Ranked by Total Volume</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Ward Designation</th>
                <th className="px-5 py-3.5">Total Complaints</th>
                <th className="px-5 py-3.5">Critical Urgency</th>
                <th className="px-5 py-3.5">High Priority</th>
                <th className="px-5 py-3.5">Pending Action</th>
                <th className="px-5 py-3.5 text-right">Status Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {wardAnalytics.map((w, idx) => (
                <tr key={w.ward} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-white flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono flex items-center justify-center text-slate-300">
                      #{idx + 1}
                    </span>
                    <span>{w.ward}</span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-white">{w.total}</td>
                  <td className="px-5 py-3.5">
                    {w.critical > 0 ? (
                      <span className="px-2 py-0.5 text-xs font-extrabold bg-red-500/20 text-red-400 rounded-full border border-red-500/40">
                        {w.critical} Critical
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">0</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {w.high > 0 ? (
                      <span className="px-2 py-0.5 text-xs font-bold bg-orange-500/20 text-orange-400 rounded-full">
                        {w.high} High
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">0</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-amber-300">{w.pending}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {w.critical > 0 ? (
                      <span className="text-xs font-bold text-red-400">High Danger Zone</span>
                    ) : (
                      <span className="text-xs font-medium text-emerald-400">Normal Range</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
