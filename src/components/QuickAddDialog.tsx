
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useItemCreation } from './hooks/useItemCreation';
import { QuickAddFormRenderer } from './QuickAddFormRenderer';
import { getDialogTitle } from './utils/dialogTitles';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuickAddDialogProps {
  type: string | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const QuickAddDialog = ({ type, isOpen, onClose, onComplete }: QuickAddDialogProps) => {
  const [formData, setFormData] = useState<any>({});
  const isMobile = useIsMobile();
  
  const createItem = useItemCreation(type, onComplete, onClose);

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return [];
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ['los-projects'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return [];
      
      const { data, error } = await supabase
        .from('los_projects')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = (data: any) => {
    createItem.mutate(data);
    setFormData({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${
        isMobile 
          ? 'fixed top-4 left-0 right-0 mx-4 translate-x-0 translate-y-0' 
          : ''
      }`}>
        <DialogHeader>
          <DialogTitle>{getDialogTitle(type)}</DialogTitle>
        </DialogHeader>
        <QuickAddFormRenderer
          type={type}
          goals={goals}
          projects={projects}
          onSubmit={handleSubmit}
          onClose={onClose}
          createItem={createItem}
        />
      </DialogContent>
    </Dialog>
  );
};
