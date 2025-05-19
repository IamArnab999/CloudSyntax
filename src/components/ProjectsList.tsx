import React, { useState, useEffect } from 'react';
import { getProjects, deleteProject } from '@/services/projectService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Project {
  id: string;
  name: string;
  language: string;
  code: string;
}

interface ProjectsListProps {
  onSelectProject: (project: Project) => void;
  onBack?: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ onSelectProject, onBack }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      if (currentUser) {
        const data = await getProjects(currentUser.id);
        setProjects(data || []);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        variant: "destructive",
        title: "Failed to load projects",
        description: "An error occurred while loading your projects",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(project => project.id !== projectId));
      toast({
        title: "Project deleted",
        description: "Your project has been successfully deleted",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete project",
        description: "An error occurred while deleting the project",
      });
    }
  };

  const handleSelectProject = (project: any) => {
    const formattedProject: Project = {
      id: project.id,
      name: project.name,
      language: project.language,
      code: project.code
    };
    onSelectProject(formattedProject);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };

  if (!currentUser) {
    return (
      <div className="p-4 text-center h-full flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Sign in to view your saved projects</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-sidebar p-2 md:p-3 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack} className="md:hidden">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-lg font-semibold">My Projects</h2>
        </div>
        <Button variant="outline" size="sm" onClick={fetchProjects}>
          Refresh
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1 p-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No saved projects yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create and save your first project
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {projects.map((project) => (
              <li
                key={project.id}
                className="border rounded-md p-2 hover:bg-secondary/50 cursor-pointer transition-colors flex justify-between group"
              >
                <div 
                  className="flex-1 overflow-hidden"
                  onClick={() => handleSelectProject(project)}
                >
                  <h3 className="font-medium truncate">{project.name}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="capitalize">{project.language}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(project.createdat)}</span>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Project</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{project.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(project.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;