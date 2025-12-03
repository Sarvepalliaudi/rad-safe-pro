import React, { useState } from 'react';
import { Menu, ChevronLeft } from 'lucide-react';
import Sidebar from './components/Sidebar';
import LearningContent from './components/LearningContent';
import DoseCalculator from './components/DoseCalculator';
import AIDosePredictor from './components/AIDosePredictor';
import Quiz from './components/Quiz';
import Spotters from './components/Spotters';
import StartScreen from './components/StartScreen';
import Dashboard from './components/Dashboard';
import Downloads from './components/Downloads';
import Guide from './components/Guide';
import { CONTENT_SECTIONS, QUIZ_QUESTIONS } from './constants';
import { ViewState } from './types';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('START');
  const [activeSectionId, setActiveSectionId] = useState<string>('intro');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleStart = () => setViewState('DASHBOARD');

  const handleNavigate = (id: string) => {
    setActiveSectionId(id);
    setViewState('SECTION');
  };

  const handleBackToDashboard = () => {
    setViewState('DASHBOARD');
  };

  const renderContent = () => {
    switch (activeSectionId) {
      case 'calculator': return <DoseCalculator />;
      case 'ai-predict': return <AIDosePredictor />;
      case 'quiz': return <Quiz allQuestions={QUIZ_QUESTIONS} onExit={handleBackToDashboard} />;
      case 'spotters': return <Spotters />;
      case 'downloads': return <Downloads />;
      case 'guide': return <Guide />;
      default:
        const section = CONTENT_SECTIONS.find(s => s.id === activeSectionId);
        return section ? <LearningContent section={section} /> : <div>Section not found</div>;
    }
  };

  if (viewState === 'START') {
    return <StartScreen onStart={handleStart} />;
  }

  // Mobile layout wrapper
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar is only visible on Desktop or when toggled */}
      <div className="hidden md:block">
        <Sidebar 
          sections={CONTENT_SECTIONS}
          activeSection={activeSectionId}
          onSelectSection={handleNavigate}
          isOpen={true}
          toggleSidebar={() => {}}
        />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <div className="md:hidden">
         <Sidebar 
          sections={CONTENT_SECTIONS}
          activeSection={activeSectionId}
          onSelectSection={(id) => { handleNavigate(id); setIsSidebarOpen(false); }}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <div className="flex-1 md:ml-64 flex flex-col min-w-0 transition-all duration-300">
        {/* Header */}
        <div className="bg-white p-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-20 shadow-sm">
           <div className="flex items-center gap-2">
             {viewState === 'SECTION' && (
               <button onClick={handleBackToDashboard} className="md:hidden p-2 text-slate-600 hover:bg-gray-100 rounded-lg">
                 <ChevronLeft size={24} />
               </button>
             )}
             <h1 className="font-bold text-rad-600 text-lg">RAD SAFE PRO</h1>
           </div>
           
           <button onClick={toggleSidebar} className="md:hidden text-slate-600 p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        {/* Main Content Area */}
        <main className="p-4 md:p-8 max-w-6xl mx-auto w-full animate-fade-in flex-1">
          {viewState === 'DASHBOARD' ? (
            <Dashboard onNavigate={handleNavigate} sections={CONTENT_SECTIONS} />
          ) : (
            renderContent()
          )}
        </main>

        {viewState === 'DASHBOARD' && (
           <footer className="py-6 text-center text-xs text-slate-400 border-t border-gray-200 bg-white">
            <p>© {new Date().getFullYear()} RAD SAFE PRO. Version 1.0.0</p>
          </footer>
        )}
      </div>
    </div>
  );
};

export default App;