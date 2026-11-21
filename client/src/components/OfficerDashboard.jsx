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
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-extrabold bg-red-500/20 text-red-400 border border-red-500/50 rounded-full animate-pulse">
            <Flame className="w-3 h-3 text-red-400" />
            <span>CRITICAL</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-full">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            <span>HIGH</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
            <span>MEDIUM</span>
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">
            <span>LOW</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full">Pending</span>;
      case 'In Progress':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full">In Progress</span>;
      case 'Resolved':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">Resolved</span>;
      default:
        return <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-800 text-slate-400 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Municipal Officer Command Center
            </h1>
            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold rounded">
              LIVE DISPATCH
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Automated priority queuing conforming to municipal emergency response protocols.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Total Complaints */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <span className="text-xs font-medium text-slate-400 block mb-1">Total Complaints</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{metrics?.total || 0}</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Critical Complaints */}
        <div className="bg-slate-900 border border-red-500/30 p-4 rounded-xl shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full -mr-6 -mt-6"></div>
          <span className="text-xs font-medium text-red-400 block mb-1">Critical Urgency</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-red-400">{metrics?.critical || 0}</span>
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
        </div>

        {/* High Priority */}
        <div className="bg-slate-900 border border-orange-500/30 p-4 rounded-xl shadow">
          <span className="text-xs font-medium text-orange-400 block mb-1">High Priority</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-orange-400">{metrics?.high || 0}</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
        </div>

        {/* Pending Triage */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <span className="text-xs font-medium text-amber-300 block mb-1">Pending Action</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-300">{metrics?.pending || 0}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <span className="text-xs font-medium text-blue-400 block mb-1">Field Dispatched</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-400">{metrics?.inProgress || 0}</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <span className="text-xs font-medium text-emerald-400 block mb-1">Resolved</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400">{metrics?.resolved || 0}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Ticket ID (TKT-1001), keywords, location, ward, or department..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1 text-xs">
          
          {/* Category */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-blue-500"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Severity Tier</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-blue-500"
            >
              {severities.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-blue-500 truncate"
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Ward */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Municipal Ward</label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-blue-500 truncate"
            >
              <option value="ALL">ALL Wards</option>
              {MUNICIPAL_WARDS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-blue-500"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

        </div>

        {/* Filter Summary & Count */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-400 border-t border-slate-800/80">
          <div className="flex items-center space-x-2">
            <span>Showing <strong className="text-white">{filteredTickets.length}</strong> of {tickets.length} tickets</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-mono">Sorted: CRITICAL → HIGH → MEDIUM → LOW (Oldest Unresolved First)</span>
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
              className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

      </div>

      {/* Priority Queue Ticket Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Ticket & Category</th>
                <th className="px-4 py-3.5">Priority & Severity</th>
                <th className="px-4 py-3.5">Assigned Department</th>
                <th className="px-4 py-3.5">Ward & Location</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Confidence</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      ticket.severity === 'CRITICAL' && ticket.status !== 'Resolved'
                        ? 'bg-red-500/5'
                        : ''
                    }`}
                  >
                    
                    {/* Ticket & Category */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-white text-xs">{ticket.id}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded font-medium">
                          {ticket.category}
                        </span>
                        {ticket.duplicateGroupId && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                            DUP
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-1 font-medium">
                        {ticket.summary}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(ticket.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>

                    {/* Priority & Severity */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="space-y-1">
                        <div>{getSeverityBadge(ticket.severity)}</div>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
                          <span>Risk:</span>
                          <span className="font-bold text-white">{ticket.priorityScore}/100</span>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Department */}
                    <td className="px-4 py-3.5 text-xs text-slate-200">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="font-medium truncate max-w-[180px]">{ticket.department}</span>
                      </div>
                    </td>

                    {/* Ward & Location */}
                    <td className="px-4 py-3.5 text-xs">
                      <span className="text-white font-medium block truncate max-w-[180px]">
                        {ticket.complaint?.ward}
                      </span>
                      <span className="text-slate-400 text-[11px] block truncate max-w-[180px]">
                        {ticket.complaint?.location}
                      </span>
                    </td>

                    {/* Status with quick changer */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <select
                        value={ticket.status}
                        onChange={(e) => onQuickUpdateStatus(ticket.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                          ticket.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : ticket.status === 'In Progress'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        <option value="Pending" className="bg-slate-900 text-slate-200">Pending</option>
                        <option value="In Progress" className="bg-slate-900 text-slate-200">In Progress</option>
                        <option value="Resolved" className="bg-slate-900 text-slate-200">Resolved</option>
                      </select>
                    </td>

                    {/* AI Confidence */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-xs font-mono">
                      <span className="text-emerald-400 font-bold">
                        {Math.round((ticket.aiConfidence || 0.95) * 100)}%
                      </span>
                      {ticket.manualReviewRequired && (
                        <span className="ml-1.5 px-1 text-[10px] bg-amber-500/20 text-amber-300 rounded">
                          Review
                        </span>
                      )}
                    </td>

                    {/* Action button */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectTicket(ticket.id)}
                        className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-lg text-xs font-semibold transition-all inline-flex items-center space-x-1"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">
                    No complaints found matching the current search & filters.
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
