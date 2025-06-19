
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Heart } from 'lucide-react';
import { useValueLogs } from './hooks/useValueLogs';
import { motion } from 'framer-motion';

interface ValueTimelineProps {
  valueId: string;
  valueName: string;
}

export const ValueTimeline = ({ valueId, valueName }: ValueTimelineProps) => {
  const { valueLogs, isLoading } = useValueLogs(valueId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!valueLogs?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No logs yet for this value.</p>
            <p className="text-sm">Start logging when you put this value into action!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          {valueName} Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {valueLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative pl-6 pb-4 last:pb-0"
            >
              {/* Timeline line */}
              {index < valueLogs.length - 1 && (
                <div className="absolute left-2 top-6 w-0.5 h-full bg-gray-200"></div>
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-0 top-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(log.date).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(log.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Badge>
                </div>
                
                {log.description && (
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">
                    {log.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
