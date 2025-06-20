
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Flag, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO, isValid } from 'date-fns';

interface TaskInputProps {
  onSubmit: (taskData: {
    description: string;
    priority: number;
    dueDate: string;
    projectId: string;
    goalId: string;
    tags: string;
  }) => void;
  goals?: any[];
  projects?: any[];
}

export const TaskInput = ({ onSubmit, goals = [], projects = [] }: TaskInputProps) => {
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState({
    description: '',
    dueDate: '',
    priority: 3,
    projectId: '',
    goalId: '',
    tags: ''
  });
  const [showExtras, setShowExtras] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Natural language date parsing patterns
  const parseNaturalDate = (text: string) => {
    const today = new Date();
    const patterns = [
      { regex: /\btoday\b/i, date: () => format(today, 'yyyy-MM-dd') },
      { regex: /\btomorrow\b/i, date: () => {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return format(tomorrow, 'yyyy-MM-dd');
      }},
      { regex: /\bnext week\b/i, date: () => {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return format(nextWeek, 'yyyy-MM-dd');
      }},
      { regex: /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/g, date: (match: RegExpMatchArray) => {
        const month = parseInt(match[1]) - 1;
        const day = parseInt(match[2]);
        const year = match[3] ? parseInt(match[3]) : today.getFullYear();
        const fullYear = year < 100 ? 2000 + year : year;
        const date = new Date(fullYear, month, day);
        return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
      }},
      { regex: /(\d{4})-(\d{1,2})-(\d{1,2})/g, date: (match: RegExpMatchArray) => {
        const date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
      }}
    ];

    let cleanText = text;
    let foundDate = '';

    for (const pattern of patterns) {
      if (typeof pattern.date === 'function' && !pattern.regex.global) {
        if (pattern.regex.test(text)) {
          foundDate = pattern.date();
          cleanText = text.replace(pattern.regex, '').trim();
          break;
        }
      } else {
        const match = pattern.regex.exec(text);
        if (match) {
          foundDate = pattern.date(match);
          cleanText = text.replace(match[0], '').trim();
          pattern.regex.lastIndex = 0; // Reset regex state
          break;
        }
      }
    }

    return { description: cleanText, dueDate: foundDate };
  };

  useEffect(() => {
    const parsed = parseNaturalDate(input);
    setParsedData(prev => ({
      ...prev,
      description: parsed.description,
      dueDate: parsed.dueDate
    }));
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedData.description.trim()) return;

    onSubmit(parsedData);
    setInput('');
    setParsedData({
      description: '',
      dueDate: '',
      priority: 3,
      projectId: '',
      goalId: '',
      tags: ''
    });
    setShowExtras(false);
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'text-red-500';
    if (priority === 3) return 'text-orange-500';
    return 'text-gray-400';
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = parseISO(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
        return 'Today';
      } else if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
        return 'Tomorrow';
      } else {
        return format(date, 'MMM d');
      }
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="New Reminder"
              className="border-none shadow-none text-base placeholder:text-gray-400 focus-visible:ring-0 p-0"
              autoFocus
            />
          </div>

          {/* Parsed information display */}
          {(parsedData.dueDate || parsedData.priority !== 3) && (
            <div className="flex items-center gap-2 mt-3 ml-8">
              {parsedData.dueDate && (
                <Badge variant="outline" className="text-xs text-red-500 border-red-200">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDateDisplay(parsedData.dueDate)}
                </Badge>
              )}
              {parsedData.priority !== 3 && (
                <Badge variant="outline" className="text-xs">
                  <Flag className={`w-3 h-3 mr-1 ${getPriorityColor(parsedData.priority)}`} />
                  P{parsedData.priority}
                </Badge>
              )}
            </div>
          )}

          {/* Additional options */}
          {showExtras && (
            <div className="mt-4 ml-8 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Select value={parsedData.goalId} onValueChange={(value) => 
                  setParsedData(prev => ({ ...prev, goalId: value }))
                }>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals?.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={parsedData.projectId} onValueChange={(value) => 
                  setParsedData(prev => ({ ...prev, projectId: value }))
                }>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                value={parsedData.tags}
                onChange={(e) => setParsedData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Tags (comma-separated)"
                className="h-8 text-sm"
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowExtras(!showExtras)}
                className="h-7 px-2 text-xs text-gray-500"
              >
                <Clock className="w-3 h-3 mr-1" />
                {showExtras ? 'Less' : 'More'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setInput('');
                  setShowExtras(false);
                }}
                className="h-7 px-2 text-xs text-gray-500"
              >
                <X className="w-3 h-3" />
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!parsedData.description.trim()}
                className="h-7 px-3 text-xs"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Help text */}
      <div className="px-4 pb-3 text-xs text-gray-400">
        Try: "Buy groceries tomorrow", "Call mom today", "Meeting 12/25"
      </div>
    </div>
  );
};
