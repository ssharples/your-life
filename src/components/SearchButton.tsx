
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
        onClick={() => setIsSearchOpen(true)}
        className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center p-0"
        title="Search (⌘K)"
      >
        <Search className="h-5 w-5 text-white" />
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
