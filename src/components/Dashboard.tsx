
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
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
import { HelpProvider } from '@/contexts/HelpContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DashboardProps {
  userEmail?: string;
}

export const Dashboard = ({ userEmail }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showHelp, setShowHelp] = useState(false);

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

  const toggleHelp = () => {
    setShowHelp(!showHelp);
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
    <HelpProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showHelp={showHelp}
            toggleHelp={toggleHelp}
            onSignOut={handleSignOut}
            userEmail={userEmail}
          />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6 px-6">
              {renderActiveTab()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </HelpProvider>
  );
};
