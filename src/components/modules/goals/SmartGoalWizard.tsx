
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Target, Calendar, Ruler, CheckCircle, Star, Sparkles, Loader2 } from 'lucide-react';
import { useAIEnhancement, AIGoalSuggestions } from './hooks/useAIEnhancement';
import { useValuesData } from '@/components/modules/values/hooks/useValuesData';
import { Checkbox } from '@/components/ui/checkbox';

interface Pillar {
  id: string;
  name: string;
}

interface Value {
  id: string;
  value: string;
}

interface SmartGoalWizardProps {
  pillars?: Pillar[];
  onSubmit: (goalData: any) => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

const STEPS = [
  { key: 'specific', title: 'Specific', icon: Target, description: 'Define exactly what you want to accomplish' },
  { key: 'measurable', title: 'Measurable', icon: Ruler, description: 'How will you measure progress and success?' },
  { key: 'achievable', title: 'Achievable', icon: CheckCircle, description: 'Is this goal realistic and attainable?' },
  { key: 'relevant', title: 'Relevant', icon: Star, description: 'How does this align with your values and pillars?' },
  { key: 'timebound', title: 'Time-bound', icon: Calendar, description: 'When will you complete this goal?' },
];

export const SmartGoalWizard = ({ pillars, onSubmit, onCancel, initialData, isEditing = false }: SmartGoalWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { data: values } = useValuesData();
  const { enhanceGoal, isLoading: isAILoading } = useAIEnhancement();
  
  const [goalData, setGoalData] = useState({
    id: initialData?.id || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    specificDetails: '',
    measurementCriteria: '',
    achievabilityNotes: '',
    relevanceReason: '',
    targetDate: initialData?.target_date || '',
    type: (initialData?.type as 'short-term' | 'long-term') || 'short-term',
    priority: initialData?.priority || 3,
    pillarId: initialData?.pillar_id || '',
    valueIds: [] as string[],
    aiEnhanced: false,
    aiSuggestions: {} as AIGoalSuggestions
  });

  // Parse existing description for SMART components if editing
  useState(() => {
    if (isEditing && initialData?.description) {
      const description = initialData.description;
      const specificMatch = description.match(/Specific: ([^\n]+)/);
      const measurableMatch = description.match(/Measurable: ([^\n]+)/);
      const achievableMatch = description.match(/Achievable: ([^\n]+)/);
      const relevantMatch = description.match(/Relevant: ([^\n]+)/);
      
      if (specificMatch || measurableMatch || achievableMatch || relevantMatch) {
        setGoalData(prev => ({
          ...prev,
          specificDetails: specificMatch?.[1] || '',
          measurementCriteria: measurableMatch?.[1] || '',
          achievabilityNotes: achievableMatch?.[1] || '',
          relevanceReason: relevantMatch?.[1] || ''
        }));
      }
    }
  });

  const handleAIEnhance = async () => {
    if (!goalData.title.trim()) return;
    
    const suggestions = await enhanceGoal(goalData.title);
    if (suggestions) {
      setGoalData(prev => ({
        ...prev,
        specificDetails: suggestions.specificDetails,
        measurementCriteria: suggestions.measurementCriteria,
        achievabilityNotes: suggestions.achievabilityNotes,
        relevanceReason: suggestions.relevanceReason,
        aiEnhanced: true,
        aiSuggestions: suggestions
      }));
    }
  };

  const currentStepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const finalGoalData = {
        ...(isEditing && goalData.id ? { id: goalData.id } : {}),
        title: goalData.title,
        description: buildSmartDescription(),
        type: goalData.type,
        priority: goalData.priority,
        target_date: goalData.targetDate,
        pillar_id: goalData.pillarId || null,
        value_ids: goalData.valueIds,
        ai_enhanced: goalData.aiEnhanced,
        ai_suggestions: goalData.aiSuggestions,
        isEditing
      };
      onSubmit(finalGoalData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const buildSmartDescription = () => {
    const parts = [];
    if (goalData.specificDetails) parts.push(`Specific: ${goalData.specificDetails}`);
    if (goalData.measurementCriteria) parts.push(`Measurable: ${goalData.measurementCriteria}`);
    if (goalData.achievabilityNotes) parts.push(`Achievable: ${goalData.achievabilityNotes}`);
    if (goalData.relevanceReason) parts.push(`Relevant: ${goalData.relevanceReason}`);
    if (goalData.targetDate) parts.push(`Time-bound: Complete by ${new Date(goalData.targetDate).toLocaleDateString()}`);
    return parts.join('\n\n');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return goalData.title.trim() && goalData.specificDetails.trim();
      case 1: return goalData.measurementCriteria.trim();
      case 2: return goalData.achievabilityNotes.trim();
      case 3: return goalData.relevanceReason.trim();
      case 4: return goalData.targetDate;
      default: return false;
    }
  };

  const handleValueToggle = (valueId: string) => {
    setGoalData(prev => ({
      ...prev,
      valueIds: prev.valueIds.includes(valueId)
        ? prev.valueIds.filter(id => id !== valueId)
        : [...prev.valueIds, valueId]
    }));
  };

  const renderStepContent = () => {
    const Icon = currentStepData.icon;
    
    switch (currentStep) {
      case 0: // Specific
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Icon className="h-12 w-12 mx-auto text-blue-600 mb-3" />
              <h3 className="text-xl font-semibold">Be Specific</h3>
              <p className="text-muted-foreground">What exactly do you want to accomplish?</p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Goal title (e.g., 'Run a 5K marathon')"
                  value={goalData.title}
                  onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
                  className="text-lg flex-1"
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleAIEnhance}
                  disabled={!goalData.title.trim() || isAILoading}
                  className="flex items-center gap-2"
                >
                  {isAILoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  AI Enhance
                </Button>
              </div>
              <Textarea
                placeholder="Describe your goal in detail. Be as specific as possible about what success looks like..."
                value={goalData.specificDetails}
                onChange={(e) => setGoalData({ ...goalData, specificDetails: e.target.value })}
                rows={4}
              />
              {goalData.aiEnhanced && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">AI Enhanced</span>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Instead of "get fit", try "run a 5K in under 30 minutes" or "lose 15 pounds through diet and exercise"
              </p>
            </div>
          </div>
        );

      case 1: // Measurable
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Icon className="h-12 w-12 mx-auto text-green-600 mb-3" />
              <h3 className="text-xl font-semibold">Make it Measurable</h3>
              <p className="text-muted-foreground">How will you track progress and know when you've succeeded?</p>
            </div>
            <Textarea
              placeholder="Define how you'll measure success. Include specific metrics, numbers, or milestones..."
              value={goalData.measurementCriteria}
              onChange={(e) => setGoalData({ ...goalData, measurementCriteria: e.target.value })}
              rows={4}
            />
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Examples:</strong> "Track running time weekly", "Weigh myself daily", "Complete 3 workouts per week"
              </p>
            </div>
          </div>
        );

      case 2: // Achievable
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Icon className="h-12 w-12 mx-auto text-orange-600 mb-3" />
              <h3 className="text-xl font-semibold">Keep it Achievable</h3>
              <p className="text-muted-foreground">Is this goal realistic given your current situation?</p>
            </div>
            <Textarea
              placeholder="Explain why this goal is realistic for you. What resources, skills, or support do you have?"
              value={goalData.achievabilityNotes}
              onChange={(e) => setGoalData({ ...goalData, achievabilityNotes: e.target.value })}
              rows={4}
            />
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Consider:</strong> Your current fitness level, available time, past experience, and any constraints
              </p>
            </div>
          </div>
        );

      case 3: // Relevant
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Icon className="h-12 w-12 mx-auto text-purple-600 mb-3" />
              <h3 className="text-xl font-semibold">Make it Relevant</h3>
              <p className="text-muted-foreground">How does this goal align with your values and life pillars?</p>
            </div>
            <Select value={goalData.pillarId} onValueChange={(value) => setGoalData({ ...goalData, pillarId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a pillar this goal supports" />
              </SelectTrigger>
              <SelectContent>
                {pillars?.map((pillar) => (
                  <SelectItem key={pillar.id} value={pillar.id}>
                    {pillar.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Connect to Values</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {values?.map((value) => (
                  <div key={value.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={value.id}
                      checked={goalData.valueIds.includes(value.id)}
                      onCheckedChange={() => handleValueToggle(value.id)}
                    />
                    <label
                      htmlFor={value.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {value.value}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Explain why this goal matters to you and how it connects to your values or long-term vision..."
              value={goalData.relevanceReason}
              onChange={(e) => setGoalData({ ...goalData, relevanceReason: e.target.value })}
              rows={4}
            />
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Think about:</strong> How will achieving this goal improve your life or move you closer to your bigger vision?
              </p>
            </div>
          </div>
        );

      case 4: // Time-bound
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Icon className="h-12 w-12 mx-auto text-red-600 mb-3" />
              <h3 className="text-xl font-semibold">Set a Deadline</h3>
              <p className="text-muted-foreground">When will you complete this goal?</p>
            </div>
            <div className="grid gap-4">
              <Select 
                value={goalData.type} 
                onValueChange={(value: 'short-term' | 'long-term') => setGoalData({ ...goalData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Goal timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short-term">Short-term (3-6 months)</SelectItem>
                  <SelectItem value="long-term">Long-term (6+ months)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={goalData.targetDate}
                onChange={(e) => setGoalData({ ...goalData, targetDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
              <Select 
                value={goalData.priority.toString()} 
                onValueChange={(value) => setGoalData({ ...goalData, priority: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Highest Priority</SelectItem>
                  <SelectItem value="2">2 - High Priority</SelectItem>
                  <SelectItem value="3">3 - Medium Priority</SelectItem>
                  <SelectItem value="4">4 - Low Priority</SelectItem>
                  <SelectItem value="5">5 - Lowest Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Tip:</strong> Having a specific deadline creates urgency and helps you stay accountable
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {isEditing ? 'Edit SMART Goal' : 'SMART Goal Creator'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Step {currentStep + 1} of {STEPS.length}: {currentStepData.title}
              </p>
            </div>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={currentStep === 0 ? onCancel : handleBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2"
            >
              {currentStep === STEPS.length - 1 ? (isEditing ? 'Update Goal' : 'Create Goal') : 'Next'}
              {currentStep < STEPS.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
