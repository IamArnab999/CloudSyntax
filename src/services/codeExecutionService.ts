
// This is a mock service that simulates code execution
// In a real application, this would connect to a backend service or API

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

export const executeCode = async (code: string, language: string): Promise<ExecutionResult> => {
  // Simulate network delay
  await delay(Math.random() * 1000 + 500);
  
  // Mock execution based on language
  try {
    switch (language) {
      case 'javascript':
        return executeJavaScript(code);
      case 'python':
        return executePython(code);
      case 'java':
        return executeJava(code);
      case 'cpp':
        return executeCpp(code);
      case 'csharp':
        return executeCSharp(code);
      default:
        return {
          output: '',
          error: `Language '${language}' is not supported yet`,
          executionTime: 0
        };
    }
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      executionTime: 0
    };
  }
};

// Mock execution for each language
// In reality, these would send the code to a backend service

const executeJavaScript = (code: string): ExecutionResult => {
  // Simple mock for JS execution
  const startTime = performance.now();
  let output = '';
  let error = null;
  
  try {
    // Intercept console.log
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      output += args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ') + '\\n';
    };
    
    // Very unsafe, but this is just a mock
    // eslint-disable-next-line no-new-func
    new Function(code)();
    
    // Restore console.log
    console.log = originalConsoleLog;
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error executing JavaScript';
  }
  
  const executionTime = performance.now() - startTime;
  
  return { output, error, executionTime };
};

const executePython = (code: string): ExecutionResult => {
  // Mock Python execution
  const startTime = performance.now();
  
  // Look for print statements and extract their contents
  let output = '';
  const printRegex = /print\s*\(\s*["'](.+?)["']\s*\)/g;
  let match;
  
  while ((match = printRegex.exec(code)) !== null) {
    output += match[1] + '\\n';
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    output: output || 'No output detected. Make sure you use print() statements.',
    error: null,
    executionTime
  };
};

const executeJava = (code: string): ExecutionResult => {
  // Mock Java execution
  const startTime = performance.now();
  
  // Look for System.out.println statements
  let output = '';
  const printRegex = /System\.out\.println\s*\(\s*["'](.+?)["']\s*\)/g;
  let match;
  
  while ((match = printRegex.exec(code)) !== null) {
    output += match[1] + '\\n';
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    output: output || 'No output detected. Make sure you use System.out.println() statements.',
    error: null,
    executionTime
  };
};

const executeCpp = (code: string): ExecutionResult => {
  // Mock C++ execution
  const startTime = performance.now();
  
  // Look for std::cout statements
  let output = '';
  const coutRegex = /std::cout\s*<<\s*["'](.+?)["']/g;
  let match;
  
  while ((match = coutRegex.exec(code)) !== null) {
    output += match[1];
  }
  
  // Look for std::endl
  if (code.includes('std::endl')) {
    output += '\\n';
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    output: output || 'No output detected. Make sure you use std::cout statements.',
    error: null,
    executionTime
  };
};

const executeCSharp = (code: string): ExecutionResult => {
  // Mock C# execution
  const startTime = performance.now();
  
  // Look for Console.WriteLine statements
  let output = '';
  const consoleRegex = /Console\.WriteLine\s*\(\s*["'](.+?)["']\s*\)/g;
  let match;
  
  while ((match = consoleRegex.exec(code)) !== null) {
    output += match[1] + '\\n';
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    output: output || 'No output detected. Make sure you use Console.WriteLine() statements.',
    error: null,
    executionTime
  };
};
