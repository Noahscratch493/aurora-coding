// Aurora Runtime Engine - executes generated code on a canvas

export interface Costume {
  id: string;
  name: string;
  dataUrl: string; // URL or data URL
}

export interface SpriteState {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: number;
  size: number;
  visible: boolean;
  costumes: Costume[];
  currentCostumeIndex: number;
  sayText: string;
  thinkText: string;
  penDown: boolean;
  penColor: string;
  penSize: number;
  colorEffect: number;
}

export interface PenLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  size: number;
}

export interface StageBackground {
  type: 'color' | 'image';
  value: string;
}

export const STAGE_WIDTH = 480;
export const STAGE_HEIGHT = 360;

export const DEFAULT_COSTUMES: Costume[] = [
  { id: 'default', name: 'Default', dataUrl: '/sprites/default-sprite.png' },
  { id: 'walking', name: 'Walking', dataUrl: '/sprites/walking-sprite.png' },
];

export function createDefaultSprite(id: string, name: string): SpriteState {
  return {
    id,
    name,
    x: 0,
    y: 0,
    direction: 90,
    size: 100,
    visible: true,
    costumes: [...DEFAULT_COSTUMES],
    currentCostumeIndex: 0,
    sayText: '',
    thinkText: '',
    penDown: false,
    penColor: '#4C97FF',
    penSize: 2,
    colorEffect: 0,
  };
}

// Image cache for sprite rendering
const imageCache = new Map<string, HTMLImageElement>();
const loadingImages = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) return Promise.resolve(imageCache.get(src)!);
  if (loadingImages.has(src)) return loadingImages.get(src)!;
  
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      loadingImages.delete(src);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
  loadingImages.set(src, promise);
  return promise;
}

export function getCachedImage(src: string): HTMLImageElement | null {
  return imageCache.get(src) || null;
}

export class AuroraRuntime {
  running = false;
  sprites: SpriteState[] = [];
  penLines: PenLine[] = [];
  stageBackground: StageBackground = { type: 'color', value: '#1a1a2e' };
  mouseX = 0;
  mouseY = 0;
  answer = '';
  private keysPressed = new Set<string>();
  private onUpdate: () => void;
  private abortController: AbortController | null = null;

  constructor(onUpdate: () => void) {
    this.onUpdate = onUpdate;
    this.sprites = [createDefaultSprite('sprite1', 'Sprite 1')];
    // Preload default sprite images
    DEFAULT_COSTUMES.forEach(c => loadImage(c.dataUrl));
  }

  start() {
    this.running = true;
    this.abortController = new AbortController();
  }

  stopAll() {
    this.running = false;
    this.abortController?.abort();
    this.abortController = null;
    this.sprites.forEach(s => {
      s.sayText = '';
      s.thinkText = '';
    });
    this.onUpdate();
  }

  async tick() {
    if (!this.running) throw new Error('STOPPED');
    await new Promise(r => setTimeout(r, 1000 / 30));
    this.onUpdate();
  }

  async wait(secs: number) {
    const end = Date.now() + secs * 1000;
    while (Date.now() < end && this.running) {
      await this.tick();
    }
  }

