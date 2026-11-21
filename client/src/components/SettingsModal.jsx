import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck, Sliders, Info } from 'lucide-react';

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
        setApiKey('');
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update AI config on backend', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset all ticket records and queues back to default municipal seeds?')) {
      return;
    }
    try {
      setIsResetting(true);
      const res = await fetch('/api/seed/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResetMessage('Database reset successfully.');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-fluent-lg w-full max-w-md shadow-fluent-16 p-6 space-y-5">
        
        {/* Dialog Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-[#0078d4]" />
            <h3 className="font-bold text-gray-900 text-base">Municipal System Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gemini API Key Form */}
        <form onSubmit={handleSaveKey} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-800 block mb-1">
              Google Gemini Cloud API Key (Server Environment)
            </label>
            <p className="text-[11px] text-gray-500 mb-2 leading-relaxed">
              Keys remain securely stored on the backend. When no key is set, CivicLens uses its built-in rule and semantic NLP triage engine.
            </p>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste Gemini API key to activate Cloud AI..."
                className="w-full bg-white border border-gray-300 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] rounded-fluent-sm pl-9 pr-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-[#fafafa] rounded border border-gray-200 text-xs space-y-1">
            <span className="text-gray-500 block text-[10px] uppercase tracking-wider font-semibold">Active Backend Engine</span>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${statusInfo?.status === 'cloud_active' ? 'bg-[#107c41]' : 'bg-[#8a6100]'}`}></span>
              <span className="text-gray-800 font-medium">{statusInfo?.activeEngine || 'CivicLens Rule & Semantic NLP Engine (Local Fallback)'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-gray-500">
              {statusInfo?.status === 'cloud_active' ? 'Cloud Generative AI Active' : 'Local Fallback Active'}
            </span>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-1.5 fluent-btn-primary text-xs flex items-center space-x-1.5"
            >
              {isSaving ? (
                <span>Validating...</span>
              ) : (
                <span>Save Key to Backend</span>
              )}
            </button>
          </div>

          {savedSuccess && (
            <p className="text-xs text-[#107c41] font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Backend configuration saved.</span>
            </p>
          )}
        </form>

        {/* Demo Environment Controls */}
        <div className="pt-4 border-t border-gray-200">
          <span className="text-xs font-semibold text-gray-800 block mb-1">Demo Environment Reset</span>
          <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
            Reset ticket queues and metrics back to the initial seed state.
          </p>

          <button
            type="button"
            onClick={handleResetData}
            disabled={isResetting}
            className="w-full py-1.5 px-3 fluent-btn-secondary text-xs flex items-center justify-center space-x-2 text-gray-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>{isResetting ? 'Resetting...' : 'Reset to Default Competition Seeds'}</span>
          </button>

          {resetMessage && (
            <p className="mt-2 text-xs text-[#107c41] font-medium text-center">{resetMessage}</p>
          )}
        </div>

      </div>
    </div>
  );
}
