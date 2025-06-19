
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Plus } from 'lucide-react';
import { useValueLogs } from '../values/hooks/useValueLogs';
import { motion } from 'framer-motion';

interface Value {
  id: string;
  value: string;
  description: string | null;
  importance_rating: number;
}

interface DailyValuesReviewProps {
  responses: any[];
  onUpdate: (values: any[]) => void;
}

export const DailyValuesReview = ({ responses, onUpdate }: DailyValuesReviewProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    responses.map(r => r.value_id).filter(Boolean) || []
  );
  const [valueDescriptions, setValueDescriptions] = useState<Record<string, string>>(
    responses.reduce((acc, r) => ({ ...acc, [r.value_id]: r.description || '' }), {})
  );

  const { createValueLog } = useValueLogs();

  const { data: userValues } = useQuery({
    queryKey: ['user-values-review'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('values_vault')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('importance_rating', { ascending: false });

      if (error) throw error;
      return data as Value[];
    },
  });

  const handleValueToggle = (valueId: string, checked: boolean) => {
    const newSelected = checked 
      ? [...selectedValues, valueId]
      : selectedValues.filter(id => id !== valueId);
    
    setSelectedValues(newSelected);
    updateResponses(newSelected);
  };

  const handleDescriptionChange = (valueId: string, description: string) => {
    const newDescriptions = { ...valueDescriptions, [valueId]: description };
    setValueDescriptions(newDescriptions);
    updateResponses(selectedValues, newDescriptions);
  };

  const updateResponses = (values: string[], descriptions?: Record<string, string>) => {
    const currentDescriptions = descriptions || valueDescriptions;
    const newResponses = values.map(valueId => ({
      value_id: valueId,
      description: currentDescriptions[valueId] || '',
      date: new Date().toISOString().split('T')[0],
    }));
    onUpdate(newResponses);
  };

  const handleLogValues = async () => {
    for (const valueId of selectedValues) {
      const description = valueDescriptions[valueId];
      if (description?.trim()) {
        await createValueLog.mutateAsync({
          value_id: valueId,
          description: description.trim(),
        });
      }
    }
  };

  if (!userValues?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No values found. Add some values first to track your progress!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Values in Action Today
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select the values you actively lived out today and describe how you demonstrated them.
          </p>
          
          <div className="grid gap-4">
            {userValues.map((value, index) => (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={value.id}
                    checked={selectedValues.includes(value.id)}
                    onCheckedChange={(checked) => handleValueToggle(value.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label htmlFor={value.id} className="font-medium cursor-pointer">
                        {value.value}
                      </label>
                      <Badge variant="outline" className="text-xs">
                        {value.importance_rating}/10
                      </Badge>
                    </div>
                    {value.description && (
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    )}
                    
                    {selectedValues.includes(value.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <Textarea
                          placeholder="How did you demonstrate this value today? What specific actions or decisions reflected this value?"
                          value={valueDescriptions[value.id] || ''}
                          onChange={(e) => handleDescriptionChange(value.id, e.target.value)}
                          className="mt-2"
                          rows={3}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedValues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 border-t"
            >
              <Button 
                onClick={handleLogValues}
                disabled={createValueLog.isPending}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Log Values for Today
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
