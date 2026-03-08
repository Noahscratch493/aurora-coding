import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faCubes, faPalette, faImage, faHouse, faEye, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import BlocklyEditor from '@/components/aurora/BlocklyEditor';
import StageCanvas from '@/components/aurora/StageCanvas';
import SpritePanel from '@/components/aurora/SpritePanel';
import Toolbar from '@/components/aurora/Toolbar';
import HeaderMenuBar from '@/components/aurora/HeaderMenuBar';
import HowToCode from '@/components/aurora/HowToCode';
import CostumeEditor from '@/components/aurora/CostumeEditor';
import { AuroraRuntime, createDefaultSprite, SpriteState } from '@/lib/aurora-runtime';
import { buildToolbox } from '@/lib/aurora-blocks';
import { Link } from 'react-router-dom';

// Cookie-based custom background storage
function getSavedBackgrounds(): string[] {
  try {
    return JSON.parse(localStorage.getItem('aurora_custom_bgs') || '[]');
  } catch { return []; }
}
function saveBgToCookie(dataUrl: string) {
  const bgs = getSavedBackgrounds();
  bgs.push(dataUrl);
  localStorage.setItem('aurora_custom_bgs', JSON.stringify(bgs));
}
function removeSavedBg(index: number) {
  const bgs = getSavedBackgrounds();
  bgs.splice(index, 1);
  localStorage.setItem('aurora_custom_bgs', JSON.stringify(bgs));
}

// Shared project storage
interface SharedProject {
  id: string; name: string; author: string; thumbnail: string; data: string; createdAt: number;
  remixOf?: { id: string; name: string; };
}
function getSharedProjects(): SharedProject[] {
  try { return JSON.parse(localStorage.getItem('aurora_shared_projects') || '[]'); } catch { return []; }
}
function saveSharedProject(project: SharedProject) {
  const projects = getSharedProjects();
  const idx = projects.findIndex(p => p.id === project.id);
  if (idx >= 0) projects[idx] = project;
  else projects.push(project);
  localStorage.setItem('aurora_shared_projects', JSON.stringify(projects));
}


