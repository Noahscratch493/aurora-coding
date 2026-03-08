import { useEffect, useRef } from 'react';
import { SpriteState, PenLine, STAGE_WIDTH, STAGE_HEIGHT } from '@/lib/aurora-runtime';

interface StageCanvasProps {
  sprites: SpriteState[];
  penLines: PenLine[];
  onMouseMove?: (x: number, y: number) => void;
  onClick?: () => void;
}

function drawSprite(ctx: CanvasRenderingContext2D, sprite: SpriteState) {
  if (!sprite.visible) return;

  const cx = STAGE_WIDTH / 2 + sprite.x;
  const cy = STAGE_HEIGHT / 2 - sprite.y;
  const scale = sprite.size / 100;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(((sprite.direction - 90) * Math.PI) / 180);
  ctx.scale(scale, scale);

  if (sprite.colorEffect !== 0) {
    ctx.filter = `hue-rotate(${sprite.colorEffect}deg)`;
  }

  // Draw a cat-like sprite
  // Body
  ctx.fillStyle = '#FF9F43';
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.moveTo(-14, -18);
  ctx.lineTo(-8, -30);
  ctx.lineTo(-2, -18);
  ctx.fillStyle = '#FF9F43';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(2, -18);
  ctx.lineTo(8, -30);
  ctx.lineTo(14, -18);
  ctx.fill();

  // Inner ears
  ctx.fillStyle = '#FFD89B';
  ctx.beginPath();
  ctx.moveTo(-12, -19);
  ctx.lineTo(-8, -27);
  ctx.lineTo(-4, -19);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(4, -19);
  ctx.lineTo(8, -27);
  ctx.lineTo(12, -19);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.ellipse(-7, -6, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(7, -6, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#2D3436';
  ctx.beginPath();
  ctx.ellipse(-6, -5, 2.5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(8, -5, 2.5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = '#FF6B81';
  ctx.beginPath();
  ctx.ellipse(0, 2, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.strokeStyle = '#2D3436';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.lineTo(-4, 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.lineTo(4, 8);
  ctx.stroke();

  // Whiskers
  ctx.strokeStyle = '#2D3436';
  ctx.lineWidth = 0.8;
  [-1, 1].forEach(side => {
    ctx.beginPath();
    ctx.moveTo(side * 10, 0);
    ctx.lineTo(side * 22, -4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(side * 10, 2);
    ctx.lineTo(side * 22, 4);
    ctx.stroke();
  });

  ctx.filter = 'none';
  ctx.restore();

  // Speech bubble
  if (sprite.sayText || sprite.thinkText) {
    const text = sprite.sayText || sprite.thinkText;
    const isThink = !!sprite.thinkText;
    ctx.save();
    ctx.font = '13px "Space Grotesk", sans-serif';
    const metrics = ctx.measureText(text);
    const pw = Math.max(metrics.width + 16, 40);
    const ph = 28;
    const bx = cx + 20;
    const by = cy - 30 * scale - ph;

    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx, by, pw, ph, 8);
    ctx.fill();
    ctx.stroke();

    // Tail
    if (isThink) {
      ctx.beginPath();
      ctx.arc(bx + 6, by + ph + 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx + 2, by + ph + 12, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(bx + 4, by + ph);
      ctx.lineTo(bx - 4, by + ph + 10);
      ctx.lineTo(bx + 14, by + ph);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = '#222';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bx + 8, by + ph / 2);
    ctx.restore();
  }
}

export default function StageCanvas({ sprites, penLines, onMouseMove, onClick }: StageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

    // Grid dots
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let x = 0; x < STAGE_WIDTH; x += 20) {
      for (let y = 0; y < STAGE_HEIGHT; y += 20) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Center crosshair
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(STAGE_WIDTH / 2, 0);
    ctx.lineTo(STAGE_WIDTH / 2, STAGE_HEIGHT);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, STAGE_HEIGHT / 2);
    ctx.lineTo(STAGE_WIDTH, STAGE_HEIGHT / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pen lines
    for (const line of penLines) {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(STAGE_WIDTH / 2 + line.x1, STAGE_HEIGHT / 2 - line.y1);
      ctx.lineTo(STAGE_WIDTH / 2 + line.x2, STAGE_HEIGHT / 2 - line.y2);
      ctx.stroke();
    }

    // Sprites
    for (const sprite of sprites) {
      drawSprite(ctx, sprite);
    }
  }, [sprites, penLines]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = STAGE_WIDTH / rect.width;
    const scaleY = STAGE_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX - STAGE_WIDTH / 2;
    const y = STAGE_HEIGHT / 2 - (e.clientY - rect.top) * scaleY;
    onMouseMove?.(Math.round(x), Math.round(y));
  };

  return (
    <canvas
      ref={canvasRef}
      width={STAGE_WIDTH}
      height={STAGE_HEIGHT}
      className="aurora-stage w-full h-auto cursor-crosshair"
      onMouseMove={handleMouseMove}
      onClick={onClick}
      tabIndex={0}
    />
  );
}
