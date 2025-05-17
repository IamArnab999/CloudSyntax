
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoom } from '@/contexts/RoomContext';

interface CodeEditorProps {
  onExecute: (code: string, language: string) => void;
  isExecuting: boolean;
}

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', defaultCode: 'console.log("Hello, World!");' },
  { id: 'python', name: 'Python', defaultCode: 'print("Hello, World!")' },
  { id: 'java', name: 'Java', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { id: 'cpp', name: 'C++', defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
  { id: 'csharp', name: 'C#', defaultCode: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}' }
];

export const CodeEditor: React.FC<CodeEditorProps> = ({ onExecute, isExecuting }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  const { toast } = useToast();
  const { roomId, sendCodeUpdate, receivedCode, receivedLanguage } = useRoom();

  // Update code when receiving new code from room
  useEffect(() => {
    if (receivedCode && receivedLanguage && language === receivedLanguage) {
      setCode(receivedCode);
    }
  }, [receivedCode, receivedLanguage, language]);

  const handleLanguageChange = (value: string) => {
    const selectedLanguage = LANGUAGES.find(lang => lang.id === value);
    if (selectedLanguage) {
      setLanguage(value);
      setCode(selectedLanguage.defaultCode);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      
      // If we're in a room, send code updates to other participants
      if (roomId) {
        sendCodeUpdate(value, language);
      }
    }
  };

  const handleExecute = () => {
    if (code.trim() === '') {
      toast({
        variant: "destructive",
        title: "Empty code",
        description: "Please write some code before executing.",
      });
      return;
    }
    onExecute(code, language);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 p-2 bg-editor-bg rounded-t-md">
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(lang => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={handleExecute} 
          disabled={isExecuting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isExecuting ? 'Running...' : 'Run Code'}
        </Button>
      </div>
      <div className="flex-1 border rounded-b-md overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
};
