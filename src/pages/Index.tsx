import { useCallback, useRef, useState, useEffect } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faCubes, faCode, faPuzzlePiece, faPalette, faImage } from '@fortawesome/free-solid-svg-icons';
import BlocklyEditor from '@/components/aurora/BlocklyEditor';
import StageCanvas from '@/components/aurora/StageCanvas';
import SpritePanel from '@/components/aurora/SpritePanel';
import Toolbar from '@/components/aurora/Toolbar';
import HeaderMenuBar from '@/components/aurora/HeaderMenuBar';
import HowToCode from '@/components/aurora/HowToCode';
import CostumeEditor from '@/components/aurora/CostumeEditor';
import PythonEditor from '@/components/aurora/PythonEditor';
import ExtensionsDialog, { Extension, AVAILABLE_EXTENSIONS } from '@/components/aurora/ExtensionsDialog';
import { AuroraRuntime, createDefaultSprite, SpriteState } from '@/lib/aurora-runtime';
import { buildToolbox } from '@/lib/aurora-blocks';

export default function Index() {
  const [renderKey, setRenderKey] = useState(0);
  const runtimeRef = useRef<AuroraRuntime | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSpriteId, setSelectedSpriteId] = useState('sprite1');
  const [editorTab, setEditorTab] = useState<'blocks' | 'python'>('blocks');
  const [rightTab, setRightTab] = useState<'stage' | 'costumes' | 'backgrounds'>('stage');
  const [showHowToCode, setShowHowToCode] = useState(false);
  const [showExtensions, setShowExtensions] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [extensions, setExtensions] = useState<Extension[]>([...AVAILABLE_EXTENSIONS]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  if (!runtimeRef.current) {
    runtimeRef.current = new AuroraRuntime(() => setRenderKey(n => n + 1));
  }

  const runtime = runtimeRef.current;
  const currentSprite = runtime.sprites.find(s => s.id === selectedSpriteId) || runtime.sprites[0];

  // Update toolbox when extensions change
  useEffect(() => {
    if (workspaceRef.current) {
      const enabledExts = extensions.filter(e => e.enabled).map(e => e.id);
      const toolbox = buildToolbox(enabledExts);
      workspaceRef.current.updateToolbox(toolbox as any);
    }
  }, [extensions]);

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
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      console.log('Generated Aurora code:', code);
      runtime.executeCode(code, currentSprite).then(() => setIsRunning(false)).catch(() => setIsRunning(false));
    } catch (e) {
      console.error('Code generation error:', e);
      setIsRunning(false);
    }
  }, [runtime, currentSprite]);

  const handleRunPython = useCallback((jsCode: string) => {
    runtime.start();
    setIsRunning(true);
    runtime.executeCode(jsCode, currentSprite).then(() => setIsRunning(false)).catch(() => setIsRunning(false));
  }, [runtime, currentSprite]);

  const handleStop = useCallback(() => { runtime.stopAll(); setIsRunning(false); }, [runtime]);

  const handleReset = useCallback(() => {
    runtime.stopAll(); setIsRunning(false);
    runtime.penLines = [];
    runtime.sprites = [createDefaultSprite('sprite1', 'Sprite 1')];
    setSelectedSpriteId('sprite1');
    setRenderKey(n => n + 1);
  }, [runtime]);

  const handleNew = useCallback(() => {
    if (confirm('Create a new project? Unsaved changes will be lost.')) {
      handleReset();
      if (workspaceRef.current) workspaceRef.current.clear();
    }
  }, [handleReset]);

  const handleSave = useCallback(() => {
    let workspaceXml = '';
    if (workspaceRef.current) {
      const dom = Blockly.Xml.workspaceToDom(workspaceRef.current);
      workspaceXml = Blockly.Xml.domToText(dom);
    }
    const data = runtime.toAurFile(workspaceXml);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'project.aur'; a.click();
    URL.revokeObjectURL(url);
  }, [runtime]);

  const handleLoad = useCallback(() => { fileInputRef.current?.click(); }, []);

  const handleFileLoad = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const workspaceXml = runtime.loadAurFile(reader.result as string);
      if (workspaceXml && workspaceRef.current) {
        workspaceRef.current.clear();
        const dom = Blockly.utils.xml.textToDom(workspaceXml);
        Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
      }
      if (runtime.sprites.length > 0) setSelectedSpriteId(runtime.sprites[0].id);
      setRenderKey(n => n + 1);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [runtime]);

  const handleUndo = useCallback(() => { workspaceRef.current?.undo(false); }, []);
  const handleRedo = useCallback(() => { workspaceRef.current?.undo(true); }, []);

  const handleAddSprite = useCallback(() => {
    const id = `sprite${Date.now()}`;
    runtime.addSprite(id, `Sprite ${runtime.sprites.length + 1}`);
    setSelectedSpriteId(id);
  }, [runtime]);

  const handleDeleteSprite = useCallback((id: string) => {
    runtime.deleteSprite(id);
    if (selectedSpriteId === id) setSelectedSpriteId(runtime.sprites[0]?.id || '');
    setRenderKey(n => n + 1);
  }, [runtime, selectedSpriteId]);

  const handleUpdateSprite = useCallback((updated: SpriteState) => {
    const idx = runtime.sprites.findIndex(s => s.id === updated.id);
    if (idx >= 0) { runtime.sprites[idx] = updated; setRenderKey(n => n + 1); }
  }, [runtime]);

  const handleToggleExtension = useCallback((id: string) => {
    setExtensions(prev => prev.map(ext => ext.id === id ? { ...ext, enabled: !ext.enabled } : ext));
  }, []);

  const handleBgUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { runtime.stageBackground = { type: 'image', value: reader.result as string }; setRenderKey(n => n + 1); };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [runtime]);

  const handleBgColor = useCallback((color: string) => {
    runtime.stageBackground = { type: 'color', value: color }; setRenderKey(n => n + 1);
  }, [runtime]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-1.5 border-b border-border aurora-gradient">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-5 h-5 text-primary" />
            <h1 className="text-base font-bold tracking-tight text-foreground">Aurora</h1>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">BETA</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <HeaderMenuBar
            onNew={handleNew} onSave={handleSave} onLoad={handleLoad}
            onUndo={handleUndo} onRedo={handleRedo}
            onAbout={() => setShowAbout(true)} onHowToCode={() => setShowHowToCode(true)}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor area */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center border-b border-border bg-card px-2">
            <button onClick={() => setEditorTab('blocks')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2 ${editorTab === 'blocks' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              <FontAwesomeIcon icon={faCubes} className="w-3 h-3" /> Blocks
            </button>
            <button onClick={() => setEditorTab('python')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2 ${editorTab === 'python' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              <FontAwesomeIcon icon={faCode} className="w-3 h-3" /> Python
            </button>
            <div className="flex-1" />
            <button onClick={() => setShowExtensions(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <FontAwesomeIcon icon={faPuzzlePiece} className="w-3 h-3" /> Extensions
            </button>
          </div>
          <div className="flex-1 min-h-0">
            {editorTab === 'blocks' ? <BlocklyEditor workspaceRef={workspaceRef} /> : <PythonEditor onRun={handleRunPython} isRunning={isRunning} />}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-[480px] flex flex-col border-l border-border bg-card">
          <Toolbar isRunning={isRunning} onRun={editorTab === 'blocks' ? handleRun : () => {}} onStop={handleStop} onReset={handleReset}
            spriteX={currentSprite.x} spriteY={currentSprite.y} spriteDirection={currentSprite.direction} />

          <div className="flex border-b border-border px-2">
            {(['stage', 'costumes', 'backgrounds'] as const).map(tab => (
              <button key={tab} onClick={() => setRightTab(tab)}
                className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium border-b-2 transition-colors capitalize ${
                  rightTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                {tab === 'costumes' && <FontAwesomeIcon icon={faPalette} className="w-2.5 h-2.5" />}
                {tab === 'backgrounds' && <FontAwesomeIcon icon={faImage} className="w-2.5 h-2.5" />}
                {tab}
              </button>
            ))}
          </div>

          {rightTab === 'stage' && (
            <>
              <div className="p-3 flex-shrink-0 relative">
                <StageCanvas sprites={runtime.sprites} penLines={runtime.penLines} stageBackground={runtime.stageBackground}
                  renderKey={renderKey} onMouseMove={(x, y) => runtime.handleMouseMove(x, y)} />
                {/* Iframe overlay */}
                {runtime.iframeVisible && runtime.iframeUrl && (
                  <iframe src={runtime.iframeUrl} className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] rounded-lg border-0" />
                )}
              </div>
              <div className="px-3 pb-3 flex-1 overflow-auto">
                <SpritePanel sprites={runtime.sprites} selectedSpriteId={selectedSpriteId}
                  onSelectSprite={setSelectedSpriteId} onAddSprite={handleAddSprite} onDeleteSprite={handleDeleteSprite} />
                <div className="mt-3 p-3 bg-muted rounded-lg text-xs space-y-1.5">
                  {[
                    ['Position', `(${Math.round(currentSprite.x)}, ${Math.round(currentSprite.y)})`],
                    ['Direction', `${Math.round(currentSprite.direction)}°`],
                    ['Size', `${currentSprite.size}%`],
                    ['Costume', currentSprite.costumes[currentSprite.currentCostumeIndex]?.name || 'None'],
                    ['Visible', currentSprite.visible ? 'Yes' : 'No'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-mono text-foreground">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {rightTab === 'costumes' && (
            <div className="p-3 flex-1 overflow-auto">
              <CostumeEditor sprite={currentSprite} onUpdateSprite={handleUpdateSprite} />
            </div>
          )}

          {rightTab === 'backgrounds' && (
            <div className="p-3 flex-1 overflow-auto space-y-3">
              <h3 className="text-xs font-semibold text-foreground">Stage Background</h3>
              <div className="grid grid-cols-4 gap-2">
                {['#1a1a2e', '#0f0f23', '#1e3a5f', '#2d1b69', '#1a3c2e', '#3c1a1a', '#2e2e2e', '#f0f0f0'].map(color => (
                  <button key={color} onClick={() => handleBgColor(color)}
                    className={`aspect-square rounded-lg border-2 transition-all ${
                      runtime.stageBackground.type === 'color' && runtime.stageBackground.value === color
                        ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-muted-foreground'}`}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
              <button onClick={() => bgInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-border hover:border-primary/50 text-xs text-muted-foreground hover:text-foreground transition-all">
                <FontAwesomeIcon icon={faImage} className="w-3 h-3" /> Upload Background Image
              </button>
              <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
            </div>
          )}
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept=".aur,.json" onChange={handleFileLoad} className="hidden" />

      {showHowToCode && <HowToCode onClose={() => setShowHowToCode(false)} />}
      {showExtensions && <ExtensionsDialog extensions={extensions} onToggle={handleToggleExtension} onClose={() => setShowExtensions(false)} />}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-[400px] p-6 text-center">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-8 h-8 text-primary mb-3" />
            <h2 className="text-lg font-bold text-foreground mb-2">Aurora</h2>
            <p className="text-sm text-muted-foreground mb-1">A modern block-based programming environment</p>
            <p className="text-xs text-muted-foreground mb-4">Version 0.1.0 Beta</p>
            <button onClick={() => setShowAbout(false)}
              className="px-4 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
