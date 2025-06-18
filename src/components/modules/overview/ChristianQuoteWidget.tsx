
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Quote } from 'lucide-react';

export const ChristianQuoteWidget = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: quote, isLoading, error } = useQuery({
    queryKey: ['christian-quote', refreshKey],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-christian-quote');
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Quote className="h-5 w-5" />
            Daily Inspiration
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground italic">
              "Trust in the Lord with all your heart and lean not on your own understanding." 
              <br />
              <span className="text-sm">- Proverbs 3:5</span>
            </p>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-muted-foreground italic leading-relaxed">
              {quote?.quote || quote?.fallback}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
