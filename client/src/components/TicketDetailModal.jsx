import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Languages,
  UserCheck,
  Send,
  CopyCheck,
  FileText,
  Info
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-fluent-lg w-full max-w-4xl shadow-fluent-16 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Fluent 2 Dialog Header */}
        <div className="p-4 px-6 border-b border-gray-200 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-mono font-bold text-gray-900">{ticketId}</span>
            {ticket && (
              <span className="text-xs px-2.5 py-0.5 font-semibold rounded bg-gray-100 text-gray-700 border border-gray-200">
                {ticket.complaintId}
              </span>
            )}
            {ticket?.duplicateGroupId && (
              <button
                type="button"
                onClick={() => onViewDuplicateGroup && onViewDuplicateGroup(ticket.duplicateGroupId)}
                className="text-xs px-2.5 py-0.5 font-semibold rounded bg-[#fff4ce] text-[#8a6100] border border-[#feec9e] hover:bg-[#ffeb99] transition-colors flex items-center space-x-1"
              >
                <CopyCheck className="w-3.5 h-3.5" />
                <span>Related Cluster</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Close Dialog"
            aria-label="Close Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#fafafa]">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-[#0078d4] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-gray-500">Loading ticket records...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-[#fde7e9] border border-[#f8b8bc] text-[#c42b1c] rounded-fluent-md text-sm">
              {error}
            </div>
          ) : ticket ? (
            <>
              {/* Top Banner: Triage Assessment */}
              <div className="bg-white p-4 rounded-fluent-md border border-gray-200 shadow-fluent-2 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-[#0078d4]" />
                    <span className="text-sm font-bold text-gray-900">Triage Classification Summary</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-gray-500">AI Confidence: <strong className="text-[#107c41]">{Math.round((ticket.aiConfidence || 0.95) * 100)}%</strong></span>
                    <span className="text-gray-500">Risk Score: <strong className="text-[#0078d4] font-mono text-sm">{ticket.priorityScore}/100</strong></span>
                  </div>
                </div>

                <div className="p-3 bg-[#f9fafb] rounded border border-gray-200 text-xs">
                  <span className="text-gray-500 block mb-1 font-semibold">Severity Justification:</span>
                  <p className="text-gray-800 font-medium">"{ticket.reason}"</p>
                </div>
              </div>

              {/* Citizen Complaint & Evidence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left: Original Complaint */}
                <div className="bg-white p-4 rounded-fluent-md border border-gray-200 shadow-fluent-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Original Citizen Complaint
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-700 rounded flex items-center space-x-1">
                      <Languages className="w-3 h-3 text-[#0078d4]" />
                      <span>{ticket.complaint?.language || 'English'}</span>
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 whitespace-pre-wrap bg-[#fafafa] p-3 rounded border border-gray-200 leading-relaxed">
                    {ticket.complaint?.originalText}
                  </p>

                  <div>
                    <span className="text-xs text-gray-500 block mb-1 font-semibold">Normalized English Summary:</span>
                    <p className="text-xs text-gray-700 italic bg-[#fafafa] p-2 rounded border border-gray-200">
                      "{ticket.summary}"
                    </p>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-800 font-medium">{ticket.complaint?.ward}</span>
                    </div>
                    <p className="text-gray-600 pl-5">{ticket.complaint?.location}</p>
                  </div>
                </div>

                {/* Right: Photograph Evidence */}
                <div className="bg-white p-4 rounded-fluent-md border border-gray-200 shadow-fluent-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                      Photograph Evidence
                    </span>
                    {ticket.complaint?.photoUrl ? (
                      <div className="rounded-fluent-md overflow-hidden border border-gray-200 bg-[#fafafa]">
                        <img
                          src={ticket.complaint.photoUrl}
                          alt="Incident verification"
                          className="w-full h-44 object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-44 rounded-fluent-md border border-dashed border-gray-200 bg-[#fafafa] flex flex-col items-center justify-center text-gray-400 text-xs">
                        <FileText className="w-8 h-8 mb-1.5 opacity-40" />
                        <span>No photograph uploaded by citizen</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <span>Submitted: {new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>

              </div>

              {/* Officer Override & Management Controls */}
              <form onSubmit={handleSaveChanges} className="bg-white p-5 rounded-fluent-md border border-gray-200 shadow-fluent-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-[#0078d4]" />
                    <span className="text-sm font-bold text-gray-900">Officer Status & Re-routing Controls</span>
                  </div>
                  {saveSuccess && (
                    <span className="text-xs text-[#107c41] font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Changes saved & logged to audit trail!</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Status */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Ticket Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-900 font-semibold focus:border-[#0078d4]"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Department Re-routing */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Department (Override)
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-900 font-semibold focus:border-[#0078d4] truncate"
                    >
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* Severity Adjustment */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Severity Tier (Override)
                    </label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-900 font-semibold focus:border-[#0078d4]"
                    >
                      {severities.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Officer Notes */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Internal Field Notes & Resolution Details
                  </label>
                  <textarea
                    rows={2}
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    placeholder="Enter dispatch notes, crew assignment, or resolution notes..."
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-[#0078d4]"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 fluent-btn-primary text-xs flex items-center space-x-1.5"
                  >
                    {isSaving ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Save & Log to Audit Trail</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Activity Audit Trail */}
              <div className="bg-white p-4 rounded-fluent-md border border-gray-200 shadow-fluent-2 space-y-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                  Action Audit Trail
                </span>
                <div className="space-y-2">
                  {ticket.activityLogs && ticket.activityLogs.length > 0 ? (
                    ticket.activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-[#fafafa] rounded border border-gray-200 text-xs flex items-start justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900">{log.action}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-[#0078d4] font-medium">{log.performedBy}</span>
                          </div>
                          <p className="text-gray-700 mt-0.5">{log.details}</p>
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono">
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
                    <p className="text-xs text-gray-400">No activity logs recorded yet.</p>
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
