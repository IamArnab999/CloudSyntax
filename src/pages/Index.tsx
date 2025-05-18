
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/CodeEditor';
import { Terminal } from '@/components/Terminal';
import { ProjectsList } from '@/components/ProjectsList';
import { executeCode } from '@/services/codeExecutionService';
import { useToast } from '@/components/ui/use-toast';
import { saveProject } from '@/services/projectService';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  language: string;
  code: string;
}

const Index = () => {
  const [output, setOutput] = useState('// Output will appear here when you run your code');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCodeExecution = async (code: string, language: string) => {
    setIsExecuting(true);
    setOutput('Executing code...');
    setCurrentCode(code);
    setCurrentLanguage(language);
    
    try {
      const result = await executeCode(code, language);
      
      if (result.error) {
        setOutput(`Error: ${result.error}`);
      } else {
        setOutput(result.output ? result.output : '// No output generated');
        const executionTimeMs = result.executionTime.toFixed(2);
        setOutput(prev => `${prev}\n\nExecution completed in ${executionTimeMs}ms`);
      }
    } catch (error) {
      console.error('Execution error:', error);
      setOutput(`Failed to execute code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
    }
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
        projectId: currentProject?.id,
      });

      toast({
        title: "Project saved",
        description: `${projectName} has been saved`,
      });
      setSaveDialogOpen(false);
      setShowSidebar(true); // Show sidebar after saving to see updated list
      
      if (!currentProject) {
        setCurrentProject({
          id: projectId,
          name: projectName,
          language: currentLanguage,
          code: currentCode
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        variant: "destructive",
        title: "Failed to save project",
        description: "An error occurred while saving the project",
      });
    }
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    setCurrentCode(project.code);
    setCurrentLanguage(project.language);
    setProjectName(project.name);
    setShowSidebar(false);
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

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Projects Sidebar */}
        <div 
          className={`w-64 border-r transition-all duration-300 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 ${showSidebar ? 'absolute md:relative z-10 bg-background h-[calc(100%-64px)]' : 'hidden md:block'}`}
        >
          <ProjectsList onSelectProject={handleSelectProject} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? 'Hide Projects' : 'Show Projects'}
              </Button>
              <h2 className="text-lg font-semibold">
                {currentProject ? currentProject.name : 'Untitled Project'}
              </h2>
            </div>
            
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openSaveDialog}>Save Project</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Project</DialogTitle>
                  <DialogDescription>
                    Enter a name for your project. If you're updating an existing project, the original will be overwritten.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="projectName" className="text-right">
                      Project Name
                    </Label>
                    <Input
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProject}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 flex-1 overflow-hidden">
            <div className="h-[50vh] md:h-auto">
              <CodeEditor 
                onExecute={handleCodeExecution} 
                isExecuting={isExecuting} 
              />
            </div>
            <div className="h-[50vh] md:h-auto">
              <Terminal 
                output={output} 
                isExecuting={isExecuting} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
