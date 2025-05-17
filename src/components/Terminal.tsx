
import React from 'react';

interface TerminalProps {
  output: string;
  isExecuting: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ output, isExecuting }) => {
  // Process the output to handle escaped characters
  const processOutput = (text: string) => {
    // Replace literal '\n' with actual newlines
    return text.replace(/\\n/g, '\n');
  };

  const processedOutput = processOutput(output);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-terminal-bg p-2 text-white rounded-t-md">
        <span>Output</span>
      </div>
      <div className="flex-1 bg-terminal-bg rounded-b-md p-3 text-terminal-text font-mono overflow-y-auto">
        <pre className="whitespace-pre-wrap">{processedOutput}</pre>
        {isExecuting && (
          <span className="inline-block h-4 w-2 bg-white ml-1 animate-cursor-blink"></span>
        )}
      </div>
    </div>
  );
};
