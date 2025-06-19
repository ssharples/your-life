
import { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  CheckSquare,
  Calendar,
  Target,
  Lightbulb,
  FolderOpen,
  Clock,
  Heart,
  Building2,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from './ThemeSwitcher';

const navigationItems = [
  { title: 'Overview', url: 'overview', icon: BarChart3, color: 'bg-blue-500' },
  { title: 'Pillars', url: 'pillars', icon: Building2, color: 'bg-purple-500' },
  { title: 'Goals', url: 'goals', icon: Target, color: 'bg-green-500' },
  { title: 'Projects', url: 'projects', icon: FolderOpen, color: 'bg-orange-500' },
  { title: 'Tasks', url: 'tasks', icon: CheckSquare, color: 'bg-red-500' },
  { title: 'Habits', url: 'habits', icon: Clock, color: 'bg-indigo-500' },
  { title: 'Journal', url: 'journals', icon: BookOpen, color: 'bg-yellow-500' },
  { title: 'Knowledge', url: 'knowledge', icon: Lightbulb, color: 'bg-amber-500' },
  { title: 'Reviews', url: 'reviews', icon: Calendar, color: 'bg-teal-500' },
  { title: 'Values', url: 'values', icon: Heart, color: 'bg-pink-500' },
];

const actionItems = [
  { title: 'Settings', url: 'settings', icon: Settings, color: 'bg-gray-500' },
];

interface FloatingNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showHelp: boolean;
  toggleHelp: () => void;
  onSignOut: () => void;
  userEmail?: string;
}

export function FloatingNav({ 
  activeTab, 
  setActiveTab, 
  showHelp,
  toggleHelp,
  onSignOut, 
  userEmail 
}: FloatingNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavClick = (url: string) => {
    setActiveTab(url);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Main FAB */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={handleToggle}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
            "active:scale-95 hover:shadow-xl",
            isExpanded 
              ? "bg-red-500 rotate-45" 
              : "bg-blue-500 hover:bg-blue-600"
          )}
        >
          {isExpanded ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Navigation Buttons */}
        {isExpanded && (
          <div className="absolute bottom-16 left-0 space-y-3">
            {/* Main Navigation */}
            {navigationItems.map((item, index) => (
              <div
                key={item.url}
                className="flex items-center gap-3 animate-fade-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 shadow-md whitespace-nowrap">
                  {item.title}
                </span>
                <button
                  onClick={() => handleNavClick(item.url)}
                  className={cn(
                    "w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center",
                    "active:scale-90 hover:shadow-xl",
                    item.color,
                    activeTab === item.url && "ring-2 ring-white ring-offset-2"
                  )}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </button>
              </div>
            ))}

            {/* Separator */}
            <div className="h-px bg-white/20 my-2 mx-2" />

            {/* Action Items */}
            {actionItems.map((item, index) => (
              <div
                key={item.url}
                className="flex items-center gap-3 animate-fade-in"
                style={{
                  animationDelay: `${(navigationItems.length + index) * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 shadow-md whitespace-nowrap">
                  {item.title}
                </span>
                <button
                  onClick={() => handleNavClick(item.url)}
                  className={cn(
                    "w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center",
                    "active:scale-90 hover:shadow-xl",
                    item.color,
                    activeTab === item.url && "ring-2 ring-white ring-offset-2"
                  )}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </button>
              </div>
            ))}

            {/* Help Toggle */}
            <div
              className="flex items-center gap-3 animate-fade-in"
              style={{
                animationDelay: `${(navigationItems.length + actionItems.length) * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 shadow-md whitespace-nowrap">
                {showHelp ? 'Hide Help' : 'Show Help'}
              </span>
              <button
                onClick={() => {
                  toggleHelp();
                  setIsExpanded(false);
                }}
                className={cn(
                  "w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center",
                  "active:scale-90 hover:shadow-xl bg-cyan-500",
                  showHelp && "ring-2 ring-white ring-offset-2"
                )}
              >
                <HelpCircle className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Theme Switcher */}
            <div
              className="animate-fade-in"
              style={{
                animationDelay: `${(navigationItems.length + actionItems.length + 1) * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <ThemeSwitcher />
            </div>

            {/* Sign Out */}
            <div
              className="flex items-center gap-3 animate-fade-in"
              style={{
                animationDelay: `${(navigationItems.length + actionItems.length + 2) * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 shadow-md whitespace-nowrap">
                Sign Out
              </span>
              <button
                onClick={() => {
                  onSignOut();
                  setIsExpanded(false);
                }}
                className="w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center active:scale-90 hover:shadow-xl bg-red-500"
              >
                <LogOut className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Info - Bottom Right */}
      {userEmail && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg text-sm font-medium text-gray-900 flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline truncate max-w-32">{userEmail}</span>
          </div>
        </div>
      )}
    </>
  );
}
