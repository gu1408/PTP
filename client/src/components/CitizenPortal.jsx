import React, { useState, useEffect } from 'react';
import {
  Send,
  Upload,
  Image,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  Clock,
  Building2,
  ShieldAlert,
  ArrowRight,
  X,
  FileText,
  Languages
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

  // Live AI Preview State
  const [aiPreview, setAiPreview] = useState(null);
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

  // Debounced AI Preview as user writes complaint description
  useEffect(() => {
    if (!text || text.trim().length < 15) {
      setAiPreview(null);
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
          setAiPreview(data.aiResult);
        }
      } catch (err) {
        console.error('AI preview failed', err);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [text, location]);

  // Apply one of the 6 official mandatory test presets
  const handleLoadPreset = (preset) => {
    setText(preset.text);
    setWard(preset.ward);
    setLocation(preset.location);
    setPhotoUrl(preset.photoUrl);
    setErrorMsg('');
  };

  // Handle Photo File Upload (Convert to base64 with strict type & size validation)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate MIME types
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!validMimes.includes(file.type)) {
      setErrorMsg('Invalid file format. Please upload an image file (JPEG, PNG, WEBP, GIF).');
      return;
    }

    // Validate size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size exceeds maximum limit of 5MB. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result);
      setErrorMsg('');
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read image file. Please try another photograph.');
    };
    reader.readAsDataURL(file);
  };

  // Submit Complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setErrorMsg('Please describe the civic complaint before submitting.');
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
        throw new Error(data.error || 'Failed to submit complaint');
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
    const id = idToSearch || searchTicketId;
    if (!id || !id.trim()) {
      setTrackerError('Please enter a Complaint ID or Ticket ID.');
      return;
    }

    setTrackerLoading(true);
    setTrackerError('');
    setTrackedTicket(null);

    try {
      const res = await fetch(`/api/tickets/${id.trim()}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No matching ticket found for that ID.');
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
        return <span className="px-2.5 py-1 text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 rounded-full">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2.5 py-1 text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-full">HIGH PRIORITY</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">MEDIUM</span>;
      case 'LOW':
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">LOW</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Sub Tabs: Submit vs Track */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-slate-800/90 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveSubTab('submit')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeSubTab === 'submit'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            File New Complaint
          </button>
          <button
            onClick={() => setActiveSubTab('track')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeSubTab === 'track'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Track Status by ID
          </button>
        </div>
      </div>

      {activeSubTab === 'submit' ? (
        <div>
          {/* Submission Success State */}
          {submissionResult ? (
            <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h2 className="text-2xl font-bold text-white">Complaint Registered & Triaged!</h2>
                <p className="text-slate-400 text-sm mt-1">
                  CivicLens AI has analyzed, prioritized, and routed your issue to municipal field engineers.
                </p>
              </div>

              {/* Ticket Summary Card */}
              <div className="bg-slate-800/80 rounded-xl p-6 border border-slate-700/80 mb-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-700 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Complaint ID</span>
                    <span className="font-mono font-bold text-white text-sm">{submissionResult.complaint.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Service Ticket</span>
                    <span className="font-mono font-bold text-blue-400 text-sm">{submissionResult.ticket.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">AI Severity</span>
                    <div>{getSeverityBadge(submissionResult.ticket.severity)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">AI Confidence</span>
                    <span className="font-semibold text-emerald-400 text-sm">
                      {Math.round((submissionResult.ticket.aiConfidence || 0.95) * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">Routed Municipal Department</span>
                  <div className="flex items-center space-x-2 text-white font-semibold">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>{submissionResult.ticket.department}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block mb-1">AI Severity Justification</span>
                  <p className="text-sm text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    "{submissionResult.ticket.reason}"
                  </p>
                </div>

                {submissionResult.duplicateInfo?.isDuplicate && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-lg text-xs text-amber-300">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Probable Duplicate Incident Grouped</span>
                      </div>
                      <span className="font-mono font-bold text-xs bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                        {Math.round((submissionResult.duplicateInfo.similarityScore || 0.8) * 100)}% Match
                      </span>
                    </div>
                    <p className="text-amber-200/90 leading-relaxed">
                      {submissionResult.duplicateInfo.reason || `Matches active ticket ${submissionResult.duplicateInfo.matchedTicketId}. Grouped for officer review without being discarded.`}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchTicketId(submissionResult.ticket.id);
                    setActiveSubTab('track');
                    handleTrackTicket(submissionResult.ticket.id);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Live Ticket Status</span>
                </button>

                <button
                  onClick={() => {
                    setSubmissionResult(null);
                    setText('');
                    setPhotoUrl('');
                    setAiPreview(null);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition-colors"
                >
                  Submit Another Complaint
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Form & Presets (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Hero Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-Time Generative AI Triage</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Citizen Complaint Portal
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">
                    Describe your municipal issue in English or regional languages (Kannada/Hindi). CivicLens AI automatically classifies, prioritizes, and routes your ticket to the right department.
                  </p>

                  {/* 1-Click Test Presets */}
                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Instant Test Scenarios (1-Click Fill)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {TEST_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleLoadPreset(preset)}
                          className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            preset.severity === 'CRITICAL' ? 'bg-red-500' :
                            preset.severity === 'HIGH' ? 'bg-orange-500' :
                            preset.severity === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}></span>
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submission Form */}
                <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-medium flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Complaint Description */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-slate-200">
                        Complaint Description <span className="text-red-400">*</span>
                      </label>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-blue-400 rounded flex items-center space-x-1">
                          <Languages className="w-3 h-3" />
                          <span>Detected: {detectedLang}</span>
                        </span>
                        <span className="text-slate-400">{text.length} chars</span>
                      </div>
                    </div>
                    <textarea
                      rows={4}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="e.g. Exposed live wire hanging near school gate with sparks, or ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ ಬಿದ್ದಿದೆ..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Ward and Location Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-200 block mb-1.5">
                        Municipal Ward <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-2.5 text-sm text-slate-200"
                      >
                        {MUNICIPAL_WARDS.map((w) => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-200 block mb-1.5">
                        Specific Location / Landmark
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. 4th Cross, Opposite School Gate"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload Section */}
                  <div>
                    <label className="text-sm font-semibold text-slate-200 block mb-1.5">
                      Incident Photograph (Optional Evidence)
                    </label>

                    {photoUrl ? (
                      <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={photoUrl}
                            alt="Incident Evidence"
                            className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                          />
                          <div>
                            <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Photo Attached</span>
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">Ready for automated inspection</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60 rounded-xl p-4 text-center cursor-pointer transition-colors">
                        <label className="cursor-pointer block">
                          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                          <span className="text-xs text-slate-300 font-medium block">
                            Click to upload image or drag & drop
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">PNG, JPG up to 5MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !text.trim()}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Processing AI Triage...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Municipal Complaint</span>
                      </>
                    )}
                  </button>
                </form>

              </div>

              {/* Right Column: Live AI Triage Inspector (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      <h3 className="font-bold text-white text-base">Live AI Triage Inspector</h3>
                    </div>
                    {isPreviewLoading ? (
                      <span className="text-xs font-mono text-blue-400 animate-pulse">Analyzing...</span>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400">Ready</span>
                    )}
                  </div>

                  {aiPreview ? (
                    <div className="mt-5 space-y-4">
                      
                      {/* Predicted Severity */}
                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">Assessed Severity</span>
                        <div className="flex items-center justify-between">
                          <div>{getSeverityBadge(aiPreview.severity)}</div>
                          <span className="text-xs font-mono text-slate-400">
                            Risk Score: <strong className="text-white">{aiPreview.priority_score}/100</strong>
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2.5 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          {aiPreview.reason}
                        </p>
                      </div>

                      {/* Predicted Category & Department */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block mb-1">Category</span>
                          <span className="font-semibold text-white text-sm">{aiPreview.category}</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block mb-1">AI Confidence</span>
                          <span className="font-semibold text-emerald-400 text-sm">
                            {Math.round((aiPreview.confidence || 0.95) * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Routed Department */}
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">Auto-Routed Department</span>
                        <div className="flex items-center space-x-2 text-blue-400 font-semibold text-xs">
                          <Building2 className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{aiPreview.department}</span>
                        </div>
                      </div>

                      {/* Normalized Summary */}
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">Normalized Officer Summary</span>
                        <p className="text-xs text-slate-200 italic">
                          "{aiPreview.summary}"
                        </p>
                      </div>

                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-500">
                      <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      <p className="text-xs">Type your complaint or click any test scenario above to see live AI classification in real time.</p>
                    </div>
                  )}

                  {/* Explanatory Feature Callout */}
                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                      <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                      <span>Deterministic Triage Guarantee</span>
                    </div>
                    <p>
                      Official categories deterministically bind to civic departments according to municipal dispatch policy.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      ) : (
        /* Status Tracker Tab */
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">Track Your Civic Complaint</h2>
            <p className="text-slate-400 text-xs mb-4">
              Enter your Complaint ID (e.g. <span className="font-mono text-blue-400">CMP-8801</span>) or Ticket ID (e.g. <span className="font-mono text-blue-400">TKT-1001</span>).
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={searchTicketId}
                onChange={(e) => setSearchTicketId(e.target.value)}
                placeholder="Enter CMP-xxxx or TKT-xxxx"
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 uppercase font-mono"
              />
              <button
                onClick={() => handleTrackTicket()}
                disabled={trackerLoading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center space-x-2"
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
              <p className="mt-3 text-xs text-red-400 font-medium">{trackerError}</p>
            )}
          </div>

          {/* Tracked Ticket Result */}
          {trackedTicket && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs text-slate-400">Service Ticket ID</span>
                  <h3 className="text-xl font-mono font-bold text-white">{trackedTicket.id}</h3>
                </div>
                <div>{getSeverityBadge(trackedTicket.severity)}</div>
              </div>

              {/* Status Stepper */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-4">
                  Resolution Progress
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`p-3 rounded-xl border text-center ${
                    ['Pending', 'In Progress', 'Resolved'].includes(trackedTicket.status)
                      ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    <span className="text-xs font-bold block">1. Triaged</span>
                    <span className="text-[10px] text-slate-400">AI Verified</span>
                  </div>

                  <div className={`p-3 rounded-xl border text-center ${
                    ['In Progress', 'Resolved'].includes(trackedTicket.status)
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    <span className="text-xs font-bold block">2. In Progress</span>
                    <span className="text-[10px] text-slate-400">Field Dispatch</span>
                  </div>

                  <div className={`p-3 rounded-xl border text-center ${
                    trackedTicket.status === 'Resolved'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    <span className="text-xs font-bold block">3. Resolved</span>
                    <span className="text-[10px] text-slate-400">Action Complete</span>
                  </div>
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Assigned Department</span>
                  <span className="font-semibold text-white">{trackedTicket.department}</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Ward & Location</span>
                  <span className="font-semibold text-white">
                    {trackedTicket.complaint?.ward} • {trackedTicket.complaint?.location}
                  </span>
                </div>
              </div>

              {/* Original Complaint */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Original Complaint Text ({trackedTicket.complaint?.language})</span>
                <p className="text-sm text-slate-200">
                  {trackedTicket.complaint?.originalText}
                </p>
                {trackedTicket.complaint?.photoUrl && (
                  <div className="mt-3">
                    <img
                      src={trackedTicket.complaint.photoUrl}
                      alt="Submitted evidence"
                      className="w-32 h-24 object-cover rounded-lg border border-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* Activity Timeline */}
              {trackedTicket.activityLogs && trackedTicket.activityLogs.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                    Audit Log & Activity
                  </span>
                  <div className="space-y-2">
                    {trackedTicket.activityLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs flex items-start justify-between">
                        <div>
                          <span className="font-semibold text-white">{log.action}: {log.performedBy}</span>
                          <p className="text-slate-400 mt-0.5">{log.details}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
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
