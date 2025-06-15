
import React, { createContext, useContext, useState } from 'react';

interface HelpContextType {
  showHelp: boolean;
  toggleHelp: () => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const HelpProvider = ({ children }: { children: React.ReactNode }) => {
  const [showHelp, setShowHelp] = useState(true);

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <HelpContext.Provider value={{ showHelp, toggleHelp }}>
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};
