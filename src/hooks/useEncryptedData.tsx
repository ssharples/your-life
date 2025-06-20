
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { encryption } from '@/utils/encryption';
import { toast } from '@/hooks/use-toast';

interface EncryptableData {
  id: string;
  user_id: string;
  [key: string]: any;
}

interface EncryptedFields {
  content?: string;
  title?: string;
  description?: string;
}

export const useEncryptedData = <T extends EncryptableData>(
  tableName: 'journals' | 'knowledge_vault' | 'goals' | 'los_tasks',
  userId: string
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: rawData, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // For now, just return the data as-is since we don't have encrypted columns yet
      // In the future, this is where we would decrypt fields
      const processedData = rawData.map(item => {
        const processed = { ...item } as T;
        
        // Future encryption logic would go here
        // For example:
        // if (item.encrypted_content) {
        //   processed.content = encryption.decrypt(item.encrypted_content);
        // }
        
        return processed;
      });

      setData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEncryptedData = async (newData: Partial<T> & EncryptedFields) => {
    try {
      const dataToSave = { ...newData };
      
      // Future encryption logic would go here
      // For example:
      // if (newData.content) {
      //   dataToSave.encrypted_content = encryption.encrypt(newData.content);
      //   delete dataToSave.content;
      // }

      const { error } = await supabase
        .from(tableName)
        .insert([{ ...dataToSave, user_id: userId }]);

      if (error) throw error;
      
      await fetchData(); // Refresh data
      toast({
        title: "Success",
        description: "Data saved securely",
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Failed to save data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, tableName]);

  return { data, loading, saveEncryptedData, refetch: fetchData };
};
