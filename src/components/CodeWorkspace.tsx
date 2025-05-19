
import React from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { Terminal } from '@/components/Terminal';

interface CodeWorkspaceProps {
  output: string;
  isExecuting: boolean;
  onExecute: (code: string, language: string) => void;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  output,
  isExecuting,
  onExecute
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-2 md:gap-4 flex-1 overflow-hidden">
      <div className="h-[40vh] md:h-auto">
        <CodeEditor 
          onExecute={onExecute} 
          isExecuting={isExecuting} 
        />
      </div>
      <div className="h-[40vh] md:h-auto">
        <Terminal 
          output={output} 
          isExecuting={isExecuting} 
        />
      </div>
    </div>
  );
};
