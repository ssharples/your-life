
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
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
  Settings,
  Search,
  History
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const navigationItems = [
  { id: 'overview', title: 'Overview', icon: BarChart3, description: 'Dashboard and analytics' },
  { id: 'pillars', title: 'Pillars', icon: Building2, description: 'Life foundation areas' },
  { id: 'goals', title: 'Goals', icon: Target, description: 'Set and track goals' },
  { id: 'projects', title: 'Projects', icon: FolderOpen, description: 'Manage your projects' },
  { id: 'tasks', title: 'Tasks', icon: CheckSquare, description: 'Task management' },
  { id: 'habits', title: 'Habits', icon: Clock, description: 'Build and track habits' },
  { id: 'journals', title: 'Journal', icon: BookOpen, description: 'Daily journaling' },
  { id: 'knowledge', title: 'Knowledge', icon: Lightbulb, description: 'Knowledge vault' },
  { id: 'knowledge-graph', title: 'Knowledge Graph', icon: Lightbulb, description: 'Visual knowledge connections' },
  { id: 'reviews', title: 'Reviews', icon: Calendar, description: 'Periodic reviews' },
  { id: 'values', title: 'Values', icon: Heart, description: 'Core values management' },
  { id: 'settings', title: 'Settings', icon: Settings, description: 'App configuration' },
];

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SpotlightSearch = ({ isOpen, onClose, activeTab, setActiveTab }: SpotlightSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentPages, setRecentPages] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // Load recent pages from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent-pages');
    if (stored) {
      setRecentPages(JSON.parse(stored));
    }
  }, []);

  // Track page visits
  useEffect(() => {
    if (activeTab && isOpen === false) {
      const updatedRecent = [activeTab, ...recentPages.filter(page => page !== activeTab)].slice(0, 5);
      setRecentPages(updatedRecent);
      localStorage.setItem('recent-pages', JSON.stringify(updatedRecent));
    }
  }, [activeTab]);

  const handleSelect = (value: string) => {
    setActiveTab(value);
    onClose();
    setSearchQuery('');
  };

  const filteredItems = navigationItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentItems = navigationItems.filter(item => recentPages.includes(item.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`overflow-hidden p-0 shadow-2xl w-full max-w-2xl rounded-3xl ${
        isMobile 
          ? 'fixed top-4 left-4 right-4 mx-0 translate-x-0 translate-y-0' 
          : 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      }`}>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput
            placeholder="Search sections..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="rounded-t-3xl"
          />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No results found.</CommandEmpty>
            
            {!searchQuery && recentItems.length > 0 && (
              <CommandGroup heading="Recently Accessed">
                {recentItems.map((item) => (
                  <CommandItem
                    key={`recent-${item.id}`}
                    value={item.id}
                    onSelect={handleSelect}
                    className="flex items-center gap-2 cursor-pointer rounded-2xl"
                  >
                    <History className="h-4 w-4 text-muted-foreground" />
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandGroup heading={searchQuery ? "Search Results" : "All Sections"}>
              {filteredItems
                .filter(item => !(!searchQuery && recentPages.includes(item.id)))
                .map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={handleSelect}
                    className="flex items-center gap-2 cursor-pointer rounded-2xl"
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                    {activeTab === item.id && (
                      <span className="ml-auto text-xs text-blue-600">Current</span>
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
