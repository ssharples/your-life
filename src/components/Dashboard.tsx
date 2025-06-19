
import { useState, useEffect } from 'react';
import { FloatingNav } from './FloatingNav';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { QuickAddDialog } from './QuickAddDialog';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface DashboardProps {
  userEmail?: string;
}

const DashboardContent = ({ userEmail }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [quickAddType, setQuickAddType] = useState<string | null>(null);
  const { showHelp, toggleHelp } = useHelp();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Life OS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleHelp}
                className={cn(
                  "text-sm",
                  showHelp ? "text-blue-600 bg-blue-50" : "text-gray-600"
                )}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
              {userEmail && (
                <span className="text-sm text-gray-600 hidden sm:inline">{userEmail}</span>
              )}
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'pillars', label: 'Pillars' },
              { id: 'goals', label: 'Goals' },
              { id: 'projects', label: 'Projects' },
              { id: 'tasks', label: 'Tasks' },
              { id: 'habits', label: 'Habits' },
              { id: 'journals', label: 'Journal' },
              { id: 'knowledge', label: 'Knowledge' },
              { id: 'knowledge-graph', label: 'Graph' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'values', label: 'Values' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
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
