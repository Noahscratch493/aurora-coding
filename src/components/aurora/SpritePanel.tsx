import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SpriteState, getCachedImage } from '@/lib/aurora-runtime';

interface SpritePanelProps {
  sprites: SpriteState[];
  selectedSpriteId: string;
  onSelectSprite: (id: string) => void;
  onAddSprite: () => void;
  onDeleteSprite: (id: string) => void;
}

function SpriteThumb({ sprite }: { sprite: SpriteState }) {
  const costume = sprite.costumes[sprite.currentCostumeIndex];
  if (costume) {
    return <img src={costume.dataUrl} alt={sprite.name} className="w-9 h-9 object-contain" />;
  }
  return (
    <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-primary text-xs font-bold">
      {sprite.name.charAt(0)}
    </div>
  );
}

export default function SpritePanel({ sprites, selectedSpriteId, onSelectSprite, onAddSprite, onDeleteSprite }: SpritePanelProps) {
  return (
    <div className="flex gap-2 p-3 bg-card rounded-lg border border-border overflow-x-auto items-end">
      {sprites.map(sprite => (
        <div
          key={sprite.id}
          onClick={() => onSelectSprite(sprite.id)}
          className={`relative group flex flex-col items-center gap-1 p-2 rounded-md transition-all min-w-[72px] cursor-pointer ${
            selectedSpriteId === sprite.id
              ? 'bg-primary/20 ring-2 ring-primary'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <SpriteThumb sprite={sprite} />
          </div>
          <span className="text-[10px] font-medium text-foreground truncate max-w-[64px]">
            {sprite.name}
          </span>
          {sprites.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteSprite(sprite.id); }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FontAwesomeIcon icon={faTrash} className="w-2 h-2" />
            </button>
          )}
        </div>
      ))}

      {/* Add sprite button */}
      <button
        onClick={onAddSprite}
        className="flex flex-col items-center justify-center gap-1 p-2 rounded-md min-w-[72px] border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
      >
        <div className="w-10 h-10 flex items-center justify-center text-muted-foreground">
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
        </div>
        <span className="text-[10px] text-muted-foreground">Add</span>
      </button>
    </div>
  );
}
