import React, { useState, useEffect } from 'react';
import { X, Key, Sparkles, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, onResetData, onAiConfigChanged, aiStatus }) {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [statusInfo, setStatusInfo] = useState(aiStatus);

  useEffect(() => {
    setStatusInfo(aiStatus);
  }, [aiStatus, isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      // Configure key securely on the backend server
      const res = await fetch('/api/ai/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() || null })
      });
      const data = await res.json();
      if (data.success) {
        setStatusInfo(data);
        if (onAiConfigChanged) onAiConfigChanged(data);
        setSavedSuccess(true);
        setApiKey(''); // Clear input after submission for security
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update AI config on backend', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Are you sure you want to reset all complaints & tickets to default factory demo seed data?')) {
      return;
    }
    try {
      setIsResetting(true);
      const res = await fetch('/api/seed/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResetMessage('Database reset successfully!');
        if (onResetData) onResetData();
        setTimeout(() => setResetMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to reset', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Backend AI Engine Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gemini API Key Form (Strictly Server-Side) */}
        <form onSubmit={handleSaveKey} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1">
              Google Gemini API Key (Server Environment)
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Keys are strictly maintained on the backend server. When not configured, CivicLens safely routes all tickets using its deterministic Rule & Multi-Lingual Semantic NLP engine.
            </p>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste Gemini API key to activate Cloud AI..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Active Backend Engine</span>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${statusInfo?.status === 'cloud_active' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="text-white font-medium">{statusInfo?.activeEngine || 'CivicLens Rule & Semantic NLP Engine (Local Fallback)'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              {statusInfo?.status === 'cloud_active' ? 'Cloud Generative AI Active' : 'Fallback Mode Active'}
            </span>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              {isSaving ? (
                <span>Validating...</span>
              ) : (
                <span>Update Backend Key</span>
              )}
            </button>
          </div>

          {savedSuccess && (
            <p className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Backend AI configuration updated successfully!</span>
            </p>
          )}
        </form>

        {/* Factory Reset Demo Data */}
        <div className="pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-300 block mb-1">Demo Environment Controls</span>
          <p className="text-[11px] text-slate-400 mb-3">
            Reset ticket queues and metrics back to the default competition seed tickets.
          </p>

          <button
            type="button"
            onClick={handleResetData}
            disabled={isResetting}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/40 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isResetting ? 'Resetting...' : 'Reset to Default Competition Seeds'}</span>
          </button>

          {resetMessage && (
            <p className="mt-2 text-xs text-emerald-400 font-medium text-center">{resetMessage}</p>
          )}
        </div>

      </div>
    </div>
  );
}
