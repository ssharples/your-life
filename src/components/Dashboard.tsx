
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { HelpCircle } from 'lucide-react';
import { Goals } from './modules/Goals';
import { Journals } from './modules/Journals';
import { Habits } from './modules/Habits';
import { Projects } from './modules/Projects';
import { Tasks } from './modules/Tasks';
import { KnowledgeVault } from './modules/KnowledgeVault';
import { Reviews } from './modules/Reviews';
import { ValuesVault } from './modules/ValuesVault';
import { Pillars } from './modules/Pillars';
import { Overview } from './modules/Overview';
import { HelpProvider, useHelp } from '@/contexts/HelpContext';
import { User } from '@supabase/supabase-js';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface DashboardProps {
  user: User;
}

const DashboardContent = ({ user }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { showHelp, toggleHelp } = useHelp();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
          userEmail={user.email}
        />
        
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <Toggle pressed={showHelp} onPressedChange={toggleHelp} aria-label="Toggle help" size="sm">
              <HelpCircle className="h-4 w-4" />
            </Toggle>
          </div>
          
          <main className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="overview">
                <Overview />
              </TabsContent>
              <TabsContent value="pillars">
                <Pillars />
              </TabsContent>
              <TabsContent value="goals">
                <Goals />
              </TabsContent>
              <TabsContent value="projects">
                <Projects />
              </TabsContent>
              <TabsContent value="tasks">
                <Tasks />
              </TabsContent>
              <TabsContent value="habits">
                <Habits />
              </TabsContent>
              <TabsContent value="journals">
                <Journals />
              </TabsContent>
              <TabsContent value="knowledge">
                <KnowledgeVault />
              </TabsContent>
              <TabsContent value="reviews">
                <Reviews />
              </TabsContent>
              <TabsContent value="values">
                <ValuesVault />
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export const Dashboard = ({ user }: DashboardProps) => {
  return (
    <HelpProvider>
      <DashboardContent user={user} />
    </HelpProvider>
  );
};
