import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink,
  Building2,
  MapPin,
  RefreshCw,
  Flame,
  ArrowUpDown,
  FileText,
  UserCheck
} from 'lucide-react';
import { MUNICIPAL_WARDS } from '../data/wards';

export default function OfficerDashboard({
  tickets,
  metrics,
  onRefresh,
  onSelectTicket,
  onQuickUpdateStatus
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const categories = ['ALL', 'Roads', 'Waste', 'Water', 'Electricity', 'Trees', 'Drainage'];
  const severities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const departments = [
    'ALL',
    'Road Maintenance Department',
    'Solid Waste Management Department',
    'Water Supply Department',
    'Electrical Department',
    'Parks and Horticulture Department',
    'Stormwater Drainage Department'
  ];
  const statuses = ['ALL', 'Pending', 'In Progress', 'Resolved'];

  // Filtering
  const filteredTickets = tickets.filter(ticket => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        ticket.id.toLowerCase().includes(q) ||
        ticket.complaintId.toLowerCase().includes(q) ||
        ticket.summary.toLowerCase().includes(q) ||
        ticket.complaint?.originalText?.toLowerCase().includes(q) ||
        ticket.complaint?.location?.toLowerCase().includes(q) ||
        ticket.complaint?.ward?.toLowerCase().includes(q) ||
        ticket.department.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedCategory !== 'ALL' && ticket.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    if (selectedSeverity !== 'ALL' && ticket.severity.toUpperCase() !== selectedSeverity.toUpperCase()) {
      return false;
    }

    if (selectedDept !== 'ALL' && ticket.department.toLowerCase() !== selectedDept.toLowerCase()) {
      return false;
    }

    if (selectedWard !== 'ALL' && ticket.complaint?.ward?.toLowerCase() !== selectedWard.toLowerCase()) {
      return false;
    }

    if (selectedStatus !== 'ALL' && ticket.status.toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }

    return true;
  });

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-xs font-bold bg-[#fde7e9] text-[#c42b1c] border border-[#f8b8bc] rounded-fluent-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c42b1c]"></span>
            <span>Critical</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-xs font-bold bg-[#fef0eb] text-[#bc4b09] border border-[#f9cebe] rounded-fluent-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bc4b09]"></span>
            <span>High</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-xs font-semibold bg-[#fff4ce] text-[#8a6100] border border-[#feec9e] rounded-fluent-sm">
            <span>Medium</span>
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-xs font-medium bg-[#dff6dd] text-[#107c41] border border-[#a8e5ab] rounded-fluent-sm">
            <span>Low</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2 py-0.5 text-xs font-semibold bg-[#fff4ce] text-[#8a6100] border border-[#feec9e] rounded">Pending</span>;
      case 'In Progress':
        return <span className="px-2 py-0.5 text-xs font-semibold bg-[#eff6fc] text-[#0078d4] border border-[#b4d6fa] rounded">In Progress</span>;
      case 'Resolved':
        return <span className="px-2 py-0.5 text-xs font-semibold bg-[#dff6dd] text-[#107c41] border border-[#a8e5ab] rounded">Resolved</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
              Municipal Officer Command Center
            </h1>
            <span className="px-2 py-0.5 bg-[#eff6fc] border border-[#b4d6fa] text-[#0078d4] text-xs font-semibold rounded">
              Live Queue
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Prioritized municipal triage queue sorted by public safety urgency and response time.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="fluent-btn-secondary px-3.5 py-2 text-xs flex items-center space-x-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#0078d4]" />
          <span>Refresh Tickets</span>
        </button>
      </div>

      {/* Fluent 2 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Total Complaints */}
        <div className="bg-white border border-gray-200 p-4 rounded-fluent-md shadow-fluent-2">
          <span className="text-xs font-medium text-gray-500 block mb-1">Total Complaints</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">{metrics?.total || 0}</span>
            <FileText className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Critical Complaints */}
        <div className="bg-white border-l-4 border-l-[#c42b1c] border-y border-r border-gray-200 p-4 rounded-fluent-md shadow-fluent-2">
          <span className="text-xs font-medium text-[#c42b1c] block mb-1">Critical Urgency</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#c42b1c]">{metrics?.critical || 0}</span>
            <Flame className="w-4 h-4 text-[#c42b1c]" />
          </div>
        </div>

        {/* High Priority */}
        <div className="bg-white border-l-4 border-l-[#bc4b09] border-y border-r border-gray-200 p-4 rounded-fluent-md shadow-fluent-2">
          <span className="text-xs font-medium text-[#bc4b09] block mb-1">High Priority</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#bc4b09]">{metrics?.high || 0}</span>
            <AlertTriangle className="w-4 h-4 text-[#bc4b09]" />
          </div>
        </div>

        {/* Pending Action */}
        <div className="bg-white border border-gray-200 p-4 rounded-fluent-md shadow-fluent-2">
          <span className="text-xs font-medium text-[#8a6100] block mb-1">Pending Triage</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#8a6100]">{metrics?.pending || 0}</span>
            <Clock className="w-4 h-4 text-[#8a6100]" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-gray-200 p-4 rounded-fluent-md shadow-fluent-2">
          <span className="text-xs font-medium text-[#0078d4] block mb-1">In Progress</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0078d4]">{metrics?.inProgress || 0}</span>
            <Building2 className="w-4 h-4 text-[#0078d4]" />
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white border border-gray-200 p-4 rounded-fluent-md shadow-fluent-2">
          <span className="text-xs font-medium text-[#107c41] block mb-1">Resolved</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#107c41]">{metrics?.resolved || 0}</span>
            <CheckCircle2 className="w-4 h-4 text-[#107c41]" />
          </div>
        </div>

      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white border border-gray-200 p-4 rounded-fluent-lg shadow-fluent-2 space-y-3">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Ticket ID (e.g. TKT-1001), keywords, location, ward, or department..."
            className="w-full bg-white border border-gray-300 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] rounded-fluent-sm pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
          
          {/* Category */}
          <div>
            <label className="text-gray-600 block mb-1 font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded p-1.5 text-gray-800 focus:border-[#0078d4]"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="text-gray-600 block mb-1 font-medium">Severity Tier</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded p-1.5 text-gray-800 focus:border-[#0078d4]"
            >
              {severities.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="text-gray-600 block mb-1 font-medium">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded p-1.5 text-gray-800 focus:border-[#0078d4] truncate"
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Ward */}
          <div>
            <label className="text-gray-600 block mb-1 font-medium">City Ward</label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded p-1.5 text-gray-800 focus:border-[#0078d4] truncate"
            >
              <option value="ALL">All Wards</option>
              {MUNICIPAL_WARDS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-gray-600 block mb-1 font-medium">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded p-1.5 text-gray-800 focus:border-[#0078d4]"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

        </div>

        {/* Filter Summary & Count */}
        <div className="flex items-center justify-between pt-2 text-xs text-gray-500 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span>Showing <strong className="text-gray-900">{filteredTickets.length}</strong> of {tickets.length} tickets</span>
            <span>•</span>
            <span className="text-gray-600">Default Priority: Critical $\rightarrow$ High $\rightarrow$ Medium $\rightarrow$ Low (Oldest First)</span>
          </div>
          {(selectedCategory !== 'ALL' || selectedSeverity !== 'ALL' || selectedDept !== 'ALL' || selectedWard !== 'ALL' || selectedStatus !== 'ALL' || search) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('ALL');
                setSelectedSeverity('ALL');
                setSelectedDept('ALL');
                setSelectedWard('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-xs text-[#0078d4] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

      </div>

      {/* Fluent 2 Data Table */}
      <div className="bg-white border border-gray-200 rounded-fluent-lg shadow-fluent-2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-[#f9fafb] text-xs uppercase font-semibold text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Ticket ID & Summary</th>
                <th className="px-4 py-3">Priority Level</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Ward & Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`hover:bg-[#f8fafc] transition-colors ${
                      ticket.severity === 'CRITICAL' && ticket.status !== 'Resolved'
                        ? 'bg-[#fff5f5]'
                        : ''
                    }`}
                  >
                    
                    {/* Ticket & Summary */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-gray-900 text-xs">{ticket.id}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-gray-100 border border-gray-200 text-gray-700 rounded font-medium">
                          {ticket.category}
                        </span>
                        {ticket.duplicateGroupId && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-[#fff4ce] text-[#8a6100] border border-[#feec9e] rounded font-semibold">
                            Clustered
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-800 mt-0.5 line-clamp-1 font-medium">
                        {ticket.summary}
                      </p>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {new Date(ticket.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div>{getSeverityBadge(ticket.severity)}</div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          Score: <strong className="text-gray-800">{ticket.priorityScore}/100</strong>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3 text-xs text-gray-800">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#0078d4] flex-shrink-0" />
                        <span className="font-medium truncate max-w-[180px]">{ticket.department}</span>
                      </div>
                    </td>

                    {/* Ward & Location */}
                    <td className="px-4 py-3 text-xs">
                      <span className="text-gray-900 font-medium block truncate max-w-[180px]">
                        {ticket.complaint?.ward}
                      </span>
                      <span className="text-gray-500 text-[11px] block truncate max-w-[180px]">
                        {ticket.complaint?.location}
                      </span>
                    </td>

                    {/* Status Changer */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={ticket.status}
                        onChange={(e) => onQuickUpdateStatus(ticket.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded border focus:ring-1 focus:ring-[#0078d4] cursor-pointer ${
                          ticket.status === 'Pending'
                            ? 'bg-[#fff4ce] text-[#8a6100] border-[#feec9e]'
                            : ticket.status === 'In Progress'
                            ? 'bg-[#eff6fc] text-[#0078d4] border-[#b4d6fa]'
                            : 'bg-[#dff6dd] text-[#107c41] border-[#a8e5ab]'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    {/* AI Confidence */}
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-gray-600">
                      <span className="font-bold text-[#107c41]">
                        {Math.round((ticket.aiConfidence || 0.95) * 100)}%
                      </span>
                    </td>

                    {/* Inspect Action */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectTicket(ticket.id)}
                        className="fluent-btn-secondary px-2.5 py-1 text-xs inline-flex items-center space-x-1"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3 text-gray-500" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500 text-sm">
                    No tickets found matching the current search & filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
