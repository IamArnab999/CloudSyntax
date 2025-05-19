
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { saveProject } from '@/services/projectService';
import { useIsMobile } from '@/hooks/use-mobile';

interface Project {
  id: string;
  name: string;
  language: string;
  code: string;
}

export const useProject = () => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    setCurrentCode(project.code);
    setCurrentLanguage(project.language);
    setProjectName(project.name);
    
    if (isMobile) {
      return false; // Return false to indicate we should hide sidebar
    }
    return true;
  };

  const openSaveDialog = () => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to save projects",
      });
      navigate('/auth');
      return;
    }

    if (!currentCode) {
      toast({
        variant: "destructive",
        title: "No code to save",
        description: "Please write some code before saving",
      });
      return;
    }

    setSaveDialogOpen(true);
  };

  const handleSaveProject = async () => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to save projects",
      });
      navigate('/auth');
      return;
    }

    if (!projectName.trim()) {
      toast({
        variant: "destructive",
        title: "Project name required",
        description: "Please enter a project name",
      });
      return;
    }

    try {
      const projectId = await saveProject({
        userId: currentUser.id,
        name: projectName,
        language: currentLanguage,
        code: currentCode,
        projectId: currentProject?.id
      });

      toast({
        title: "Project saved",
        description: `${projectName} has been saved`,
      });
      setSaveDialogOpen(false);
      
      if (!currentProject) {
        setCurrentProject({
          id: projectId,
          name: projectName,
          language: currentLanguage,
          code: currentCode
        });
      }
      
      return true; // Return true to indicate we should show sidebar on mobile
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        variant: "destructive",
        title: "Failed to save project",
        description: "An error occurred while saving the project",
      });
      return false;
    }
  };

  return {
    currentProject,
    projectName,
    setProjectName,
    currentCode,
    setCurrentCode,
    currentLanguage,
    setCurrentLanguage,
    saveDialogOpen,
    setSaveDialogOpen,
    handleSelectProject,
    openSaveDialog,
    handleSaveProject
  };
};
