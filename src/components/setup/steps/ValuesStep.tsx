
import { useState } from 'react';
import { IOSCard } from '@/components/ios/IOSCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Plus, X } from 'lucide-react';

interface Value {
  title: string;
  description: string;
  importance: number;
}

interface ValuesStepProps {
  data: Value[];
  onNext: (data: any) => void;
  onBack: () => void;
}

export const ValuesStep = ({ data, onNext, onBack }: ValuesStepProps) => {
  const [values, setValues] = useState<Value[]>(
    data.length > 0 ? data : [{ title: '', description: '', importance: 5 }]
  );

  const addValue = () => {
    setValues([...values, { title: '', description: '', importance: 5 }]);
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const updateValue = (index: number, field: keyof Value, value: string | number) => {
    setValues(values.map((val, i) => 
      i === index ? { ...val, [field]: value } : val
    ));
  };

  const handleSubmit = () => {
    const validValues = values.filter(value => value.title.trim());
    onNext({ values: validValues });
  };

  const validValues = values.filter(value => value.title.trim()).length;

  return (
    <IOSCard padding="lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-pink-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Define Your Values</h2>
        <p className="text-gray-600">What principles guide your decisions and actions?</p>
      </div>

      <div className="space-y-6">
        {values.map((value, index) => (
          <IOSCard key={index} padding="md" className="relative">
            {values.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeValue(index)}
                className="absolute top-2 right-2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor={`value-title-${index}`}>Value Name *</Label>
                <Input
                  id={`value-title-${index}`}
                  value={value.title}
                  onChange={(e) => updateValue(index, 'title', e.target.value)}
                  placeholder="e.g., Integrity, Growth, Family"
                />
              </div>

              <div>
                <Label htmlFor={`value-description-${index}`}>Description</Label>
                <Textarea
                  id={`value-description-${index}`}
                  value={value.description}
                  onChange={(e) => updateValue(index, 'description', e.target.value)}
                  placeholder="What does this value mean to you?"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor={`value-importance-${index}`}>
                  Importance (1-10): {value.importance}
                </Label>
                <Input
                  id={`value-importance-${index}`}
                  type="range"
                  min="1"
                  max="10"
                  value={value.importance}
                  onChange={(e) => updateValue(index, 'importance', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </IOSCard>
        ))}

        <Button type="button" onClick={addValue} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Value
        </Button>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={validValues === 0} 
            className="flex-1"
          >
            Continue ({validValues} values)
          </Button>
        </div>
      </div>
    </IOSCard>
  );
};
