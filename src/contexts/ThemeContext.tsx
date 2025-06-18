
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'pastel' | 'sunset' | 'dusk';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('lifeos-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'pastel', 'sunset', 'dusk');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('lifeos-theme', theme);
    
    // Apply theme-specific CSS variables
    switch (theme) {
      case 'light':
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--foreground', '222.2 84% 4.9%');
        root.style.setProperty('--primary', '222.2 47.4% 11.2%');
        root.style.setProperty('--primary-foreground', '210 40% 98%');
        root.style.setProperty('--muted', '210 40% 96.1%');
        root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
        break;
      case 'dark':
        root.style.setProperty('--background', '222.2 84% 4.9%');
        root.style.setProperty('--foreground', '210 40% 98%');
        root.style.setProperty('--primary', '210 40% 98%');
        root.style.setProperty('--primary-foreground', '222.2 47.4% 11.2%');
        root.style.setProperty('--muted', '217.2 32.6% 17.5%');
        root.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
        break;
      case 'pastel':
        root.style.setProperty('--background', '330 100% 98%');
        root.style.setProperty('--foreground', '240 10% 20%');
        root.style.setProperty('--primary', '340 80% 60%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--muted', '320 20% 95%');
        root.style.setProperty('--muted-foreground', '240 5% 50%');
        break;
      case 'sunset':
        root.style.setProperty('--background', '20 100% 97%');
        root.style.setProperty('--foreground', '20 10% 15%');
        root.style.setProperty('--primary', '15 90% 50%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--muted', '25 30% 92%');
        root.style.setProperty('--muted-foreground', '20 5% 45%');
        break;
      case 'dusk':
        root.style.setProperty('--background', '240 20% 15%');
        root.style.setProperty('--foreground', '240 10% 90%');
        root.style.setProperty('--primary', '260 70% 65%');
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--muted', '240 15% 20%');
        root.style.setProperty('--muted-foreground', '240 5% 70%');
        break;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
