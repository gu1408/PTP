import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CitizenPortal from './components/CitizenPortal';
import OfficerDashboard from './components/OfficerDashboard';
import AnalyticsView from './components/AnalyticsView';
import DuplicateClustersView from './components/DuplicateClustersView';
import TicketDetailModal from './components/TicketDetailModal';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' | 'officer' | 'analytics' | 'duplicates'
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [initialTrackId, setInitialTrackId] = useState('');
  const [aiStatus, setAiStatus] = useState(null);

  // Initial data load
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // 1. Fetch tickets
      const resTickets = await fetch('/api/tickets');
      const dataTickets = await resTickets.json();
      if (dataTickets.success) {
        setTickets(dataTickets.tickets);
      }

      // 2. Fetch analytics
      const resAnalytics = await fetch('/api/analytics');
      const dataAnalytics = await resAnalytics.json();
      if (dataAnalytics.success) {
        setAnalytics(dataAnalytics.analytics);
      }

      // 3. Fetch duplicate groups
      const resDuplicates = await fetch('/api/duplicate-groups');
      const dataDuplicates = await resDuplicates.json();
      if (dataDuplicates.success) {
        setDuplicateGroups(dataDuplicates.duplicateGroups);
      }

      // 4. Fetch AI Engine Status
      const resAi = await fetch('/api/ai/status');
      const dataAi = await resAi.json();
      if (dataAi.success) {
        setAiStatus(dataAi);
      }
    } catch (err) {
      console.error('Error loading CivicLens data:', err);
    }
  };

  const handleQuickUpdateStatus = async (ticketId, newStatus) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          performedBy: 'Officer Quick Dispatch'
        })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleComplaintSubmitted = (newTicket) => {
    fetchAllData();
  };

  const handleTrackTicketFromCitizen = (ticketId) => {
    setInitialTrackId(ticketId);
    setActiveTab('citizen');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#242424] flex flex-col font-sans selection:bg-[#0078d4] selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={analytics?.metrics}
        openSettings={() => setIsSettingsOpen(true)}
        aiStatus={aiStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'citizen' && (
          <CitizenPortal
            onComplaintSubmitted={handleComplaintSubmitted}
            onTrackTicketId={handleTrackTicketFromCitizen}
            initialTrackId={initialTrackId}
          />
        )}

        {activeTab === 'officer' && (
          <OfficerDashboard
            tickets={tickets}
            metrics={analytics?.metrics}
            onRefresh={fetchAllData}
            onSelectTicket={(id) => setSelectedTicketId(id)}
            onQuickUpdateStatus={handleQuickUpdateStatus}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            analytics={analytics}
          />
        )}

        {activeTab === 'duplicates' && (
          <DuplicateClustersView
            duplicateGroups={duplicateGroups}
            onSelectTicket={(id) => setSelectedTicketId(id)}
          />
        )}
      </main>

      {/* Ticket Details Inspection Modal */}
      {selectedTicketId && (
        <TicketDetailModal
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          onTicketUpdated={() => fetchAllData()}
          onViewDuplicateGroup={(dupId) => {
            setSelectedTicketId(null);
            setActiveTab('duplicates');
          }}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetData={() => fetchAllData()}
        onAiConfigChanged={() => fetchAllData()}
        aiStatus={aiStatus}
      />

      {/* Fluent 2 Municipal Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-gray-600">CivicLens Platform • Municipal Complaint Management System</span>
          <span className="text-[11px] text-gray-400">Powered by Microsoft Fluent 2 Design System</span>
        </div>
      </footer>

    </div>
  );
}
