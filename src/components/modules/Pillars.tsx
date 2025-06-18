
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, BarChart3 } from 'lucide-react';
import { PillarsGuide } from '@/components/guides/PillarsGuide';
import { useHelp } from '@/contexts/HelpContext';
import { PillarHierarchy } from './pillars/PillarHierarchy';
import { PillarStats } from './pillars/PillarStats';
import { PipelineVisualization } from './pillars/PipelineVisualization';
import { PillarForm } from './pillars/components/PillarForm';
import { usePillarsData } from './pillars/hooks/usePillarsData';
import { usePillarStats } from './pillars/hooks/usePillarStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Pillars = () => {
  const { showHelp } = useHelp();
  const { data: hierarchyData } = usePillarsData();
  const stats = usePillarStats(hierarchyData);

  return (
    <div className="space-y-6">
      {showHelp && <PillarsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Life Pillars Dashboard</h2>
          <p className="text-muted-foreground">View your complete life hierarchy and connections</p>
        </div>
        <PillarForm />
      </div>

      <PillarStats stats={stats} />

      <Tabs defaultValue="hierarchy" className="w-full">
        <TabsList>
          <TabsTrigger value="hierarchy" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Hierarchy View
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy" className="mt-6">
          <PillarHierarchy pillarsData={hierarchyData || []} />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Structure Overview</h4>
                  <div className="text-sm space-y-1">
                    <div>Pillars: {stats.totalPillars}</div>
                    <div>Values: {stats.totalValues}</div>
                    <div>Goals: {stats.totalGoals} ({stats.activeGoals} active)</div>
                    <div>Habits: {stats.totalHabits} ({stats.activeHabits} active)</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Work Progress</h4>
                  <div className="text-sm space-y-1">
                    <div>Projects: {stats.totalProjects} ({stats.activeProjects} active)</div>
                    <div>Tasks: {stats.totalTasks}</div>
                    <div>Completed: {stats.completedTasks}</div>
                    <div>Pending: {stats.pendingTasks}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
