
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { encryption } from '@/utils/encryption';
import { toast } from '@/hooks/use-toast';

export const useEncryptedData = <T,>(tableName: string, userId: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: encryptedData, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Decrypt the data on the client side
      const decryptedData = encryptedData.map(item => {
        const decrypted = { ...item };
        // Decrypt specific fields that contain sensitive data
        if (item.encrypted_content) {
          try {
            decrypted.content = encryption.decrypt(item.encrypted_content);
          } catch (e) {
            console.error('Failed to decrypt content:', e);
            decrypted.content = '[Decryption Failed]';
          }
        }
        if (item.encrypted_title) {
          try {
            decrypted.title = encryption.decrypt(item.encrypted_title);
          } catch (e) {
            console.error('Failed to decrypt title:', e);
            decrypted.title = '[Decryption Failed]';
          }
        }
        return decrypted;
      });

      setData(decryptedData);
    } catch (error) {
      console.error('Error fetching encrypted data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEncryptedData = async (newData: Partial<T> & { content?: string; title?: string }) => {
    try {
      const encryptedData: any = { ...newData };
      
      // Encrypt sensitive fields before saving
      if (newData.content) {
        encryptedData.encrypted_content = encryption.encrypt(newData.content);
        delete encryptedData.content; // Remove plaintext
      }
      if (newData.title) {
        encryptedData.encrypted_title = encryption.encrypt(newData.title);
        delete encryptedData.title; // Remove plaintext
      }

      const { error } = await supabase
        .from(tableName)
        .insert([{ ...encryptedData, user_id: userId }]);

      if (error) throw error;
      
      await fetchData(); // Refresh data
      toast({
        title: "Success",
        description: "Data saved securely",
      });
    } catch (error) {
      console.error('Error saving encrypted data:', error);
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
