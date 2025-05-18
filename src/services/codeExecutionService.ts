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
      case 'c':
        return executeC(code);
      case 'kotlin':
        return executeKotlin(code);
      case 'swift':
        return executeSwift(code);
      case 'sql':
        return executeSQL(code);
      case 'go':
        return executeGo(code);
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

const executeC = (code: string): ExecutionResult => {
  // Mock C execution
  const startTime = performance.now();
  
  // Look for printf statements
  let output = '';
  const printfRegex = /printf\s*\(\s*["'](.+?)\\n?["']\s*(?:,.*?)?\)/g;
  let match;
  
  while ((match = printfRegex.exec(code)) !== null) {
    output += match[1] + '\\n';
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    output: output || 'No output detected. Make sure you use printf() statements.',
    error: null,
    executionTime
  };
};

const executeKotlin = (code: string): ExecutionResult => {
  // Mock Kotlin execution
  const startTime = performance.now();
  
  // Look for println statements
  let output = '';
  const printlnRegex = /println\s*\(\s*["'](.+?)["']\s*\)/g;
  let match;
  
  while ((match = printlnRegex.exec(code)) !== null) {
    output += match[1] + '\\n';
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    output: output || 'No output detected. Make sure you use println() statements.',
    error: null,
    executionTime
  };
};

const executeSwift = (code: string): ExecutionResult => {
  // Mock Swift execution
  const startTime = performance.now();
  
  // Look for print statements
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

const executeSQL = (code: string): ExecutionResult => {
  // Mock SQL execution
  const startTime = performance.now();
  
  // Check for SELECT statements
  let output = '';
  if (code.toLowerCase().includes('select')) {
    // Extract what's being selected
    const selectRegex = /select\s+(.+?)\s+as/i;
    const match = selectRegex.exec(code);
    
    if (match) {
      const selectedValue = match[1].replace(/['"]/g, '');
      output = `| ${selectedValue} |\\n-------------\\n`;
    } else {
      output = "Query executed successfully. 1 row(s) affected.\\n";
    }
  } else {
    output = "Query executed successfully. 0 row(s) affected.\\n";
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    output,
    error: null,
    executionTime
  };
};

const executeGo = (code: string): ExecutionResult => {
  // Mock Go execution
  const startTime = performance.now();
  
  // Look for fmt.Println statements
  let output = '';
  const printlnRegex = /fmt\.Println\s*\(\s*["'](.+?)["']\s*\)/g;
  let match;
  
  while ((match = printlnRegex.exec(code)) !== null) {
    output += match[1] + '\\n';
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    output: output || 'No output detected. Make sure you use fmt.Println() statements.',
    error: null,
    executionTime
  };
};
