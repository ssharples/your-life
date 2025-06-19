
import { useState, useEffect } from 'react';
import { FloatingNav } from './FloatingNav';
import { SearchButton } from './SearchButton';
import { Overview } from './modules/Overview';
import { Analytics } from './modules/Analytics';
import { SmartReviews } from './modules/SmartReviews';
import { Pillars } from './modules/Pillars';
import { Goals } from './modules/Goals';
import { Projects } from './modules/Projects';
import { Tasks } from './modules/Tasks';
import { Habits } from './modules/Habits';
import { Journals } from './modules/Journals';
import { KnowledgeVault } from './modules/KnowledgeVault';
import { KnowledgeGraph } from './modules/KnowledgeGraph';
import { Reviews } from './modules/Reviews';
import { ValuesVault } from './modules/ValuesVault';
import { Settings } from './modules/Settings';
import { HelpProvider, useHelp } from '@/contexts/HelpContext';
import { QuickAddDialog } from './QuickAddDialog';
import { toast } from '@/hooks/use-toast';

interface DashboardProps {
  userEmail?: string;
}

const DashboardContent = ({ userEmail }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [quickAddType, setQuickAddType] = useState<string | null>(null);

  const handleQuickAdd = (type: string) => {
    setQuickAddType(type);
  };

  const handleQuickAddComplete = () => {
    setQuickAddType(null);
    toast({
      title: "Success",
      description: "Item created successfully!",
    });
  };

  // Add event listener for knowledge graph navigation
  useEffect(() => {
    const handleKnowledgeGraphNavigation = () => {
      setActiveTab('knowledge-graph');
    };

    window.addEventListener('navigate-to-knowledge-graph', handleKnowledgeGraphNavigation);
    
    return () => {
      window.removeEventListener('navigate-to-knowledge-graph', handleKnowledgeGraphNavigation);
    };
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'analytics':
        return <Analytics />;
      case 'smart-reviews':
        return <SmartReviews />;
      case 'pillars':
        return <Pillars />;
      case 'goals':
        return <Goals />;
      case 'projects':
        return <Projects />;
      case 'tasks':
        return <Tasks />;
      case 'habits':
        return <Habits />;
      case 'journals':
        return <Journals />;
      case 'knowledge':
        return <KnowledgeVault />;
      case 'knowledge-graph':
        return <KnowledgeGraph />;
      case 'reviews':
        return <Reviews />;
      case 'values':
        return <ValuesVault />;
      case 'settings':
        return <Settings userEmail={userEmail} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Search Button - Bottom Left */}
      <div className="fixed bottom-4 left-4 z-50 sm:bottom-6 sm:left-6">
        <SearchButton activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      <FloatingNav onQuickAdd={handleQuickAdd} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 pb-32">
        {renderActiveTab()}
      </main>

      <QuickAddDialog
        type={quickAddType}
        isOpen={!!quickAddType}
        onClose={() => setQuickAddType(null)}
        onComplete={handleQuickAddComplete}
      />
    </div>
  );
};

export const Dashboard = ({ userEmail }: DashboardProps) => {
  return (
    <HelpProvider>
      <DashboardContent userEmail={userEmail} />
    </HelpProvider>
  );
};
