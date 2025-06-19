
import { useState, useEffect } from 'react';

// Extend Navigator interface to include Safari's standalone property
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

export const useStandaloneMode = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (iOS PWA)
    const checkStandalone = () => {
      return (
        window.navigator.standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches
      );
    };

    setIsStandalone(checkStandalone());

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => setIsStandalone(checkStandalone());
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isStandalone;
};
