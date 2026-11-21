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
import { BarChart3, MapPin, AlertTriangle, ShieldCheck, Flame, Info } from 'lucide-react';

const CATEGORY_COLORS = {
  Roads: '#0078d4',
  Waste: '#107c41',
  Water: '#008272',
  Electricity: '#d83b01',
  Trees: '#498205',
  Drainage: '#8764b8'
};

const SEVERITY_COLORS = {
  CRITICAL: '#c42b1c',
  HIGH: '#bc4b09',
  MEDIUM: '#8a6100',
  LOW: '#107c41'
};

export default function AnalyticsView({ analytics }) {
  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
        Loading ward analytics...
      </div>
    );
  }

  const { metrics, categoryDistribution = [], wardAnalytics = [], departmentDistribution = [] } = analytics;

  // Prepare severity chart data
  const severityData = [
    { name: 'Critical', count: metrics.critical, fill: '#c42b1c' },
    { name: 'High', count: metrics.high, fill: '#bc4b09' },
    { name: 'Medium', count: metrics.medium, fill: '#8a6100' },
    { name: 'Low', count: metrics.low, fill: '#107c41' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
          Ward-Level Incident Intelligence & Statistics
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Spatial volume distribution, severity density, and municipal infrastructure resolution rates.
        </p>
      </div>

      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white border border-gray-200 p-5 rounded-fluent-md shadow-fluent-2 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block mb-1">Resolution Rate</span>
            <span className="text-3xl font-bold text-[#107c41]">{metrics.resolutionRate}%</span>
            <span className="text-[11px] text-gray-500 block mt-1">Target municipal SLA: &gt;80%</span>
          </div>
          <div className="w-11 h-11 rounded-fluent-md bg-[#dff6dd] border border-[#a8e5ab] flex items-center justify-center text-[#107c41]">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-[#c42b1c] border-y border-r border-gray-200 p-5 rounded-fluent-md shadow-fluent-2 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#c42b1c] font-semibold block mb-1">Critical Backlog</span>
            <span className="text-3xl font-bold text-[#c42b1c]">{metrics.critical}</span>
            <span className="text-[11px] text-gray-500 block mt-1">Immediate priority tickets</span>
          </div>
          <div className="w-11 h-11 rounded-fluent-md bg-[#fde7e9] border border-[#f8b8bc] flex items-center justify-center text-[#c42b1c]">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-fluent-md shadow-fluent-2 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block mb-1">Monitored City Wards</span>
            <span className="text-3xl font-bold text-[#0078d4]">{wardAnalytics.length}</span>
            <span className="text-[11px] text-gray-500 block mt-1">Active municipal coverage</span>
          </div>
          <div className="w-11 h-11 rounded-fluent-md bg-[#eff6fc] border border-[#b4d6fa] flex items-center justify-center text-[#0078d4]">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown (Donut Chart) */}
        <div className="bg-white border border-gray-200 p-5 rounded-fluent-lg shadow-fluent-2">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Complaint Category Distribution</h3>
            <span className="text-xs text-gray-500">{metrics.total} Total Reports</span>
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
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={3}
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
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', borderRadius: '4px', color: '#242424', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Breakdown (Bar Chart) */}
        <div className="bg-white border border-gray-200 p-5 rounded-fluent-lg shadow-fluent-2">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Severity Tier Breakdown</h3>
            <span className="text-xs text-gray-500">Public Safety Tiers</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#616161" fontSize={12} tickLine={false} />
                <YAxis stroke="#616161" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', borderRadius: '4px', color: '#242424', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
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
      <div className="bg-white border border-gray-200 rounded-fluent-lg shadow-fluent-2 overflow-hidden">
        <div className="p-4 px-5 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#0078d4]" />
            <h3 className="font-semibold text-gray-900 text-sm">Ward-by-Ward Incident Concentration</h3>
          </div>
          <span className="text-xs text-gray-500">Ranked by Total Volume</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-[#f9fafb] text-xs uppercase font-semibold text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">Ward Designation</th>
                <th className="px-5 py-3">Total Complaints</th>
                <th className="px-5 py-3">Critical Urgency</th>
                <th className="px-5 py-3">High Priority</th>
                <th className="px-5 py-3">Pending Action</th>
                <th className="px-5 py-3 text-right">Status Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {wardAnalytics.map((w, idx) => (
                <tr key={w.ward} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900 flex items-center space-x-2">
                    <span className="w-5 h-5 rounded bg-gray-100 border border-gray-200 text-xs font-mono flex items-center justify-center text-gray-600">
                      {idx + 1}
                    </span>
                    <span>{w.ward}</span>
                  </td>
                  <td className="px-5 py-3 font-bold text-gray-900">{w.total}</td>
                  <td className="px-5 py-3">
                    {w.critical > 0 ? (
                      <span className="px-2 py-0.5 text-xs font-bold bg-[#fde7e9] text-[#c42b1c] rounded border border-[#f8b8bc]">
                        {w.critical} Critical
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">0</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {w.high > 0 ? (
                      <span className="px-2 py-0.5 text-xs font-bold bg-[#fef0eb] text-[#bc4b09] rounded border border-[#f9cebe]">
                        {w.high} High
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">0</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-semibold text-[#8a6100]">{w.pending}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {w.critical > 0 ? (
                      <span className="text-xs font-semibold text-[#c42b1c]">High Risk Zone</span>
                    ) : (
                      <span className="text-xs font-medium text-[#107c41]">Standard Range</span>
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
