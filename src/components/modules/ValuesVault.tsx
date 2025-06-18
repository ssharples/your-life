
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { ValuesGuide } from '@/components/guides/ValuesGuide';
import { useHelp } from '@/contexts/HelpContext';
import { ValueForm } from './values/ValueForm';
import { ValueCard } from './values/ValueCard';
import { ValueEmptyState } from './values/ValueEmptyState';
import { useValuesData } from './values/hooks/useValuesData';
import { useGoalsData } from './values/hooks/useGoalsData';
import { useValueMutations } from './values/hooks/useValueMutations';
import type { Value } from './values/hooks/useValuesData';

export const ValuesVault = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<Value | null>(null);
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [importanceRating, setImportanceRating] = useState(5);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const { showHelp } = useHelp();

  const { data: goals } = useGoalsData();
  const { data: values } = useValuesData();
  const { createOrUpdateValue, deleteValue } = useValueMutations();

  const resetForm = () => {
    setValue('');
    setDescription('');
    setImportanceRating(5);
    setSelectedGoalIds([]);
    setEditingValue(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (valueItem: Value) => {
    setEditingValue(valueItem);
    setValue(valueItem.value);
    setDescription(valueItem.description || '');
    setImportanceRating(valueItem.importance_rating);
    setSelectedGoalIds(valueItem.connected_goals?.map(g => g.id) || []);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdateValue.mutate({ 
      id: editingValue?.id,
      value, 
      description, 
      importance_rating: importanceRating,
      goal_ids: selectedGoalIds,
      isEditing: !!editingValue
    });
    resetForm();
  };

  const handleDelete = (valueId: string) => {
    if (confirm('Are you sure you want to delete this value?')) {
      deleteValue.mutate(valueId);
    }
  };

  return (
    <div className="space-y-6">
      {showHelp && <ValuesGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Values Vault</h2>
          <p className="text-muted-foreground">Define and track your core values</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Value
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingValue ? 'Edit Core Value' : 'Add New Core Value'}
              </DialogTitle>
            </DialogHeader>
            <ValueForm
              value={value}
              setValue={setValue}
              description={description}
              setDescription={setDescription}
              importanceRating={importanceRating}
              setImportanceRating={setImportanceRating}
              selectedGoalIds={selectedGoalIds}
              setSelectedGoalIds={setSelectedGoalIds}
              goals={goals}
              onSubmit={handleSubmit}
              isEditing={!!editingValue}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {values?.map((valueItem) => (
          <ValueCard
            key={valueItem.id}
            value={valueItem}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {values && values.length === 0 && (
        <ValueEmptyState onAddValue={() => setIsDialogOpen(true)} />
      )}
    </div>
  );
};
