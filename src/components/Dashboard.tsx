
import { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showHelp={showHelp}
          toggleHelp={toggleHelp}
          onSignOut={handleSignOut}
          userEmail={userEmail}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Life OS</h1>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="container mx-auto py-6 px-2">
              {renderActiveTab()}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export const Dashboard = ({ userEmail }: DashboardProps) => {
  return (
    <HelpProvider>
      <DashboardContent userEmail={userEmail} />
    </HelpProvider>
  );
};
