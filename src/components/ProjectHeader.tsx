
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Menu, Save, ArrowLeft } from 'lucide-react';

interface ProjectHeaderProps {
  projectName: string;
  showSidebar: boolean;
  toggleSidebar: () => void;
  openSaveDialog: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  showSidebar,
  toggleSidebar,
  openSaveDialog
}) => {
  return (
    <div className="flex justify-between items-center mb-2 md:mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          {showSidebar ? <ArrowLeft size={18} /> : <Menu size={18} />}
        </Button>
        <h2 className="text-base md:text-lg font-semibold truncate max-w-[150px] md:max-w-none">
          {projectName || 'Untitled Project'}
        </h2>
      </div>
      
      <Button size="sm" onClick={openSaveDialog} className="flex items-center gap-1">
        <Save size={16} className="hidden sm:block" />
        <span>Save</span>
      </Button>
    </div>
  );
};
