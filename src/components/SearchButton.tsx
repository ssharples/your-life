
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { SpotlightSearch } from './SpotlightSearch';

interface SearchButtonProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SearchButton = ({ activeTab, setActiveTab }: SearchButtonProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <span className="hidden sm:inline text-xs text-muted-foreground ml-auto">
          ⌘K
        </span>
      </Button>

      <SpotlightSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
};
