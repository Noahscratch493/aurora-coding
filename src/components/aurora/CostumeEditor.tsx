import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { SpriteState, Costume } from '@/lib/aurora-runtime';

interface CostumeEditorProps {
  sprite: SpriteState;
  onUpdateSprite: (sprite: SpriteState) => void;
}

export default function CostumeEditor({ sprite, onUpdateSprite }: CostumeEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newCostume: Costume = {
        id: `costume-${Date.now()}`,
        name: file.name.replace(/\.\w+$/, ''),
        dataUrl: reader.result as string,
      };
      onUpdateSprite({
        ...sprite,
        costumes: [...sprite.costumes, newCostume],
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDelete = (costumeId: string) => {
    if (sprite.costumes.length <= 1) return;
    const newCostumes = sprite.costumes.filter(c => c.id !== costumeId);
    const newIdx = Math.min(sprite.currentCostumeIndex, newCostumes.length - 1);
    onUpdateSprite({ ...sprite, costumes: newCostumes, currentCostumeIndex: newIdx });
  };

  const handleSelect = (idx: number) => {
    onUpdateSprite({ ...sprite, currentCostumeIndex: idx });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground">Costumes</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
        >
          <FontAwesomeIcon icon={faUpload} className="w-2.5 h-2.5" />
          Upload
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {sprite.costumes.map((costume, idx) => (
          <div
            key={costume.id}
            onClick={() => handleSelect(idx)}
            className={`relative group cursor-pointer rounded-lg border-2 p-1 transition-all ${
              idx === sprite.currentCostumeIndex
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <div className="aspect-square bg-muted rounded overflow-hidden flex items-center justify-center">
              <img src={costume.dataUrl} alt={costume.name} className="max-w-full max-h-full object-contain" />
            </div>
            <p className="text-[9px] text-center text-foreground mt-1 truncate">{costume.name}</p>
            {sprite.costumes.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(costume.id); }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FontAwesomeIcon icon={faTrash} className="w-2 h-2" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