export default function Index() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [renderKey, setRenderKey] = useState(0);
  const runtimeRef = useRef<AuroraRuntime | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSpriteId, setSelectedSpriteId] = useState('sprite1');
  const [editorTab, setEditorTab] = useState<'blocks'>('blocks');
  const [rightTab, setRightTab] = useState<'stage' | 'costumes' | 'backgrounds'>('stage');
  const [showHowToCode, setShowHowToCode] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareName, setShareName] = useState('My Project');
  const [shareAuthor, setShareAuthor] = useState('');
  const [sharedProjectId, setSharedProjectId] = useState<string | null>(null);
  const [remixOf, setRemixOf] = useState<{ id: string; name: string } | undefined>(undefined);
  
  const [customBgs, setCustomBgs] = useState<string[]>(getSavedBackgrounds());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  if (!runtimeRef.current) {
    runtimeRef.current = new AuroraRuntime(() => setRenderKey(n => n + 1));
  }

  const runtime = runtimeRef.current;
  const currentSprite = runtime.sprites.find(s => s.id === selectedSpriteId) || runtime.sprites[0];

  // Load project from URL param
  useEffect(() => {
    const loadId = searchParams.get('load');
    const remixId = searchParams.get('remix');
    const targetId = loadId || remixId;
    if (targetId) {
      try {
        const projects: SharedProject[] = JSON.parse(localStorage.getItem('aurora_shared_projects') || '[]');
        const p = projects.find(proj => proj.id === targetId);
        if (p?.data) {
          const workspaceXml = runtime.loadAurFile(p.data);
          if (workspaceXml && workspaceRef.current) {
            workspaceRef.current.clear();
            const dom = Blockly.utils.xml.textToDom(workspaceXml);
            Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
          }
          if (runtime.sprites.length > 0) setSelectedSpriteId(runtime.sprites[0].id);
          if (loadId) {
            setSharedProjectId(loadId);
            setShareName(p.name);
            setShareAuthor(p.author);
            if (p.remixOf) setRemixOf(p.remixOf);
          } else if (remixId) {
            // Remix: new project that references the original
            setSharedProjectId(null);
            setShareName(`${p.name} Remix`);
            setShareAuthor('');
            setRemixOf({ id: p.id, name: p.name });
          }
          setRenderKey(n => n + 1);
        }
      } catch {}
    }
  }, [searchParams, runtime]);


  // Keyboard events
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => runtime.handleKeyDown(e.key);
    const onKeyUp = (e: KeyboardEvent) => runtime.handleKeyUp(e.key);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
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
      setSharedProjectId(null);
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
    const a = document.createElement('a'); a.href = url; a.download = `${shareName || 'project'}.aur`; a.click();
    URL.revokeObjectURL(url);
  }, [runtime, shareName]);

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

  const handleBgUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      runtime.stageBackground = { type: 'image', value: dataUrl };
      saveBgToCookie(dataUrl);
      setCustomBgs(getSavedBackgrounds());
      setRenderKey(n => n + 1);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [runtime]);

  const handleBgColor = useCallback((color: string) => {
    runtime.stageBackground = { type: 'color', value: color }; setRenderKey(n => n + 1);
  }, [runtime]);

  const handleDeleteCustomBg = useCallback((index: number) => {
    removeSavedBg(index);
    setCustomBgs(getSavedBackgrounds());
  }, []);

  const handleUseCustomBg = useCallback((dataUrl: string) => {
    runtime.stageBackground = { type: 'image', value: dataUrl };
    setRenderKey(n => n + 1);
  }, [runtime]);

  const getCanvasThumbnail = useCallback((): string => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      try { return canvas.toDataURL('image/png'); } catch { return ''; }
    }
    return '';
  }, []);

  const handleShare = useCallback(() => {
    let workspaceXml = '';
    if (workspaceRef.current) {
      const dom = Blockly.Xml.workspaceToDom(workspaceRef.current);
      workspaceXml = Blockly.Xml.domToText(dom);
    }
    const data = runtime.toAurFile(workspaceXml);
    const id = sharedProjectId || `proj_${Date.now()}`;
    const thumbnail = getCanvasThumbnail();
    const project: SharedProject = {
      id, name: shareName || 'Untitled', author: shareAuthor || 'Anonymous',
      thumbnail, data, createdAt: Date.now(), remixOf,
    };
    saveSharedProject(project);
    setSharedProjectId(id);
    setShowShare(false);
    alert('Project shared! You can find it on the homepage.');
  }, [runtime, shareName, shareAuthor, sharedProjectId, getCanvasThumbnail]);

  const handleMouseDown = useCallback((x: number, y: number) => {
    runtime.handleMouseDown(x, y);
  }, [runtime]);

  const handleMouseUp = useCallback(() => {
    runtime.handleMouseUp();
  }, [runtime]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-1.5 border-b border-border aurora-gradient">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors" title="Home">
            <FontAwesomeIcon icon={faHouse} className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </Link>
          <div className="h-4 w-px bg-border" />
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
            onShare={() => setShowShare(true)}
          />
        </div>
        <div className="flex items-center gap-2">
          {sharedProjectId && (
            <Link to={`/project/${sharedProjectId}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-accent/20 text-accent hover:bg-accent/30 transition-colors">
              <FontAwesomeIcon icon={faEye} className="w-3 h-3" /> See Project Page
            </Link>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor area */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 min-h-0 relative">
            <BlocklyEditor workspaceRef={workspaceRef} />
          </div>
        </div>

        {/* Right panel */}
        <div className="w-[480px] flex flex-col border-l border-border bg-card">
          <Toolbar isRunning={isRunning} onRun={handleRun} onStop={handleStop} onReset={handleReset}
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
                  renderKey={renderKey} onMouseMove={(x, y) => runtime.handleMouseMove(x, y)}
                  onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />
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
              <h3 className="text-xs font-semibold text-foreground">Preset Colors</h3>
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
                <FontAwesomeIcon icon={faUpload} className="w-3 h-3" /> Upload Background Image
              </button>

              {customBgs.length > 0 && (
                <>
                  <h3 className="text-xs font-semibold text-foreground mt-4">Custom Backgrounds</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {customBgs.map((bg, i) => (
                      <div key={i} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all cursor-pointer"
                        onClick={() => handleUseCustomBg(bg)}>
                        <img src={bg} alt={`Custom ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteCustomBg(i); }}
                          className="absolute top-1 right-1 w-5 h-5 rounded bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <FontAwesomeIcon icon={faTrash} className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
            </div>
          )}
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept=".aur,.json" onChange={handleFileLoad} className="hidden" />

      {showHowToCode && <HowToCode onClose={() => setShowHowToCode(false)} />}

      {/* Share Dialog */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-[400px] p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Share Project</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Project Name</label>
                <input type="text" value={shareName} onChange={e => setShareName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Author Name</label>
                <input type="text" value={shareAuthor} onChange={e => setShareAuthor(e.target.value)} placeholder="Your name"
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowShare(false)}
                className="flex-1 px-4 py-2 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button onClick={handleShare}
                className="flex-1 px-4 py-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-colors">Share</button>
            </div>
          </div>
        </div>
      )}

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
