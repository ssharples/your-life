
import { useState } from 'react';
import { IOSCard } from '@/components/ios/IOSCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SUGGESTED_AREAS = [
  'Health & Fitness',
  'Career & Work',
  'Relationships',
  'Personal Growth',
  'Finance',
  'Education',
  'Family',
  'Spirituality',
  'Hobbies & Recreation',
  'Travel',
  'Community Service',
  'Home & Environment'
];

interface LifeAreasStepProps {
  data: string[];
  onNext: (data: any) => void;
  onBack: () => void;
}

export const LifeAreasStep = ({ data, onNext, onBack }: LifeAreasStepProps) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(data);
  const [customArea, setCustomArea] = useState('');

  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const addCustomArea = () => {
    if (customArea.trim() && !selectedAreas.includes(customArea.trim())) {
      setSelectedAreas(prev => [...prev, customArea.trim()]);
      setCustomArea('');
    }
  };

  const handleSubmit = () => {
    onNext({ lifeAreas: selectedAreas });
  };

  return (
    <IOSCard padding="lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Life Areas</h2>
        <p className="text-gray-600">Select the areas of life that are important to you (3-8 recommended)</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Suggested Areas</h3>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_AREAS.map((area) => (
              <Badge
                key={area}
                variant={selectedAreas.includes(area) ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => toggleArea(area)}
              >
                {area}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Add Custom Area</h3>
          <div className="flex gap-2">
            <Input
              value={customArea}
              onChange={(e) => setCustomArea(e.target.value)}
              placeholder="Enter a custom life area..."
              onKeyPress={(e) => e.key === 'Enter' && addCustomArea()}
            />
            <Button type="button" onClick={addCustomArea} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {selectedAreas.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Selected Areas ({selectedAreas.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedAreas.map((area) => (
                <Badge
                  key={area}
                  variant="default"
                  className="cursor-pointer px-4 py-2"
                  onClick={() => toggleArea(area)}
                >
                  {area} ×
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={selectedAreas.length < 3} 
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </div>
    </IOSCard>
  );
};
