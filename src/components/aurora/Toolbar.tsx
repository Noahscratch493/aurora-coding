import { Play, Square, Flag, Maximize2, RotateCcw } from 'lucide-react';

interface ToolbarProps {
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  spriteX: number;
  spriteY: number;
  spriteDirection: number;
}

export default function Toolbar({ isRunning, onRun, onStop, onReset, spriteX, spriteY, spriteDirection }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-sm transition-all bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-40"
        >
          {isRunning ? <Flag className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Running' : 'Run'}
        </button>
        <button
          onClick={onStop}
          disabled={!isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-sm transition-all bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-40"
        >
          <Square className="w-3.5 h-3.5" />
          Stop
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
        <span>x: <span className="text-foreground">{Math.round(spriteX)}</span></span>
        <span>y: <span className="text-foreground">{Math.round(spriteY)}</span></span>
        <span>dir: <span className="text-foreground">{Math.round(spriteDirection)}°</span></span>
        <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-foreground transition-colors" />
      </div>
    </div>
  );
}
