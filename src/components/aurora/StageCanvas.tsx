import { useEffect, useRef } from 'react';
import { SpriteState, PenLine, StageBackground, STAGE_WIDTH, STAGE_HEIGHT, getCachedImage, loadImage } from '@/lib/aurora-runtime';

interface StageCanvasProps {
  sprites: SpriteState[];
  penLines: PenLine[];
  stageBackground: StageBackground;
  renderKey: number;
  onMouseMove?: (x: number, y: number) => void;
  onMouseDown?: (x: number, y: number) => void;
  onMouseUp?: () => void;
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
  ctx.scale(
    scale * (sprite.flipX ? -1 : 1),
    scale * (sprite.flipY ? -1 : 1)
  );

  if (sprite.colorEffect !== 0) {
    ctx.filter = `hue-rotate(${sprite.colorEffect}deg)`;
  }

  const costume = sprite.costumes[sprite.currentCostumeIndex];
  const img = costume ? getCachedImage(costume.dataUrl) : null;

  if (img) {
    const h = 60;
    const w = (img.width / img.height) * h;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    ctx.fillStyle = '#FF9F43';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sprite.name.charAt(0), 0, 0);
  }

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

    if (isThink) {
      ctx.beginPath();
      ctx.arc(bx + 6, by + ph + 5, 4, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx + 2, by + ph + 12, 2.5, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(bx + 4, by + ph);
      ctx.lineTo(bx - 4, by + ph + 10);
      ctx.lineTo(bx + 14, by + ph);
      ctx.fill(); ctx.stroke();
    }

    ctx.fillStyle = '#222';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bx + 8, by + ph / 2);
    ctx.restore();
  }
}

export default function StageCanvas({ sprites, penLines, stageBackground, renderKey, onMouseMove, onMouseDown, onMouseUp, onClick }: StageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    sprites.forEach(s => s.costumes.forEach(c => loadImage(c.dataUrl).catch(() => {})));
  }, [sprites]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (stageBackground.type === 'image') {
      const bgImg = getCachedImage(stageBackground.value);
      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, STAGE_WIDTH, STAGE_HEIGHT);
      } else {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
        loadImage(stageBackground.value).catch(() => {});
      }
    } else {
      ctx.fillStyle = stageBackground.value;
      ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let x = 0; x < STAGE_WIDTH; x += 20) {
      for (let y = 0; y < STAGE_HEIGHT; y += 20) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

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

    for (const line of penLines) {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(STAGE_WIDTH / 2 + line.x1, STAGE_HEIGHT / 2 - line.y1);
      ctx.lineTo(STAGE_WIDTH / 2 + line.x2, STAGE_HEIGHT / 2 - line.y2);
      ctx.stroke();
    }

    for (const sprite of sprites) {
      drawSprite(ctx, sprite);
    }
  }, [renderKey]);

  const getStageCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = STAGE_WIDTH / rect.width;
    const scaleY = STAGE_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX - STAGE_WIDTH / 2;
    const y = STAGE_HEIGHT / 2 - (e.clientY - rect.top) * scaleY;
    return { x: Math.round(x), y: Math.round(y) };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getStageCoords(e);
    onMouseMove?.(x, y);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getStageCoords(e);
    onMouseDown?.(x, y);
  };

  const handleMouseUp = () => {
    onMouseUp?.();
  };

  return (
    <canvas
      ref={canvasRef}
      width={STAGE_WIDTH}
      height={STAGE_HEIGHT}
      className="aurora-stage w-full h-auto cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      tabIndex={0}
    />
  );
}
