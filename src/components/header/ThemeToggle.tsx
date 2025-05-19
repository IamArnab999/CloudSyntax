
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Toggle 
      variant="outline"
      size="sm"
      pressed={theme === 'dark'}
      onPressedChange={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </Toggle>
  );
};
