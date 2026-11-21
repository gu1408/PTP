import React from 'react';
import { CopyCheck, ExternalLink, ShieldCheck, MapPin, Info } from 'lucide-react';

export default function DuplicateClustersView({ duplicateGroups = [], onSelectTicket }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
          Duplicate Incident Clusters
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Automated grouping of multiple citizen reports describing the same physical incident to streamline field dispatch.
        </p>
      </div>

      {/* Municipal Preservation Policy Callout */}
      <div className="bg-[#eff6fc] border border-[#b4d6fa] p-4 rounded-fluent-md text-xs text-[#005a9e] flex items-start space-x-3">
        <Info className="w-5 h-5 text-[#0078d4] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-gray-900 text-sm mb-0.5">Municipal Non-Destructive Grouping Policy</span>
          <p className="text-gray-700 leading-relaxed">
            Duplicate detection clusters related reports under a single master operational work order. In compliance with municipal transparency standards, duplicate submissions are <strong>never silently deleted or discarded</strong>. Every citizen ticket retains an active tracking record.
          </p>
        </div>
      </div>

      {/* Clusters List */}
      {duplicateGroups && duplicateGroups.length > 0 ? (
        <div className="space-y-5">
          {duplicateGroups.map((group) => (
            <div key={group.id} className="bg-white border border-gray-200 rounded-fluent-lg p-5 shadow-fluent-2 space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <CopyCheck className="w-5 h-5 text-[#8a6100]" />
                  <span className="font-mono font-bold text-gray-900 text-sm">Cluster Group: {group.id}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-gray-600">
                    Composite Match: <strong className="text-[#8a6100] font-bold bg-[#fff4ce] px-2 py-0.5 rounded border border-[#feec9e]">{Math.round((group.similarityScore || 0.8) * 100)}%</strong>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500 font-mono">
                    {new Date(group.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Duplicate Reason Explanation */}
              <div className="p-3 bg-[#fafafa] border border-gray-200 rounded text-xs text-gray-800 leading-relaxed">
                <strong className="text-gray-900">Grouping Rationale:</strong> {group.detectedReason || 'High semantic text overlap within the same municipal ward.'}
              </div>

              {/* Primary Master Ticket vs Related Tickets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Primary Master Ticket */}
                <div className="bg-[#eff6fc]/30 border-l-4 border-l-[#0078d4] border-y border-r border-gray-200 p-4 rounded-fluent-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0078d4]">
                      Master Complaint (Lead Dispatch)
                    </span>
                    <span className="px-2 py-0.5 bg-[#eff6fc] border border-[#b4d6fa] text-[#0078d4] rounded text-[10px] font-semibold">
                      Primary Work Order
                    </span>
                  </div>

                  {group.primaryTicket ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-gray-900 text-sm">{group.primaryTicket.id}</span>
                        <span className="text-xs text-gray-600">{group.primaryTicket.category}</span>
                      </div>
                      <p className="text-xs text-gray-800 mt-1 font-medium line-clamp-2">
                        {group.primaryTicket.summary}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-gray-200">
                        <span className="text-gray-600">{group.primaryTicket.department}</span>
                        <button
                          type="button"
                          onClick={() => onSelectTicket(group.primaryTicket.id)}
                          className="fluent-btn-secondary px-2.5 py-1 text-xs inline-flex items-center space-x-1"
                        >
                          <span>Inspect Master</span>
                          <ExternalLink className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 font-mono">{group.primaryTicketId}</span>
                  )}
                </div>

                {/* Related Submissions */}
                <div className="bg-white p-4 rounded-fluent-md border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Related Citizen Reports ({group.relatedTicketIds?.length || 0})
                    </span>
                    <span className="text-[10px] text-gray-500">Clustered Submissions</span>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {group.relatedTickets && group.relatedTickets.length > 0 ? (
                      group.relatedTickets.map((t) => (
                        <div key={t.id} className="p-2.5 bg-[#fafafa] rounded border border-gray-200 text-xs flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-gray-900">{t.id}</span>
                            <p className="text-gray-600 text-[11px] truncate max-w-[200px]">{t.summary}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onSelectTicket(t.id)}
                            className="p-1 text-gray-500 hover:text-gray-900"
                            title="Inspect related ticket"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500">
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
        <div className="bg-white border border-gray-200 rounded-fluent-lg p-12 text-center text-gray-500 shadow-fluent-2">
          <CopyCheck className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-400" />
          <h3 className="text-base font-bold text-gray-900 mb-1">No Duplicate Incidents Currently Detected</h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
            When multiple citizens submit reports regarding the same localized issue (such as identical road craters or tree blockages), CivicLens automatically clusters them here.
          </p>
        </div>
      )}

    </div>
  );
}
