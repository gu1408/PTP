import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Languages,
  UserCheck,
  Send,
  CopyCheck,
  FileText
} from 'lucide-react';

export default function TicketDetailModal({
  ticketId,
  onClose,
  onTicketUpdated,
  onViewDuplicateGroup
}) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editable fields by Officer
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [severity, setSeverity] = useState('');
  const [officerNotes, setOfficerNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const departments = [
    'Road Maintenance Department',
    'Solid Waste Management Department',
    'Water Supply Department',
    'Electrical Department',
    'Parks and Horticulture Department',
    'Stormwater Drainage Department'
  ];

  const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const statuses = ['Pending', 'In Progress', 'Resolved'];

  useEffect(() => {
    if (!ticketId) return;
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/tickets/${ticketId}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch ticket');
      }
      setTicket(data.ticket);
      setStatus(data.ticket.status);
      setDepartment(data.ticket.department);
      setSeverity(data.ticket.severity);
      setOfficerNotes(data.ticket.officerNotes || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          department,
          severity,
          officerNotes,
          performedBy: 'Municipal Triage Officer'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update ticket');
      }

      setTicket(data.ticket);
      setSaveSuccess(true);
      if (onTicketUpdated) onTicketUpdated(data.ticket);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!ticketId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-mono font-extrabold text-white">{ticketId}</span>
            {ticket && (
              <span className="text-xs px-2.5 py-0.5 font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                {ticket.complaintId}
              </span>
            )}
            {ticket?.duplicateGroupId && (
              <button
                type="button"
                onClick={() => onViewDuplicateGroup && onViewDuplicateGroup(ticket.duplicateGroupId)}
                className="text-xs px-2.5 py-0.5 font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors flex items-center space-x-1"
              >
                <CopyCheck className="w-3.5 h-3.5" />
                <span>Duplicate Incident Grouped</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-400">Loading comprehensive ticket details...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          ) : ticket ? (
            <>
              {/* Top Banner: AI Severity Assessment */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-bold text-white">AI Severity & Triage Assessment</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-400">AI Confidence: <strong className="text-emerald-400">{Math.round((ticket.aiConfidence || 0.95) * 100)}%</strong></span>
                    <span className="text-slate-400">Intelligent Risk Score: <strong className="text-blue-400 font-mono text-sm">{ticket.priorityScore}/100</strong></span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Assessed Severity Justification:</span>
                  <p className="text-sm text-slate-200 font-medium">"{ticket.reason}"</p>
                </div>
              </div>

              {/* Citizen Complaint & Evidence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left: Original Complaint */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Original Citizen Complaint
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-900 border border-slate-800 text-blue-400 rounded flex items-center space-x-1">
                      <Languages className="w-3 h-3" />
                      <span>{ticket.complaint?.language || 'English'}</span>
                    </span>
                  </div>

                  <p className="text-sm text-slate-100 whitespace-pre-wrap bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80 leading-relaxed">
                    {ticket.complaint?.originalText}
                  </p>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1 font-semibold">Normalized Officer Summary:</span>
                    <p className="text-xs text-slate-300 italic bg-slate-900/40 p-2.5 rounded border border-slate-800">
                      "{ticket.summary}"
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-200 font-medium">{ticket.complaint?.ward}</span>
                    </div>
                    <p className="text-slate-400 pl-5">{ticket.complaint?.location}</p>
                  </div>
                </div>

                {/* Right: Photograph Evidence */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                      Incident Photograph Evidence
                    </span>
                    {ticket.complaint?.photoUrl ? (
                      <div className="relative group rounded-xl overflow-hidden border border-slate-800">
                        <img
                          src={ticket.complaint.photoUrl}
                          alt="Incident verification"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur rounded text-[10px] text-white">
                          Verified Attached Photo
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs">
                        <FileText className="w-8 h-8 mb-2 opacity-40" />
                        <span>No photograph uploaded by citizen</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Submitted: {new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>

              </div>

              {/* Officer Override & Management Controls */}
              <form onSubmit={handleSaveChanges} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-bold text-white">Officer Override & Status Management</span>
                  </div>
                  {saveSuccess && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Changes saved & logged to audit trail!</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Status */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Ticket Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 font-semibold focus:border-blue-500"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Department Re-routing */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Responsible Department (Override)
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 font-semibold focus:border-blue-500 truncate"
                    >
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* Severity Adjustment */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Severity Tier (Override)
                    </label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 font-semibold focus:border-blue-500"
                    >
                      {severities.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Officer Notes */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Field Notes & Resolution Action
                  </label>
                  <textarea
                    rows={2}
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    placeholder="Enter dispatch notes, contractor assignment, or resolution details..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-2"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Update Ticket & Log Audit Trail</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Activity Audit Trail */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  Historical Activity & Audit Trail
                </span>
                <div className="space-y-2">
                  {ticket.activityLogs && ticket.activityLogs.length > 0 ? (
                    ticket.activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs flex items-start justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{log.action}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-blue-400 font-medium">{log.performedBy}</span>
                          </div>
                          <p className="text-slate-300 mt-1">{log.details}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">No activity logs recorded yet.</p>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
}
