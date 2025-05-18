
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  language: string;
  code: string;
  createdAt: Date;
}

interface ProjectsListProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  const fetchProjects = async () => {
    if (!currentUser) {
      setProjects([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('userId', currentUser.id);
      
      if (error) throw error;
      
      const projectsData = data.map(project => ({
        ...project,
        createdAt: new Date(project.createdAt),
      })) as Project[];

      setProjects(projectsData.sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      ));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to create projects",
      });
      navigate('/auth');
      return;
    }

    if (!newProjectName.trim()) {
      toast({
        variant: "destructive",
        title: "Project name required",
        description: "Please enter a project name",
      });
      return;
    }

    try {
      const newProject = {
        name: newProjectName,
        language: 'javascript',
        code: 'console.log("Hello, World!");',
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
      };

      const { error } = await supabase.from('projects').insert(newProject);
      
      if (error) throw error;
      
      toast({
        title: "Project created",
        description: `${newProjectName} has been created`,
      });
      setNewProjectName('');
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        variant: "destructive",
        title: "Failed to create project",
        description: "An error occurred while creating the project",
      });
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Project deleted",
        description: "The project has been deleted",
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete project",
        description: "An error occurred while deleting the project",
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Sign in to manage projects</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2" 
          onClick={() => navigate('/auth')}
        >
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">My Projects</h2>
        <div className="flex gap-2">
          <Input
            placeholder="New project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <Button onClick={handleCreateProject} size="sm">
            Create
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((project) => (
                <li 
                  key={project.id}
                  className="p-2 rounded hover:bg-muted cursor-pointer flex justify-between items-center"
                  onClick={() => onSelectProject(project)}
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.language}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-50 hover:opacity-100 text-destructive"
                    onClick={(e) => handleDeleteProject(project.id, e)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
