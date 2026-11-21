import React from 'react';
import { CopyCheck, ExternalLink, AlertTriangle, ShieldCheck, ArrowRight, MapPin } from 'lucide-react';

export default function DuplicateClustersView({ duplicateGroups = [], onSelectTicket }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart Duplicate Incident Clusters
          </h1>
          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold rounded">
            AI CLUSTERING
          </span>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          CivicLens detects semantic and spatial overlap across citizen submissions to prevent duplicate field dispatches while keeping all records intact.
        </p>
      </div>

      {/* Preservation Policy Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl text-xs text-blue-300 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-white text-sm mb-0.5">Municipal Preservation Policy</span>
          <p className="text-blue-200/90 leading-relaxed">
            Duplicate detection groups related citizen reports under a single master operational ticket for field crews. In accordance with civic transparency standards, duplicate submissions are <strong>never silently deleted or discarded</strong>.
          </p>
        </div>
      </div>

      {/* Clusters List */}
      {duplicateGroups && duplicateGroups.length > 0 ? (
        <div className="space-y-6">
          {duplicateGroups.map((group) => (
            <div key={group.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <CopyCheck className="w-5 h-5 text-amber-400" />
                  <span className="font-mono font-bold text-white text-sm">Incident Group: {group.id}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-400">
                    Composite Match Score: <strong className="text-amber-300 font-mono">{Math.round((group.similarityScore || 0.8) * 100)}%</strong>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-mono">
                    {new Date(group.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Duplicate Reason */}
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-200">
                <strong>Clustering Justification:</strong> {group.detectedReason || 'High semantic text overlap within the same municipal ward.'}
              </div>

              {/* Primary Ticket vs Related Tickets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Primary Master Ticket */}
                <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                      Primary Master Ticket
                    </span>
                    <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded text-[10px] font-mono">
                      Lead Dispatch
                    </span>
                  </div>

                  {group.primaryTicket ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white text-sm">{group.primaryTicket.id}</span>
                        <span className="text-xs text-slate-400">{group.primaryTicket.category}</span>
                      </div>
                      <p className="text-xs text-slate-200 mt-1 font-medium line-clamp-2">
                        {group.primaryTicket.summary}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                        <span className="text-slate-400">{group.primaryTicket.department}</span>
                        <button
                          onClick={() => onSelectTicket(group.primaryTicket.id)}
                          className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center space-x-1"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">{group.primaryTicketId}</span>
                  )}
                </div>

                {/* Related Submissions */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Related Citizen Reports ({group.relatedTicketIds?.length || 0})
                    </span>
                    <span className="text-[10px] text-slate-500">Grouped for Context</span>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {group.relatedTickets && group.relatedTickets.length > 0 ? (
                      group.relatedTickets.map((t) => (
                        <div key={t.id} className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-white">{t.id}</span>
                            <p className="text-slate-400 text-[11px] truncate max-w-[200px]">{t.summary}</p>
                          </div>
                          <button
                            onClick={() => onSelectTicket(t.id)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500">
                        Related Tickets: {group.relatedTicketIds?.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <CopyCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <h3 className="text-base font-bold text-white mb-1">No Duplicate Incidents Currently Detected</h3>
          <p className="text-xs max-w-md mx-auto">
            When multiple citizens submit complaints regarding the same incident (e.g. identical pothole or fallen tree within the same ward), CivicLens AI automatically groups them here.
          </p>
        </div>
      )}

    </div>
  );
}
