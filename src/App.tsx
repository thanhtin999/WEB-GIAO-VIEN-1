/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewModule } from './components/dashboard/OverviewModule';
import { ClassStudentModule } from './components/classes/ClassStudentModule';
import { GradebookModule } from './components/grades/GradebookModule';
import { CompetencyModule } from './components/competency/CompetencyModule';
import { AssignmentModule } from './components/assignments/AssignmentModule';
import { LibraryModule } from './components/library/LibraryModule';
import { AIAssistantModule } from './components/ai/AIAssistantModule';
import { ReportModule } from './components/reports/ReportModule';
import { SystemConfigModal } from './components/common/SystemConfigModal';
import { StudentProfileModal } from './components/classes/StudentProfileModal';

const MainLayout: React.FC = () => {
  const { activeModule, openStudentProfileId, setOpenStudentProfileId } = useApp();
  const [showDbModal, setShowDbModal] = useState(false);

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'overview':
        return <OverviewModule />;
      case 'classes':
        return <ClassStudentModule />;
      case 'gradebook':
        return <GradebookModule />;
      case 'competency':
        return <CompetencyModule />;
      case 'assignments':
        return <AssignmentModule />;
      case 'library':
        return <LibraryModule />;
      case 'ai':
        return <AIAssistantModule />;
      case 'reports':
        return <ReportModule />;
      default:
        return <OverviewModule />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F7FF] text-[#132B50]">
      {/* Sidebar Navigation (Fixed left ~260px) */}
      <Sidebar />

      {/* Main Content Area (Header + Scrollable Body) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header onOpenDbModal={() => setShowDbModal(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7">
          {renderModuleContent()}
        </main>
      </div>

      {/* Database & Firebase Configuration Modal */}
      {showDbModal && <SystemConfigModal onClose={() => setShowDbModal(false)} />}

      {/* Student Profile Modal */}
      {openStudentProfileId && (
        <StudentProfileModal
          studentId={openStudentProfileId}
          onClose={() => setOpenStudentProfileId(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
