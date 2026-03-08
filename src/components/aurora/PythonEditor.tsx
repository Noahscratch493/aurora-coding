import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

interface PythonEditorProps {
  onRun: (code: string) => void;
  isRunning: boolean;
}

const DEFAULT_PYTHON = `# Aurora Python Mode
# Write code to control your sprite!
# Available: sprite, runtime

await sprite.say("Hello from Python!")
await runtime.wait(1)

for i in range(4):
    await sprite.move(50)
    await sprite.turnRight(90)
    await runtime.tick()

await sprite.say("Done!")
`;

export default function PythonEditor({ onRun, isRunning }: PythonEditorProps) {
  const [code, setCode] = useState(DEFAULT_PYTHON);

  // Convert simple Python-like syntax to JS
  const convertToJs = (pyCode: string): string => {
    let js = pyCode;
    // Remove comments starting with #
    js = js.replace(/#.*$/gm, '');
    // for i in range(n): → for (let i = 0; i < n; i++) {
    js = js.replace(/for\s+(\w+)\s+in\s+range\((\d+)\):\s*/g, 'for (let $1 = 0; $1 < $2; $1++) {\n');
    // while condition: → while (condition) {
    js = js.replace(/while\s+(.+?):\s*$/gm, 'while ($1) {');
    // if condition: → if (condition) {
    js = js.replace(/if\s+(.+?):\s*$/gm, 'if ($1) {');
    // elif condition: → } else if (condition) {
    js = js.replace(/elif\s+(.+?):\s*$/gm, '} else if ($1) {');
    // else: → } else {
    js = js.replace(/else:\s*$/gm, '} else {');
    // True/False → true/false
    js = js.replace(/\bTrue\b/g, 'true');
    js = js.replace(/\bFalse\b/g, 'false');
    // None → null
    js = js.replace(/\bNone\b/g, 'null');
    // Handle indentation-based blocks (simplified: close blocks on dedent)
    const lines = js.split('\n');
    const result: string[] = [];
    const indentStack: number[] = [0];
    
    for (const line of lines) {
      const trimmed = line.trimStart();
      if (!trimmed) { result.push(''); continue; }
      const indent = line.length - trimmed.length;
      
      while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        result.push('  '.repeat(indentStack.length) + '}');
      }
      
      if (trimmed.endsWith('{')) {
        result.push(line);
        indentStack.push(indent + 2);
      } else {
        result.push(line);
      }
    }
    
    while (indentStack.length > 1) {
      indentStack.pop();
      result.push('}');
    }
    
    return result.join('\n');
  };

  const handleRun = () => {
    const jsCode = convertToJs(code);
    console.log('Python → JS:', jsCode);
    onRun(jsCode);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">Python Mode</span>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-40 transition-all"
        >
          <FontAwesomeIcon icon={faPlay} className="w-3 h-3" />
          Run
        </button>
      </div>
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        className="flex-1 w-full bg-background text-foreground font-mono text-xs p-4 resize-none focus:outline-none leading-relaxed"
        spellCheck={false}
        placeholder="Write Python-like code here..."
      />
    </div>
  );
}
