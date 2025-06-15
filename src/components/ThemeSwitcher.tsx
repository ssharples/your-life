
import { useState } from 'react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, Sun, Moon, Flower, Sunset, CloudMoon } from 'lucide-react';

const themeConfig = {
  light: {
    name: 'Light',
    icon: Sun,
    description: 'Clean and bright',
    preview: 'bg-white border-gray-200'
  },
  dark: {
    name: 'Dark',
    icon: Moon,
    description: 'Easy on the eyes',
    preview: 'bg-gray-900 border-gray-700'
  },
  pastel: {
    name: 'Pastel',
    icon: Flower,
    description: 'Soft and gentle',
    preview: 'bg-pink-50 border-pink-200'
  },
  sunset: {
    name: 'Sunset',
    icon: Sunset,
    description: 'Warm and energetic',
    preview: 'bg-orange-50 border-orange-200'
  },
  dusk: {
    name: 'Dusk',
    icon: CloudMoon,
    description: 'Purple twilight',
    preview: 'bg-purple-900 border-purple-700'
  }
};

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const currentThemeConfig = themeConfig[theme];
  const CurrentIcon = currentThemeConfig.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Palette className="h-4 w-4 mr-2" />
          <span className="flex-1 text-left">Theme</span>
          <CurrentIcon className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" className="w-64 p-2">
        <div className="space-y-1">
          <h4 className="font-medium text-sm mb-3">Choose your theme</h4>
          {(Object.entries(themeConfig) as [Theme, typeof themeConfig[Theme]][]).map(([themeKey, config]) => {
            const Icon = config.icon;
            const isActive = theme === themeKey;
            
            return (
              <Button
                key={themeKey}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start h-auto p-3"
                onClick={() => {
                  setTheme(themeKey);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-8 h-8 rounded border-2 ${config.preview} flex items-center justify-center`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{config.name}</div>
                    <div className="text-xs text-muted-foreground">{config.description}</div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
