
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
      {/* Full screen backdrop on mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
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

        {/* Navigation Menu - Full screen on mobile */}
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
              {/* Main Navigation */}
              {navigationItems.map((item, index) => (
                <div
                  key={item.url}
                  className="flex items-center justify-between w-full animate-fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <button
                    onClick={() => handleNavClick(item.url)}
                    className={cn(
                      "flex items-center gap-4 w-full p-4 rounded-3xl shadow-lg transition-all duration-200",
                      "active:scale-95 hover:shadow-xl bg-white/90 backdrop-blur-sm",
                      activeTab === item.url && "ring-2 ring-blue-500 ring-offset-2"
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

              {/* Separator */}
              <div className="h-px bg-gray-200 my-4" />

              {/* Action Items */}
              {actionItems.map((item, index) => (
                <div
                  key={item.url}
                  className="flex items-center justify-between w-full animate-fade-in"
                  style={{
                    animationDelay: `${(navigationItems.length + index) * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <button
                    onClick={() => handleNavClick(item.url)}
                    className={cn(
                      "flex items-center gap-4 w-full p-4 rounded-3xl shadow-lg transition-all duration-200",
                      "active:scale-95 hover:shadow-xl bg-white/90 backdrop-blur-sm",
                      activeTab === item.url && "ring-2 ring-blue-500 ring-offset-2"
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

              {/* Help Toggle */}
              <div
                className="flex items-center justify-between w-full animate-fade-in"
                style={{
                  animationDelay: `${(navigationItems.length + actionItems.length) * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <button
                  onClick={() => {
                    toggleHelp();
                    setIsExpanded(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 w-full p-4 rounded-3xl shadow-lg transition-all duration-200",
                    "active:scale-95 hover:shadow-xl bg-white/90 backdrop-blur-sm",
                    showHelp && "ring-2 ring-cyan-500 ring-offset-2"
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-gray-900 flex-1 text-left">
                    {showHelp ? 'Hide Help' : 'Show Help'}
                  </span>
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
                <div className="flex items-center justify-center w-full p-4">
                  <ThemeSwitcher />
                </div>
              </div>

              {/* Sign Out */}
              <div
                className="flex items-center justify-between w-full animate-fade-in"
                style={{
                  animationDelay: `${(navigationItems.length + actionItems.length + 2) * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <button
                  onClick={() => {
                    onSignOut();
                    setIsExpanded(false);
                  }}
                  className="flex items-center gap-4 w-full p-4 rounded-3xl shadow-lg transition-all duration-200 active:scale-95 hover:shadow-xl bg-white/90 backdrop-blur-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                    <LogOut className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-medium text-gray-900 flex-1 text-left">
                    Sign Out
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Info - Bottom Right */}
      {userEmail && !isExpanded && (
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
