
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface Pillar {
  id: string;
  name: string;
}

interface ValueFormProps {
  value: string;
  setValue: (value: string) => void;
  description: string;
  setDescription: (description: string) => void;
  importanceRating: number;
  setImportanceRating: (rating: number) => void;
  selectedPillarIds: string[];
  setSelectedPillarIds: (ids: string[]) => void;
  pillars?: Pillar[];
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export const ValueForm = ({
  value,
  setValue,
  description,
  setDescription,
  importanceRating,
  setImportanceRating,
  selectedPillarIds,
  setSelectedPillarIds,
  pillars,
  onSubmit,
  isEditing
}: ValueFormProps) => {
  const handlePillarSelection = (pillarId: string) => {
    if (selectedPillarIds.includes(pillarId)) {
      setSelectedPillarIds(selectedPillarIds.filter(id => id !== pillarId));
    } else {
      setSelectedPillarIds([...selectedPillarIds, pillarId]);
    }
  };

  const removePillar = (pillarId: string) => {
    setSelectedPillarIds(selectedPillarIds.filter(id => id !== pillarId));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        placeholder="Value name (e.g., Integrity, Growth, Family)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <Textarea
        placeholder="What does this value mean to you? How does it guide your decisions?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <div className="space-y-2">
        <label className="text-sm font-medium">Connected Pillars</label>
        <Select onValueChange={handlePillarSelection}>
          <SelectTrigger>
            <SelectValue placeholder="Select pillars to connect" />
          </SelectTrigger>
          <SelectContent>
            {pillars?.filter(pillar => !selectedPillarIds.includes(pillar.id)).map((pillar) => (
              <SelectItem key={pillar.id} value={pillar.id}>
                {pillar.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedPillarIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedPillarIds.map((pillarId) => {
              const pillar = pillars?.find(p => p.id === pillarId);
              return pillar ? (
                <Badge key={pillarId} variant="secondary" className="flex items-center gap-1">
                  {pillar.name}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => removePillar(pillarId)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Importance Rating: {importanceRating}/10
        </label>
        <Input
          type="range"
          min="1"
          max="10"
          value={importanceRating}
          onChange={(e) => setImportanceRating(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Less Important</span>
          <span>Very Important</span>
        </div>
      </div>
      <Button type="submit" className="w-full">
        {isEditing ? 'Update Value' : 'Add Value'}
      </Button>
    </form>
  );
};
