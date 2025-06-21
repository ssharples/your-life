
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2 } from 'lucide-react';

interface DailyPillarReviewProps {
  responses: string[];
  onUpdate: (pillarIds: string[]) => void;
}

export const DailyPillarReview = ({ responses, onUpdate }: DailyPillarReviewProps) => {
  const [selectedPillars, setSelectedPillars] = useState<string[]>(responses || []);

  const { data: pillars } = useQuery({
    queryKey: ['pillars-for-review'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('pillars')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    onUpdate(selectedPillars);
  }, [selectedPillars, onUpdate]);

  const handlePillarToggle = (pillarId: string, checked: boolean) => {
    setSelectedPillars(prev => {
      if (checked) {
        return [...prev, pillarId];
      } else {
        return prev.filter(id => id !== pillarId);
      }
    });
  };

  if (!pillars || pillars.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Energy Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No pillars found. Create some life pillars first to track your energy allocation.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Energy Allocation
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Which pillars of your life did you put energy into today?
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05
                }}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={pillar.id}
                  checked={selectedPillars.includes(pillar.id)}
                  onCheckedChange={(checked) => handlePillarToggle(pillar.id, !!checked)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={pillar.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {pillar.name}
                  </label>
                  {pillar.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {pillar.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {selectedPillars.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-primary/5 rounded-lg border"
          >
            <p className="text-sm text-muted-foreground">
              Great! You put energy into <span className="font-medium text-primary">
                {selectedPillars.length}
              </span> pillar{selectedPillars.length !== 1 ? 's' : ''} today.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
