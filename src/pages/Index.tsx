
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ProjectsList } from '@/components/ProjectsList';
import { CodeWorkspace } from '@/components/CodeWorkspace';
import { ProjectHeader } from '@/components/ProjectHeader';
import { SaveProjectDialog } from '@/components/SaveProjectDialog';
import { useProject } from '@/hooks/use-project';
import { useCodeExecution } from '@/hooks/use-code-execution';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    currentProject,
    projectName,
    setProjectName,
    setCurrentCode,
    setCurrentLanguage,
    saveDialogOpen,
    setSaveDialogOpen,
    handleSelectProject,
    openSaveDialog,
    handleSaveProject
  } = useProject();

  const {
    output,
    isExecuting,
    handleCodeExecution
  } = useCodeExecution((code, language) => {
    setCurrentCode(code);
    setCurrentLanguage(language);
  });

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const onSelectProject = (project) => {
    const keepSidebarOpen = handleSelectProject(project);
    if (!keepSidebarOpen && isMobile) {
      setShowSidebar(false);
    }
  };

  const onSaveProject = async () => {
    const showSidebarAfterSave = await handleSaveProject();
    if (showSidebarAfterSave && isMobile) {
      setShowSidebar(true);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Projects Sidebar */}
        <div 
          className={`w-full md:w-64 border-r transition-all duration-300 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 ${showSidebar ? 'absolute md:relative z-10 bg-background h-[calc(100%-64px)]' : 'hidden md:block'}`}
        >
          <ProjectsList onSelectProject={onSelectProject} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden p-2 md:p-4">
          <ProjectHeader 
            projectName={currentProject?.name || 'Untitled Project'} 
            showSidebar={showSidebar} 
            toggleSidebar={toggleSidebar}
            openSaveDialog={openSaveDialog}
          />
          
          <CodeWorkspace 
            output={output} 
            isExecuting={isExecuting} 
            onExecute={handleCodeExecution} 
          />
          
          <SaveProjectDialog 
            open={saveDialogOpen}
            setOpen={setSaveDialogOpen}
            projectName={projectName}
            setProjectName={setProjectName}
            onSave={onSaveProject}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
