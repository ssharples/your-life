
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Target, Calendar, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface SmartGoalData {
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timebound: string;
}

interface SmartGoalDisplayProps {
  smartData: SmartGoalData;
  title: string;
  status: string;
  targetDate?: string;
  getStatusColor: (status: string) => string;
}

const smartSections = [
  {
    key: 'specific' as keyof SmartGoalData,
    title: 'Specific',
    icon: Target,
    description: 'Clear and well-defined objective',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    key: 'measurable' as keyof SmartGoalData,
    title: 'Measurable',
    icon: TrendingUp,
    description: 'Quantifiable metrics and milestones',
    color: 'bg-green-50 border-green-200'
  },
  {
    key: 'achievable' as keyof SmartGoalData,
    title: 'Achievable',
    icon: CheckCircle,
    description: 'Realistic and attainable',
    color: 'bg-yellow-50 border-yellow-200'
  },
  {
    key: 'relevant' as keyof SmartGoalData,
    title: 'Relevant',
    icon: Users,
    description: 'Aligned with broader objectives',
    color: 'bg-purple-50 border-purple-200'
  },
  {
    key: 'timebound' as keyof SmartGoalData,
    title: 'Time-bound',
    icon: Calendar,
    description: 'Specific deadlines and timeframes',
    color: 'bg-orange-50 border-orange-200'
  }
];

export const SmartGoalDisplay = ({ smartData, title, status, targetDate, getStatusColor }: SmartGoalDisplayProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['specific']));

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="space-y-4">
      {/* Goal Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(status)}>
                {status}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                SMART Goal
              </Badge>
            </div>
          </div>
          {targetDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              Target: {new Date(targetDate).toLocaleDateString()}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* SMART Sections */}
      <div className="space-y-3">
        {smartSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(section.key);
          const content = smartData[section.key];

          if (!content) return null;

          return (
            <Card key={section.key} className={`border-l-4 ${section.color}`}>
              <Collapsible 
                open={isExpanded} 
                onOpenChange={() => toggleSection(section.key)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/25 transition-colors py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="font-semibold text-sm">{section.title}</div>
                          <div className="text-xs text-muted-foreground">{section.description}</div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 pb-4">
                    <div className="text-sm text-gray-700 whitespace-pre-line">
                      {content}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
