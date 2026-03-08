import { useCallback, useRef, useState, useEffect } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import BlocklyEditor from '@/components/aurora/BlocklyEditor';
import StageCanvas from '@/components/aurora/StageCanvas';
import SpritePanel from '@/components/aurora/SpritePanel';
import Toolbar from '@/components/aurora/Toolbar';
import { AuroraRuntime, createDefaultSprite, STAGE_WIDTH, STAGE_HEIGHT } from '@/lib/aurora-runtime';
import { Sparkles } from 'lucide-react';

export default function Index() {
  const [, forceUpdate] = useState(0);
  const runtimeRef = useRef<AuroraRuntime | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSpriteId, setSelectedSpriteId] = useState('sprite1');

  if (!runtimeRef.current) {
    runtimeRef.current = new AuroraRuntime(() => forceUpdate(n => n + 1));
  }

  const runtime = runtimeRef.current;
  const currentSprite = runtime.sprites.find(s => s.id === selectedSpriteId) || runtime.sprites[0];

  // Keyboard events
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => runtime.handleKeyDown(e.key);
    const onKeyUp = (e: KeyboardEvent) => runtime.handleKeyUp(e.key);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [runtime]);

  const handleRun = useCallback(() => {
    if (!workspaceRef.current) return;

    runtime.start();
    setIsRunning(true);

    try {
      javascriptGenerator.init(workspaceRef.current);
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      console.log('Generated Aurora code:', code);

      runtime.executeCode(code, currentSprite).then(() => {
        setIsRunning(false);
      });
    } catch (e) {
      console.error('Code generation error:', e);
      setIsRunning(false);
    }
  }, [runtime, currentSprite]);

  const handleStop = useCallback(() => {
    runtime.stopAll();
    setIsRunning(false);
  }, [runtime]);

  const handleReset = useCallback(() => {
    runtime.stopAll();
    setIsRunning(false);
    runtime.penLines = [];
    runtime.sprites = [createDefaultSprite('sprite1', 'Sprite 1')];
    forceUpdate(n => n + 1);
  }, [runtime]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border aurora-gradient">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Aurora
          </h1>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            BETA
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-mono">Block Programming</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Blockly Editor */}
        <div className="flex-1 min-w-0">
          <BlocklyEditor workspaceRef={workspaceRef} />
        </div>

        {/* Right panel: Stage + Sprites */}
        <div className="w-[500px] flex flex-col border-l border-border bg-card">
          <Toolbar
            isRunning={isRunning}
            onRun={handleRun}
            onStop={handleStop}
            onReset={handleReset}
            spriteX={currentSprite.x}
            spriteY={currentSprite.y}
            spriteDirection={currentSprite.direction}
          />

          {/* Stage */}
          <div className="p-3 flex-shrink-0">
            <StageCanvas
              sprites={runtime.sprites}
              penLines={runtime.penLines}
              onMouseMove={(x, y) => runtime.handleMouseMove(x, y)}
            />
          </div>

          {/* Sprite panel */}
          <div className="px-3 pb-3 flex-1 overflow-auto">
            <SpritePanel
              sprites={runtime.sprites}
              selectedSpriteId={selectedSpriteId}
              onSelectSprite={setSelectedSpriteId}
            />

            {/* Sprite info */}
            <div className="mt-3 p-3 bg-muted rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Position</span>
                <span className="font-mono text-foreground">
                  ({Math.round(currentSprite.x)}, {Math.round(currentSprite.y)})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Direction</span>
                <span className="font-mono text-foreground">{Math.round(currentSprite.direction)}°</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Size</span>
                <span className="font-mono text-foreground">{currentSprite.size}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Visible</span>
                <span className="font-mono text-foreground">{currentSprite.visible ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
