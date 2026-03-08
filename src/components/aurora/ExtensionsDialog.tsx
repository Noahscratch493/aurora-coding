import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faGlobe, faDownload, faRobot, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';

export interface Extension {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
}

export const AVAILABLE_EXTENSIONS: Extension[] = [
  { id: 'iframe', name: 'Iframe', description: 'Embed web pages in the stage. Play URLs and toggle iframe visibility with blocks.', icon: faGlobe, enabled: false },
  { id: 'fetch', name: 'Fetch', description: 'Make HTTP requests to fetch data from URLs. Parse JSON responses in your projects.', icon: faDownload, enabled: false },
  { id: 'ai', name: 'AI', description: 'Connect to AI models to generate text, answer questions, and more.', icon: faRobot, enabled: false },
];

interface ExtensionsDialogProps {
  extensions: Extension[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export default function ExtensionsDialog({ extensions, onToggle, onClose }: ExtensionsDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-[480px] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border aurora-gradient">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPuzzlePiece} className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Extensions</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {extensions.map(ext => (
            <div key={ext.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={ext.icon} className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{ext.name}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{ext.description}</p>
              </div>
              <button
                onClick={() => onToggle(ext.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  ext.enabled
                    ? 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                    : 'bg-accent text-accent-foreground hover:opacity-90'
                }`}
              >
                {ext.enabled ? 'Remove' : 'Add'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
