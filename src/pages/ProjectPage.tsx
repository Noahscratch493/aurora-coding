import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faPlay, faStop, faArrowLeft, faCode } from '@fortawesome/free-solid-svg-icons';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import StageCanvas from '@/components/aurora/StageCanvas';
import { AuroraRuntime, SpriteState } from '@/lib/aurora-runtime';
import { supabase } from '@/integrations/supabase/client';
import '@/lib/aurora-blocks';

interface SharedProject {
  id: string;
  name: string;
  author: string;
  thumbnail: string;
  data: string;
  createdAt: number;
  remixOf?: { id: string; name: string; };
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<SharedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const runtimeRef = useRef<AuroraRuntime | null>(null);

  if (!runtimeRef.current) {
    runtimeRef.current = new AuroraRuntime(() => setRenderKey(n => n + 1));
  }
  const runtime = runtimeRef.current;

  useEffect(() => {
    if (!id) return;
    supabase.from('shared_projects').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        const p: SharedProject = {
          id: data.id, name: data.name, author: data.author, thumbnail: data.thumbnail,
          data: data.data, createdAt: new Date(data.created_at).getTime(),
          remixOf: data.remix_of_id ? { id: data.remix_of_id, name: data.remix_of_name || '' } : undefined,
        };
        setProject(p);
        runtime.loadAurFile(p.data);
        setRenderKey(n => n + 1);
      }
      setLoading(false);
    });
  }, [id, runtime]);

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
    if (!project?.data) return;
    try {
      const parsed = JSON.parse(project.data);
      if (parsed.workspace) {
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
        const ws = Blockly.inject(tempDiv, { readOnly: true });
        const dom = Blockly.utils.xml.textToDom(parsed.workspace);
        Blockly.Xml.domToWorkspace(dom, ws);
        const code = javascriptGenerator.workspaceToCode(ws);
        ws.dispose();
        document.body.removeChild(tempDiv);

        runtime.start();
        setIsRunning(true);
        const sprite = runtime.sprites[0];
        if (sprite) {
          runtime.executeCode(code, sprite).then(() => setIsRunning(false)).catch(() => setIsRunning(false));
        }
      }
    } catch (e) { console.error('Run error:', e); }
  }, [project, runtime]);

  const handleStop = useCallback(() => {
    runtime.stopAll();
    setIsRunning(false);
  }, [runtime]);

  const handleMouseDown = useCallback((x: number, y: number) => {
    runtime.handleMouseDown(x, y);
  }, [runtime]);

  const handleMouseUp = useCallback(() => {
    runtime.handleMouseUp();
  }, [runtime]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <Link to="/" className="text-primary hover:underline text-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border aurora-gradient">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-5 h-5 text-primary" />
            <span className="text-base font-bold text-foreground">Aurora</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {project.remixOf && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-muted-foreground">
            🔀 This project is a remix of{' '}
            <Link to={`/project/${project.remixOf.id}`} className="text-primary hover:underline font-medium">
              {project.remixOf.name}
            </Link>
          </div>
        )}

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">by {project.author}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/editor?remix=${project.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              🔀 Remix
            </Link>
            <Link to={`/editor?load=${project.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
              <FontAwesomeIcon icon={faCode} className="w-3 h-3" /> See Inside
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-card" onMouseUp={handleMouseUp}>
          <div className="p-4 flex justify-center">
            <div className="relative" tabIndex={0}>
              <StageCanvas
                sprites={runtime.sprites}
                penLines={runtime.penLines}
                stageBackground={runtime.stageBackground}
                renderKey={renderKey}
                onMouseMove={(x, y) => runtime.handleMouseMove(x, y)}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 px-4 pb-4">
            <button onClick={isRunning ? handleStop : handleRun}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isRunning
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-accent text-accent-foreground'
              }`}>
              <FontAwesomeIcon icon={isRunning ? faStop : faPlay} className="w-3.5 h-3.5" />
              {isRunning ? 'Stop' : 'Run'}
            </button>
          </div>
        </div>
      </div>

      <footer className="border-t border-border bg-card mt-8">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            Created By CoolestWiiGuy, also known as Noahscratch493
          </p>
        </div>
      </footer>
    </div>
  );
}
