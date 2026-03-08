import { SpriteState } from '@/lib/aurora-runtime';

interface SpritePanelProps {
  sprites: SpriteState[];
  selectedSpriteId: string;
  onSelectSprite: (id: string) => void;
}

export default function SpritePanel({ sprites, selectedSpriteId, onSelectSprite }: SpritePanelProps) {
  return (
    <div className="flex gap-2 p-3 bg-card rounded-lg border border-border overflow-x-auto">
      {sprites.map(sprite => (
        <button
          key={sprite.id}
          onClick={() => onSelectSprite(sprite.id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all min-w-[72px] ${
            selectedSpriteId === sprite.id
              ? 'bg-primary/20 ring-2 ring-primary'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {/* Mini sprite preview */}
          <div className="w-10 h-10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="-20 -35 40 55">
              <ellipse cx="0" cy="0" rx="18" ry="22" fill="#FF9F43" />
              <polygon points="-14,-18 -8,-30 -2,-18" fill="#FF9F43" />
              <polygon points="2,-18 8,-30 14,-18" fill="#FF9F43" />
              <ellipse cx="-7" cy="-6" rx="5" ry="6" fill="white" />
              <ellipse cx="7" cy="-6" rx="5" ry="6" fill="white" />
              <ellipse cx="-6" cy="-5" rx="2.5" ry="3.5" fill="#2D3436" />
              <ellipse cx="8" cy="-5" rx="2.5" ry="3.5" fill="#2D3436" />
              <ellipse cx="0" cy="2" rx="3" ry="2" fill="#FF6B81" />
            </svg>
          </div>
          <span className="text-[10px] font-medium text-foreground truncate max-w-[64px]">
            {sprite.name}
          </span>
        </button>
      ))}
    </div>
  );
}
