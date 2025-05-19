
import { useState } from 'react';
import { executeCode } from '@/services/codeExecutionService';

export const useCodeExecution = (
  onCodeChange?: (code: string, language: string) => void
) => {
  const [output, setOutput] = useState('// Output will appear here when you run your code');
  const [isExecuting, setIsExecuting] = useState(false);
  
  const handleCodeExecution = async (code: string, language: string) => {
    setIsExecuting(true);
    setOutput('Executing code...');
    
    // Call the callback if provided
    if (onCodeChange) {
      onCodeChange(code, language);
    }
    
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

  return {
    output,
    isExecuting,
    handleCodeExecution
  };
};
