
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Life Operating System</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Toggle pressed={showHelp} onPressedChange={toggleHelp} aria-label="Toggle help">
                <HelpCircle className="h-4 w-4" />
                {showHelp ? 'Hide Help' : 'Show Help'}
              </Toggle>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 lg:grid-cols-10 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pillars">Pillars</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="journals">Journal</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="values">Values</TabsTrigger>
          </TabsList>

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
    </div>
  );
};

export const Dashboard = ({ user }: DashboardProps) => {
  return (
    <HelpProvider>
      <DashboardContent user={user} />
    </HelpProvider>
  );
};
