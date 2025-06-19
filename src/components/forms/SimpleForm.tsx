
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SimpleFormProps {
  type: string | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const SimpleForm = ({ type, onSubmit, onCancel }: SimpleFormProps) => {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For values, ensure we map the form fields correctly
    if (type === 'value') {
      const valueData = {
        value: formData.title || formData.value || formData.name, // Map title/name to value
        description: formData.description,
        importance: formData.importance || 5
      };
      onSubmit(valueData);
    } else {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'value': return 'Enter value name (e.g., Integrity, Growth)';
      case 'pillar': return 'Enter pillar name';
      case 'knowledge': return 'Enter knowledge title';
      case 'journal': return 'Enter journal title';
      default: return `Enter ${type} title`;
    }
  };

  const getDescriptionPlaceholder = () => {
    switch (type) {
      case 'value': return 'What does this value mean to you?';
      case 'pillar': return 'Describe this life area';
      case 'knowledge': return 'Enter knowledge content';
      case 'journal': return 'Write your journal entry';
      default: return `Enter ${type} description`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">
          {type === 'value' ? 'Value Name' : `${type?.charAt(0).toUpperCase()}${type?.slice(1)} Title`}
        </Label>
        <Input
          id="title"
          placeholder={getPlaceholder()}
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder={getDescriptionPlaceholder()}
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

      {type === 'value' && (
        <div>
          <Label htmlFor="importance">
            Importance (1-10): {formData.importance || 5}
          </Label>
          <Input
            id="importance"
            type="range"
            min="1"
            max="10"
            value={formData.importance || 5}
            onChange={(e) => handleInputChange('importance', parseInt(e.target.value))}
          />
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Create {type?.charAt(0).toUpperCase()}{type?.slice(1)}
        </Button>
      </div>
    </form>
  );
};
