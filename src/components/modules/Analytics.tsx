
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Brain, Target, Zap, Activity, BookOpen, Heart } from 'lucide-react';

interface AnalyticsData {
  correlations: any[];
  insights: any[];
  patterns: any[];
  feedbackLoops: any[];
}

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState('correlations');

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // For now, we'll generate mock data based on existing user data
      // In a real implementation, this would come from the correlation engine
      const mockData: AnalyticsData = {
        correlations: [
          {
            id: '1',
            domain_a: 'Sleep',
            domain_b: 'Productivity',
            correlation: 0.73,
            significance: 'High',
            insight: 'Better sleep quality correlates with 73% higher task completion rates'
          },
          {
            id: '2',
            domain_a: 'Exercise',
            domain_b: 'Mood',
            correlation: 0.68,
            significance: 'High',
            insight: 'Exercise completion correlates with 68% improvement in daily mood ratings'
          },
          {
            id: '3',
            domain_a: 'Journal Writing',
            domain_b: 'Goal Achievement',
            correlation: 0.54,
            significance: 'Medium',
            insight: 'Regular journaling correlates with 54% better goal achievement rates'
          }
        ],
        insights: [
          {
            id: '1',
            title: 'Peak Productivity Window',
            description: 'Your highest productivity occurs between 9 AM - 11 AM on days following 7+ hours of sleep',
            confidence: 85,
            recommendations: ['Schedule important tasks during morning hours', 'Prioritize sleep consistency']
          },
          {
            id: '2',
            title: 'Exercise Impact Pattern',
            description: 'Exercise on Tuesday increases Wednesday productivity by 23%',
            confidence: 72,
            recommendations: ['Schedule regular Tuesday workouts', 'Plan challenging tasks for Wednesdays']
          }
        ],
        patterns: [
          {
            id: '1',
            type: 'Weekly Cycle',
            description: 'Energy levels follow a consistent weekly pattern with peaks on Tuesday and Friday',
            strength: 'Strong'
          },
          {
            id: '2',
            type: 'Habit Stack',
            description: 'Morning coffee habit successfully triggers journaling 89% of the time',
            strength: 'Very Strong'
          }
        ],
        feedbackLoops: [
          {
            id: '1',
            type: 'Daily',
            name: 'Sleep-Task Adjustment',
            description: 'Automatically adjusts task difficulty based on sleep quality',
            status: 'Active',
            success_rate: 78
          }
        ]
      };

      return mockData;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics & Insights</h2>
            <p className="text-muted-foreground">Discover patterns and correlations in your life data</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics & Insights</h2>
          <p className="text-muted-foreground">Discover patterns and correlations in your life data</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Correlations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.correlations.length || 0}</div>
            <p className="text-xs text-muted-foreground">Discovered patterns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.insights.length || 0}</div>
            <p className="text-xs text-muted-foreground">Generated this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Behavior Patterns</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.patterns.length || 0}</div>
            <p className="text-xs text-muted-foreground">Identified patterns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Loops</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.feedbackLoops.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active automations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Loops</TabsTrigger>
        </TabsList>

        <TabsContent value="correlations" className="space-y-4">
          <div className="grid gap-4">
            {analyticsData?.correlations.map((correlation) => (
              <Card key={correlation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{correlation.domain_a} ↔ {correlation.domain_b}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{correlation.insight}</p>
                    </div>
                    <Badge variant={correlation.significance === 'High' ? 'default' : 'secondary'}>
                      {correlation.significance}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Correlation Strength:</span>
                    <Progress value={correlation.correlation * 100} className="flex-1" />
                    <span className="text-sm font-bold">{(correlation.correlation * 100).toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {analyticsData?.insights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <Badge variant="outline">{insight.confidence}% confident</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recommendations:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {insight.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid gap-4">
            {analyticsData?.patterns.map((pattern) => (
              <Card key={pattern.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{pattern.type}</CardTitle>
                    <Badge variant={pattern.strength === 'Very Strong' ? 'default' : 'secondary'}>
                      {pattern.strength}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{pattern.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid gap-4">
            {analyticsData?.feedbackLoops.map((loop) => (
              <Card key={loop.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{loop.name}</CardTitle>
                    <Badge variant={loop.status === 'Active' ? 'default' : 'secondary'}>
                      {loop.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{loop.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Success Rate:</span>
                    <Progress value={loop.success_rate} className="flex-1" />
                    <span className="text-sm font-bold">{loop.success_rate}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
