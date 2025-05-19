import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoom } from '@/contexts/RoomContext';

interface CodeEditorProps {
  onExecute: (code: string, language: string) => void;
  isExecuting: boolean;
  initialCode?: string;
  initialLanguage?: string;
}

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', defaultCode: 'console.log("Hello, World!");' },
  { id: 'python', name: 'Python', defaultCode: 'print("Hello, World!")' },
  { id: 'java', name: 'Java', defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { id: 'cpp', name: 'C++', defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
  { id: 'csharp', name: 'C#', defaultCode: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}' },
  { id: 'c', name: 'C', defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' },
  { id: 'kotlin', name: 'Kotlin', defaultCode: 'fun main() {\n    println("Hello, World!")\n}' },
  { id: 'swift', name: 'Swift', defaultCode: 'import Swift\n\nprint("Hello, World!")' },
  { id: 'sql', name: 'SQL', defaultCode: 'SELECT "Hello, World!" AS greeting;' },
  { id: 'go', name: 'Go', defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' }
];

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  onExecute, 
  isExecuting,
  initialCode,
  initialLanguage 
}) => {
  const [language, setLanguage] = useState(initialLanguage || 'javascript');
  const [code, setCode] = useState(initialCode || LANGUAGES[0].defaultCode);
  const { toast } = useToast();
  const { roomId, sendCodeUpdate, receivedCode, receivedLanguage } = useRoom();

  useEffect(() => {
    if (initialLanguage) {
      setLanguage(initialLanguage);
    }
    
    if (initialCode) {
      setCode(initialCode);
    } else if (initialLanguage) {
      const langDefault = LANGUAGES.find(lang => lang.id === initialLanguage);
      if (langDefault) {
        setCode(langDefault.defaultCode);
      }
    }
  }, [initialCode, initialLanguage]);

  useEffect(() => {
    if (receivedCode && receivedLanguage && language === receivedLanguage) {
      setCode(receivedCode);
    }
  }, [receivedCode, receivedLanguage, language]);

  const handleLanguageChange = (value: string) => {
    const selectedLanguage = LANGUAGES.find(lang => lang.id === value);
    if (selectedLanguage) {
      setLanguage(value);
      if (!code.trim() || LANGUAGES.some(lang => lang.defaultCode === code)) {
        setCode(selectedLanguage.defaultCode);
      }
      onExecute(code, value);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      
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
      <div className="flex items-center justify-between mb-2 p-2 bg-editor-bg rounded-t-md gap-2">
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
        
        <Button 
          onClick={handleExecute} 
          disabled={isExecuting}
          className="bg-green-600 hover:bg-green-700 text-sm px-3 py-1 whitespace-nowrap"
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