
import { useState } from 'react';
import {
  Plus,
  Target,
  CheckSquare,
  Calendar,
  FolderOpen,
  Clock,
  BookOpen,
  Lightbulb,
  Building2,
  Heart,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const quickAddItems = [
  { title: 'Goal', type: 'goal', icon: Target, color: 'bg-green-500' },
  { title: 'Task', type: 'task', icon: CheckSquare, color: 'bg-red-500' },
  { title: 'Project', type: 'project', icon: FolderOpen, color: 'bg-orange-500' },
  { title: 'Habit', type: 'habit', icon: Clock, color: 'bg-indigo-500' },
  { title: 'Journal Entry', type: 'journal', icon: BookOpen, color: 'bg-yellow-500' },
  { title: 'Knowledge Note', type: 'knowledge', icon: Lightbulb, color: 'bg-amber-500' },
  { title: 'Pillar', type: 'pillar', icon: Building2, color: 'bg-purple-500' },
  { title: 'Value', type: 'value', icon: Heart, color: 'bg-pink-500' },
];

interface FloatingNavProps {
  onQuickAdd: (type: string) => void;
}

export function FloatingNav({ onQuickAdd }: FloatingNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleQuickAdd = (type: string) => {
    onQuickAdd(type);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Full screen backdrop on mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-150"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '100vh',
            width: '100vw'
          }}
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Main FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleToggle}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center",
            "active:scale-95 hover:shadow-xl",
            isExpanded 
              ? "bg-red-500 rotate-45" 
              : "bg-blue-500 hover:bg-blue-600"
          )}
        >
          {isExpanded ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Plus className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Quick Add Menu - Full screen on mobile */}
        {isExpanded && (
          <div 
            className="fixed inset-0 z-45 flex flex-col items-center justify-center p-6 overflow-y-auto"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height: '100vh',
              width: '100vw'
            }}
          >
            <div className="w-full max-w-sm space-y-4">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Quick Add</h2>
                <p className="text-white/80">What would you like to create?</p>
              </div>

              {/* Quick Add Items */}
              {quickAddItems.map((item, index) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between w-full animate-fade-in-fast"
                  style={{
                    animationDelay: `${index * 15}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <button
                    onClick={() => handleQuickAdd(item.type)}
                    className={cn(
                      "flex items-center gap-4 w-full p-4 rounded-3xl shadow-lg transition-all duration-150",
                      "active:scale-95 hover:shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      item.color
                    )}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg font-medium text-gray-900 flex-1 text-left">
                      {item.title}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
