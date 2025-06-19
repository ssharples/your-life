
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, AlertCircle } from 'lucide-react';

interface TodayProgressProps {
  todayEntries: any[];
}

export const TodayProgress = ({ todayEntries }: TodayProgressProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Today's Mindset Work
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todayEntries && todayEntries.length > 0 ? (
          <div className="space-y-3">
            {todayEntries.map((entry) => (
              <div key={entry.id} className="border-l-4 border-l-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-red-600 mb-1">
                      <AlertCircle className="h-3 w-3 inline mr-1" />
                      Negative Belief:
                    </div>
                    <p className="text-sm mb-2">{entry.content}</p>
                    {entry.insights && (
                      <>
                        <div className="text-sm font-medium text-green-600 mb-1">
                          <Lightbulb className="h-3 w-3 inline mr-1" />
                          Positive Affirmation:
                        </div>
                        <p className="text-sm text-green-700 font-medium">{entry.insights}</p>
                      </>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {entry.tags?.[0] === 'self' ? 'About Self' : 'About Others'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No mindset work recorded today yet.</p>
            <p className="text-sm">Click "Log Belief" to start your daily check-in.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
