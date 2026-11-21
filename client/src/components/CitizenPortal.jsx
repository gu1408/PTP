import React, { useState, useEffect } from 'react';
import {
  Send,
  Upload,
  Image,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Search,
  Clock,
  Building2,
  ArrowRight,
  X,
  FileText,
  Languages,
  Check,
  Info
} from 'lucide-react';
import { MUNICIPAL_WARDS, TEST_PRESETS } from '../data/wards';

export default function CitizenPortal({ onComplaintSubmitted, onTrackTicketId, initialTrackId }) {
  const [activeSubTab, setActiveSubTab] = useState('submit'); // 'submit' or 'track'
  
  // Submission Form State
  const [text, setText] = useState('');
  const [ward, setWard] = useState(MUNICIPAL_WARDS[0]);
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedLang, setDetectedLang] = useState('English');
  const [errorMsg, setErrorMsg] = useState('');

  // Live Dispatch Preview State
  const [dispatchPreview, setDispatchPreview] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Success Confirmation State
  const [submissionResult, setSubmissionResult] = useState(null);

  // Tracker State
  const [searchTicketId, setSearchTicketId] = useState(initialTrackId || '');
  const [trackedTicket, setTrackedTicket] = useState(null);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [trackerError, setTrackerError] = useState('');

  // Detect language dynamically as user types
  useEffect(() => {
    if (/[\u0C80-\u0CFF]/.test(text)) {
      setDetectedLang('Kannada');
    } else if (/[\u0900-\u097F]/.test(text)) {
      setDetectedLang('Hindi');
    } else {
      setDetectedLang('English');
    }
  }, [text]);

  // Debounced Service Preview as citizen types
  useEffect(() => {
    if (!text || text.trim().length < 15) {
      setDispatchPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsPreviewLoading(true);
        const res = await fetch('/api/ai/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, location })
        });
        const data = await res.json();
        if (data.success) {
          setDispatchPreview(data.aiResult);
        }
      } catch (err) {
        console.error('Preview request failed', err);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [text, location]);

  // Apply one of the common test presets
  const handleLoadPreset = (preset) => {
    setText(preset.text);
    setWard(preset.ward);
    setLocation(preset.location);
    setPhotoUrl(preset.photoUrl);
    setErrorMsg('');
  };

  // Handle Photo File Upload (Convert to base64 with strict validation)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!validMimes.includes(file.type)) {
      setErrorMsg('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5MB limit. Please upload a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result);
      setErrorMsg('');
    };
    reader.onerror = () => {
      setErrorMsg('Failed to process image. Please try another photograph.');
    };
    reader.readAsDataURL(file);
  };

  // Submit Complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setErrorMsg('Please provide a description of the issue before submitting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText: text,
          language: detectedLang,
          photoUrl: photoUrl || null,
          location: location || 'Specified Ward Area',
          ward
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit complaint. Please try again.');
      }

      setSubmissionResult(data);
      if (onComplaintSubmitted) {
        onComplaintSubmitted(data.ticket);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lookup Ticket in Tracker
  const handleTrackTicket = async (idToSearch) => {
    const id = (idToSearch || searchTicketId || '').trim().toUpperCase();
    if (!id) {
      setTrackerError('Please enter your Complaint ID or Ticket ID.');
      return;
    }

    setTrackerLoading(true);
    setTrackerError('');
    setTrackedTicket(null);

    try {
      const res = await fetch(`/api/tickets/${id.trim()}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No matching record found. Please verify your ID.');
      }
      setTrackedTicket(data.ticket);
    } catch (err) {
      setTrackerError(err.message);
    } finally {
      setTrackerLoading(false);
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#fde7e9] text-[#c42b1c] border border-[#f8b8bc] rounded-fluent-sm">
            Critical
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#fef0eb] text-[#bc4b09] border border-[#f9cebe] rounded-fluent-sm">
            High Priority
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#fff4ce] text-[#8a6100] border border-[#feec9e] rounded-fluent-sm">
            Medium Priority
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#dff6dd] text-[#107c41] border border-[#a8e5ab] rounded-fluent-sm">
            Standard
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Fluent 2 Pivot Navigation (Submit vs Track) */}
      <div className="flex border-b border-gray-200 mb-8 justify-center sm:justify-start">
        <button
          onClick={() => setActiveSubTab('submit')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${
            activeSubTab === 'submit'
              ? 'text-[#0078d4] border-b-2 border-[#0078d4]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Submit a Complaint
        </button>
        <button
          onClick={() => setActiveSubTab('track')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${
            activeSubTab === 'track'
              ? 'text-[#0078d4] border-b-2 border-[#0078d4]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Track Complaint Status
        </button>
      </div>

      {activeSubTab === 'submit' ? (
        <div>
          {/* Submission Success View */}
          {submissionResult ? (
            <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-fluent-lg p-8 shadow-fluent-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#dff6dd] border border-[#a8e5ab] text-[#107c41] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h2 className="text-2xl font-bold text-[#242424]">Complaint Registered</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Your complaint has been logged and dispatched to the designated municipal department.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-[#fafafa] rounded-fluent-md p-5 border border-gray-200 mb-6 space-y-4 text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-gray-200">
                  <div>
                    <span className="text-xs text-gray-500 block mb-0.5">Complaint Number</span>
                    <span className="font-semibold text-gray-900">{submissionResult.complaint.id}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-0.5">Service Ticket ID</span>
                    <span className="font-semibold text-[#0078d4]">{submissionResult.ticket.id}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-0.5">Priority Level</span>
                    <div>{getSeverityBadge(submissionResult.ticket.severity)}</div>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block mb-1">Routed Department</span>
                  <div className="flex items-center space-x-2 text-gray-900 font-semibold">
                    <Building2 className="w-4 h-4 text-[#0078d4]" />
                    <span>{submissionResult.ticket.department}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-500 block mb-1">Assessed Routing Justification</span>
                  <p className="text-gray-700 bg-white p-3 rounded border border-gray-200 text-xs">
                    {submissionResult.ticket.reason}
                  </p>
                </div>

                {submissionResult.duplicateInfo?.isDuplicate && (
                  <div className="bg-[#fff4ce] border border-[#feec9e] p-3 rounded text-xs text-[#8a6100]">
                    <div className="flex items-center space-x-1.5 font-bold mb-0.5">
                      <Info className="w-4 h-4" />
                      <span>Related Incident Clustered</span>
                    </div>
                    <p className="leading-relaxed">
                      {submissionResult.duplicateInfo.reason || 'This matches an open report in the same area. Your report is securely linked to the active work order.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionResult(null);
                    setText('');
                    setPhotoUrl('');
                    setDispatchPreview(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 fluent-btn-secondary text-sm"
                >
                  Submit Another Report
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTicketId(submissionResult.ticket.id);
                    setActiveSubTab('track');
                    handleTrackTicket(submissionResult.ticket.id);
                  }}
                  className="w-full sm:w-auto px-5 py-2 fluent-btn-primary text-sm flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Track This Complaint</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Citizen Form & Quick-Fill (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Welcoming Header */}
                <div className="bg-white border border-gray-200 p-6 rounded-fluent-lg shadow-fluent-2">
                  <h1 className="text-2xl font-bold text-[#242424] tracking-tight">
                    Submit a Municipal Service Request
                  </h1>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    Report public infrastructure issues directly to city operations. You can write in English, Kannada, or Hindi.
                  </p>

                  {/* Common Report Presets */}
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                      Common Incident Examples (Click to Fill)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {TEST_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleLoadPreset(preset)}
                          className="px-2.5 py-1 text-xs font-medium bg-[#f5f5f5] hover:bg-gray-200 text-gray-700 border border-gray-200 rounded transition-colors flex items-center space-x-1.5"
                        >
                          <span className={`w-2 h-2 rounded-full ${
                            preset.severity === 'CRITICAL' ? 'bg-[#c42b1c]' :
                            preset.severity === 'HIGH' ? 'bg-[#bc4b09]' :
                            preset.severity === 'MEDIUM' ? 'bg-[#8a6100]' : 'bg-[#107c41]'
                          }`}></span>
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-fluent-lg shadow-fluent-2 space-y-5">
                  {errorMsg && (
                    <div className="p-3 bg-[#fde7e9] border border-[#f8b8bc] text-[#c42b1c] rounded text-xs font-medium flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Complaint Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-semibold text-gray-800">
                        Describe the Issue <span className="text-[#c42b1c]">*</span>
                      </label>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-700 rounded flex items-center space-x-1">
                          <Languages className="w-3 h-3 text-[#0078d4]" />
                          <span>Language: {detectedLang}</span>
                        </span>
                      </div>
                    </div>
                    <textarea
                      rows={4}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Please describe what happened, where it is located, and any safety hazards..."
                      className="w-full bg-white border border-gray-300 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] rounded-fluent-sm p-3 text-sm text-gray-900 placeholder-gray-400"
                      required
                    />
                    <span className="text-[11px] text-gray-500 block mt-1">Minimum 5 characters. Be as specific as possible.</span>
                  </div>

                  {/* Ward and Location Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-800 block mb-1.5">
                        City Ward <span className="text-[#c42b1c]">*</span>
                      </label>
                      <select
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        className="w-full bg-white border border-gray-300 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] rounded-fluent-sm p-2.5 text-sm text-gray-900"
                      >
                        {MUNICIPAL_WARDS.map((w) => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-800 block mb-1.5">
                        Specific Location / Landmark
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Near St. Joseph School Gate"
                          className="w-full bg-white border border-gray-300 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] rounded-fluent-sm pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload Section */}
                  <div>
                    <label className="text-sm font-semibold text-gray-800 block mb-1.5">
                      Upload Photo (Optional)
                    </label>

                    {photoUrl ? (
                      <div className="bg-[#f9fafb] border border-gray-200 rounded-fluent-md p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={photoUrl}
                            alt="Uploaded evidence"
                            className="w-14 h-14 object-cover rounded border border-gray-200"
                          />
                          <div>
                            <span className="text-xs font-semibold text-[#107c41] flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Photograph Attached</span>
                            </span>
                            <span className="text-[11px] text-gray-500 block mt-0.5">Attached to service ticket</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-200 rounded transition-colors"
                          title="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-300 hover:border-gray-400 bg-[#fafafa] rounded-fluent-md p-4 text-center cursor-pointer transition-colors">
                        <label className="cursor-pointer block">
                          <Upload className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                          <span className="text-xs text-gray-700 font-medium block">
                            Click to select an image or drag and drop
                          </span>
                          <span className="text-[11px] text-gray-400 block mt-0.5">PNG, JPG, or WEBP up to 5MB</span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/jpg"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !text.trim()}
                      className="w-full py-2.5 px-4 fluent-btn-primary text-sm flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>Routing Complaint...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Complaint</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>

              {/* Right Column: Service Routing Overview (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-white border border-gray-200 rounded-fluent-lg p-6 shadow-fluent-2 sticky top-24">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 text-base">Automatic Dispatch Preview</h3>
                    {isPreviewLoading ? (
                      <span className="text-xs text-[#0078d4] font-medium animate-pulse">Evaluating...</span>
                    ) : (
                      <span className="text-xs text-gray-500">Live</span>
                    )}
                  </div>

                  {dispatchPreview ? (
                    <div className="mt-4 space-y-3 text-sm">
                      
                      <div className="p-3 bg-[#fafafa] rounded border border-gray-200">
                        <span className="text-xs text-gray-500 block mb-1">Assessed Urgency</span>
                        <div className="flex items-center justify-between">
                          <div>{getSeverityBadge(dispatchPreview.severity)}</div>
                          <span className="text-xs text-gray-600 font-medium">
                            Category: <strong className="text-gray-900">{dispatchPreview.category}</strong>
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 mt-2 bg-white p-2.5 rounded border border-gray-200">
                          {dispatchPreview.reason}
                        </p>
                      </div>

                      <div className="p-3 bg-[#fafafa] rounded border border-gray-200">
                        <span className="text-xs text-gray-500 block mb-1">Designated Department</span>
                        <div className="flex items-center space-x-2 text-[#0078d4] font-semibold text-xs">
                          <Building2 className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{dispatchPreview.department}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#fafafa] rounded border border-gray-200">
                        <span className="text-xs text-gray-500 block mb-1">Issue Summary</span>
                        <p className="text-xs text-gray-700 italic">
                          "{dispatchPreview.summary}"
                        </p>
                      </div>

                    </div>
                  ) : (
                    <div className="py-10 text-center text-gray-500">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Start describing your complaint to preview the automatically assigned department and priority.
                      </p>
                    </div>
                  )}

                  <div className="mt-5 pt-3 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                    <span className="font-semibold text-gray-700 block">Service Assurance</span>
                    <p>
                      Every complaint is logged with an immutable tracking ID and deterministically routed to city engineers.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      ) : (
        /* Status Tracker Tab */
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-fluent-lg shadow-fluent-2">
            <h2 className="text-xl font-bold text-[#242424] mb-1">Track Your Service Ticket</h2>
            <p className="text-gray-600 text-xs mb-4">
              Enter your Complaint Number (e.g. <span className="font-semibold text-[#0078d4]">CMP-8801</span>) or Service Ticket ID (e.g. <span className="font-semibold text-[#0078d4]">TKT-1001</span>).
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={searchTicketId}
                onChange={(e) => setSearchTicketId(e.target.value.toUpperCase())}
                placeholder="Enter CMP-xxxx or TKT-xxxx"
                className="flex-1 bg-white border border-gray-300 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] rounded-fluent-sm px-3.5 py-2 text-sm text-gray-900 uppercase font-mono"
              />
              <button
                type="button"
                onClick={() => handleTrackTicket()}
                disabled={trackerLoading}
                className="px-5 py-2 fluent-btn-primary text-sm flex items-center space-x-1.5"
              >
                {trackerLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>

            {trackerError && (
              <p className="mt-3 text-xs text-[#c42b1c] font-medium">{trackerError}</p>
            )}
          </div>

          {/* Tracked Ticket Card */}
          {trackedTicket && (
            <div className="bg-white border border-gray-200 p-6 rounded-fluent-lg shadow-fluent-2 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 block">Service Ticket ID</span>
                  <h3 className="text-xl font-mono font-bold text-gray-900">{trackedTicket.id}</h3>
                </div>
                <div>{getSeverityBadge(trackedTicket.severity)}</div>
              </div>

              {/* Resolution Stepper */}
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
                  Resolution Stepper
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`p-3 rounded border text-center ${
                    ['Pending', 'In Progress', 'Resolved'].includes(trackedTicket.status)
                      ? 'bg-[#eff6fc] border-[#b4d6fa] text-[#0078d4]'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}>
                    <span className="text-xs font-bold block">1. Received</span>
                    <span className="text-[10px] text-gray-500">Triage Complete</span>
                  </div>

                  <div className={`p-3 rounded border text-center ${
                    ['In Progress', 'Resolved'].includes(trackedTicket.status)
                      ? 'bg-[#eff6fc] border-[#b4d6fa] text-[#0078d4]'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}>
                    <span className="text-xs font-bold block">2. In Progress</span>
                    <span className="text-[10px] text-gray-500">Field Dispatch</span>
                  </div>

                  <div className={`p-3 rounded border text-center ${
                    trackedTicket.status === 'Resolved'
                      ? 'bg-[#dff6dd] border-[#a8e5ab] text-[#107c41]'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}>
                    <span className="text-xs font-bold block">3. Resolved</span>
                    <span className="text-[10px] text-gray-500">Work Finished</span>
                  </div>
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#fafafa] p-3 rounded border border-gray-200">
                  <span className="text-gray-500 block mb-0.5">Assigned Department</span>
                  <span className="font-semibold text-gray-900">{trackedTicket.department}</span>
                </div>
                <div className="bg-[#fafafa] p-3 rounded border border-gray-200">
                  <span className="text-gray-500 block mb-0.5">Ward & Location</span>
                  <span className="font-semibold text-gray-900">
                    {trackedTicket.complaint?.ward} • {trackedTicket.complaint?.location}
                  </span>
                </div>
              </div>

              {/* Original Complaint */}
              <div className="bg-[#fafafa] p-4 rounded border border-gray-200 text-sm">
                <span className="text-xs text-gray-500 block mb-1">Submitted Description</span>
                <p className="text-gray-900 leading-relaxed">
                  {trackedTicket.complaint?.originalText}
                </p>
                {trackedTicket.complaint?.photoUrl && (
                  <div className="mt-3">
                    <img
                      src={trackedTicket.complaint.photoUrl}
                      alt="Submitted evidence"
                      className="w-32 h-24 object-cover rounded border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Activity Timeline */}
              {trackedTicket.activityLogs && trackedTicket.activityLogs.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                    Action Timeline
                  </span>
                  <div className="space-y-2">
                    {trackedTicket.activityLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-[#fafafa] rounded border border-gray-200 text-xs flex items-start justify-between">
                        <div>
                          <span className="font-semibold text-gray-900">{log.action}: {log.performedBy}</span>
                          <p className="text-gray-600 mt-0.5">{log.details}</p>
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

    </div>
  );
}
