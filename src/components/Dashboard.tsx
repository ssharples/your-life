
import { useState } from 'react';
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
import { Reviews } from './modules/Reviews';
import { ValuesVault } from './modules/ValuesVault';
import { Settings } from './modules/Settings';
import { HelpProvider, useHelp } from '@/contexts/HelpContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DashboardProps {
  userEmail?: string;
}

const DashboardContent = ({ userEmail }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
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
      <FloatingNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showHelp={showHelp}
        toggleHelp={toggleHelp}
        onSignOut={handleSignOut}
        userEmail={userEmail}
      />
      
      <main className="px-4 py-6 pb-32">
        {renderActiveTab()}
      </main>
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