  random(from: number, to: number) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
  }

  isKeyPressed(key: string) {
    if (key === 'space') return this.keysPressed.has(' ');
    return this.keysPressed.has(key);
  }

  handleKeyDown(key: string) { this.keysPressed.add(key); }
  handleKeyUp(key: string) { this.keysPressed.delete(key); }
  handleMouseMove(x: number, y: number) { this.mouseX = x; this.mouseY = y; }

  clearPen() {
    this.penLines = [];
    this.onUpdate();
  }

  broadcast(_msg: string) { /* TODO */ }

  async ask(question: string) {
    this.answer = prompt(question) || '';
  }

  addSprite(id: string, name: string) {
    this.sprites.push(createDefaultSprite(id, name));
    this.onUpdate();
  }

  deleteSprite(id: string) {
    this.sprites = this.sprites.filter(s => s.id !== id);
    this.onUpdate();
  }

  createSpriteProxy(spriteState: SpriteState): Record<string, any> {
    const runtime = this;
    return {
      get x() { return spriteState.x; },
      get y() { return spriteState.y; },
      get direction() { return spriteState.direction; },
      set direction(d: number) { spriteState.direction = d; },
      get visible() { return spriteState.visible; },
      set visible(v: boolean) { spriteState.visible = v; runtime.onUpdate(); },
      get penDown() { return spriteState.penDown; },
      set penDown(v: boolean) { spriteState.penDown = v; },
      get penColor() { return spriteState.penColor; },
      set penColor(c: string) { spriteState.penColor = c; },
      get penSize() { return spriteState.penSize; },
      set penSize(s: number) { spriteState.penSize = s; },
      get colorEffect() { return spriteState.colorEffect; },
      set colorEffect(v: number) { spriteState.colorEffect = v; runtime.onUpdate(); },

      async move(steps: number) {
        const rad = spriteState.direction * Math.PI / 180;
        const oldX = spriteState.x;
        const oldY = spriteState.y;
        spriteState.x += Math.sin(rad) * steps;
        spriteState.y += Math.cos(rad) * steps;
        if (spriteState.penDown) {
          runtime.penLines.push({
            x1: oldX, y1: oldY,
            x2: spriteState.x, y2: spriteState.y,
            color: spriteState.penColor, size: spriteState.penSize,
          });
        }
        runtime.onUpdate();
      },

      async turnRight(degrees: number) {
        spriteState.direction = (spriteState.direction + degrees) % 360;
        runtime.onUpdate();
      },

      async turnLeft(degrees: number) {
        spriteState.direction = (spriteState.direction - degrees + 360) % 360;
        runtime.onUpdate();
      },

      async goTo(x: number, y: number) {
        const oldX = spriteState.x;
        const oldY = spriteState.y;
        spriteState.x = x;
        spriteState.y = y;
        if (spriteState.penDown) {
          runtime.penLines.push({
            x1: oldX, y1: oldY, x2: x, y2: y,
            color: spriteState.penColor, size: spriteState.penSize,
          });
        }
        runtime.onUpdate();
      },

      async glideTo(secs: number, x: number, y: number) {
        const startX = spriteState.x;
        const startY = spriteState.y;
        const frames = Math.max(1, Math.round(secs * 30));
        for (let i = 1; i <= frames && runtime.running; i++) {
          const t = i / frames;
          const oldX = spriteState.x;
          const oldY = spriteState.y;
          spriteState.x = startX + (x - startX) * t;
          spriteState.y = startY + (y - startY) * t;
          if (spriteState.penDown) {
            runtime.penLines.push({
              x1: oldX, y1: oldY,
              x2: spriteState.x, y2: spriteState.y,
              color: spriteState.penColor, size: spriteState.penSize,
            });
          }
          await runtime.tick();
        }
      },

      async setX(x: number) {
        const oldX = spriteState.x;
        spriteState.x = x;
        if (spriteState.penDown) {
          runtime.penLines.push({
            x1: oldX, y1: spriteState.y, x2: x, y2: spriteState.y,
            color: spriteState.penColor, size: spriteState.penSize,
          });
        }
        runtime.onUpdate();
      },

      async setY(y: number) {
        const oldY = spriteState.y;
        spriteState.y = y;
        if (spriteState.penDown) {
          runtime.penLines.push({
            x1: spriteState.x, y1: oldY, x2: spriteState.x, y2: y,
            color: spriteState.penColor, size: spriteState.penSize,
          });
        }
        runtime.onUpdate();
      },

      async changeX(dx: number) { await this.setX(spriteState.x + dx); },
      async changeY(dy: number) { await this.setY(spriteState.y + dy); },

      async say(msg: string) {
        spriteState.sayText = String(msg);
        spriteState.thinkText = '';
        runtime.onUpdate();
      },

      async sayFor(msg: string, secs: number) {
        spriteState.sayText = String(msg);
        spriteState.thinkText = '';
        runtime.onUpdate();
        await runtime.wait(secs);
        spriteState.sayText = '';
        runtime.onUpdate();
      },

      async think(msg: string) {
        spriteState.thinkText = String(msg);
        spriteState.sayText = '';
        runtime.onUpdate();
      },

      changeSize(amount: number) {
        spriteState.size = Math.max(1, spriteState.size + amount);
        runtime.onUpdate();
      },

      setSize(size: number) {
        spriteState.size = Math.max(1, size);
        runtime.onUpdate();
      },

      nextCostume() {
        spriteState.currentCostumeIndex = (spriteState.currentCostumeIndex + 1) % spriteState.costumes.length;
        runtime.onUpdate();
      },

      switchCostume(name: string) {
        const idx = spriteState.costumes.findIndex(c => c.name === name);
        if (idx >= 0) spriteState.currentCostumeIndex = idx;
        runtime.onUpdate();
      },

      clearEffects() {
        spriteState.colorEffect = 0;
        runtime.onUpdate();
      },

      bounceOffEdge() {
        const hw = STAGE_WIDTH / 2;
        const hh = STAGE_HEIGHT / 2;
        if (spriteState.x > hw || spriteState.x < -hw) {
          spriteState.direction = (360 - spriteState.direction) % 360;
          spriteState.x = Math.max(-hw, Math.min(hw, spriteState.x));
        }
        if (spriteState.y > hh || spriteState.y < -hh) {
          spriteState.direction = (180 - spriteState.direction + 360) % 360;
          spriteState.y = Math.max(-hh, Math.min(hh, spriteState.y));
        }
        runtime.onUpdate();
      },

      isTouchingEdge() {
        const hw = STAGE_WIDTH / 2;
        const hh = STAGE_HEIGHT / 2;
        return Math.abs(spriteState.x) >= hw - 10 || Math.abs(spriteState.y) >= hh - 10;
      },

      stamp() { runtime.onUpdate(); },
    };
  }

  async executeCode(code: string, spriteState: SpriteState) {
    const sprite = this.createSpriteProxy(spriteState);
    const runtime = this;

    try {
      const asyncFn = new Function('sprite', 'runtime', `
        return (async () => {
          ${code}
        })();
      `);
      await asyncFn(sprite, runtime);
    } catch (e: any) {
      if (e.message !== 'STOPPED') {
        console.error('Aurora runtime error:', e);
      }
    }
  }

  // Serialize project to .aur format
  toAurFile(workspaceXml: string): string {
    return JSON.stringify({
      version: 1,
      workspace: workspaceXml,
      sprites: this.sprites.map(s => ({
        ...s,
        costumes: s.costumes.map(c => ({
          id: c.id,
          name: c.name,
          dataUrl: c.dataUrl,
        })),
      })),
      stageBackground: this.stageBackground,
    }, null, 2);
  }

  // Load from .aur format
  loadAurFile(data: string) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.sprites) {
        this.sprites = parsed.sprites;
      }
      if (parsed.stageBackground) {
        this.stageBackground = parsed.stageBackground;
      }
      this.penLines = [];
      this.onUpdate();
      return parsed.workspace || null;
    } catch (e) {
      console.error('Failed to load .aur file:', e);
      return null;
    }
  }
}
