// Aurora Runtime Engine — v2 with AI Chat support

export interface Costume {
  id: string;
  name: string;
  dataUrl: string;
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
  draggable: boolean;
  flipX: boolean;
  flipY: boolean;
  rotationStyle: 'all-around' | 'left-right' | 'dont-rotate';
}

export interface PenLine {
  x1: number; y1: number; x2: number; y2: number;
  color: string; size: number;
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
    id, name, x: 0, y: 0, direction: 90, size: 100, visible: true,
    costumes: [...DEFAULT_COSTUMES], currentCostumeIndex: 0,
    sayText: '', thinkText: '', penDown: false, penColor: '#4C97FF', penSize: 2, colorEffect: 0,
    draggable: false, flipX: false, flipY: false, rotationStyle: 'all-around',
  };
}

// Image cache
const imageCache = new Map<string, HTMLImageElement>();
const loadingImages = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) return Promise.resolve(imageCache.get(src)!);
  if (loadingImages.has(src)) return loadingImages.get(src)!;
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imageCache.set(src, img); loadingImages.delete(src); resolve(img); };
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
  iframeUrl = '';
  iframeVisible = false;
  aiPersonality = '';
  private keysPressed = new Set<string>();
  private onUpdate: () => void;
  private dragState: { spriteId: string; offsetX: number; offsetY: number } | null = null;

  constructor(onUpdate: () => void) {
    this.onUpdate = onUpdate;
    this.sprites = [createDefaultSprite('sprite1', 'Sprite 1')];
    DEFAULT_COSTUMES.forEach(c => loadImage(c.dataUrl).then(() => this.onUpdate()));
  }

  start() { this.running = true; }

  stopAll() {
    this.running = false;
    this.sprites.forEach(s => { s.sayText = ''; s.thinkText = ''; });
    this.onUpdate();
  }

  async tick() {
    if (!this.running) throw new Error('STOPPED');
    await new Promise(r => setTimeout(r, 1000 / 30));
    this.onUpdate();
  }

  async wait(secs: number) {
    const end = Date.now() + secs * 1000;
    while (Date.now() < end && this.running) { await this.tick(); }
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
  handleMouseMove(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
    // Handle dragging
    if (this.dragState) {
      const sprite = this.sprites.find(s => s.id === this.dragState!.spriteId);
      if (sprite) {
        sprite.x = x + this.dragState.offsetX;
        sprite.y = y + this.dragState.offsetY;
        this.onUpdate();
      }
    }
  }

  handleMouseDown(x: number, y: number) {
    // Check if clicking on a draggable sprite
    for (let i = this.sprites.length - 1; i >= 0; i--) {
      const s = this.sprites[i];
      if (s.draggable && s.visible) {
        const dx = x - s.x;
        const dy = y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < (s.size / 100) * 30) {
          this.dragState = { spriteId: s.id, offsetX: s.x - x, offsetY: s.y - y };
          return;
        }
      }
    }
  }

  handleMouseUp() {
    this.dragState = null;
  }

  clearPen() { this.penLines = []; this.onUpdate(); }
  broadcast(_msg: string) { /* TODO */ }
  async ask(question: string) { this.answer = prompt(question) || ''; }

  showIframe(url: string) { this.iframeUrl = url; this.iframeVisible = true; this.onUpdate(); }
  hideIframe() { this.iframeVisible = false; this.onUpdate(); }

  async fetchUrl(url: string): Promise<string> {
    try {
      const resp = await fetch(url);
      return await resp.text();
    } catch (e) { return ''; }
  }

  getJsonField(data: string, field: string): string {
    try { return String(JSON.parse(data)[field] || ''); } catch { return ''; }
  }

  async askAI(prompt: string): Promise<string> {
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        console.error('AI Chat error:', err.error || resp.statusText);
        return err.error || 'AI is unavailable right now.';
      }
      const data = await resp.json();
      return data.reply || 'No response.';
    } catch (e) {
      console.error('AI Chat error:', e);
      return 'Could not reach AI.';
    }
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

    const addPenLine = (x1: number, y1: number, x2: number, y2: number) => {
      if (spriteState.penDown) {
        runtime.penLines.push({ x1, y1, x2, y2, color: spriteState.penColor, size: spriteState.penSize });
      }
    };

    return {
      get x() { return spriteState.x; },
      get y() { return spriteState.y; },
      get direction() { return spriteState.direction; },
      set direction(d: number) { spriteState.direction = d; runtime.onUpdate(); },
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
      get size() { return spriteState.size; },
      get costumeNumber() { return spriteState.currentCostumeIndex + 1; },
      get costumeName() { return spriteState.costumes[spriteState.currentCostumeIndex]?.name || ''; },

      async move(steps: number) {
        const rad = spriteState.direction * Math.PI / 180;
        const oldX = spriteState.x, oldY = spriteState.y;
        spriteState.x += Math.sin(rad) * steps;
        spriteState.y += Math.cos(rad) * steps;
        addPenLine(oldX, oldY, spriteState.x, spriteState.y);
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
        const oldX = spriteState.x, oldY = spriteState.y;
        spriteState.x = x; spriteState.y = y;
        addPenLine(oldX, oldY, x, y);
        runtime.onUpdate();
      },

      async glideTo(secs: number, x: number, y: number) {
        const startX = spriteState.x, startY = spriteState.y;
        const frames = Math.max(1, Math.round(secs * 30));
        for (let i = 1; i <= frames && runtime.running; i++) {
          const t = i / frames;
          const oldX = spriteState.x, oldY = spriteState.y;
          spriteState.x = startX + (x - startX) * t;
          spriteState.y = startY + (y - startY) * t;
          addPenLine(oldX, oldY, spriteState.x, spriteState.y);
          await runtime.tick();
        }
      },

      async setX(x: number) {
        const oldX = spriteState.x;
        spriteState.x = x;
        addPenLine(oldX, spriteState.y, x, spriteState.y);
        runtime.onUpdate();
      },

      async setY(y: number) {
        const oldY = spriteState.y;
        spriteState.y = y;
        addPenLine(spriteState.x, oldY, spriteState.x, y);
        runtime.onUpdate();
      },

      async changeX(dx: number) { await this.setX(spriteState.x + dx); },
      async changeY(dy: number) { await this.setY(spriteState.y + dy); },

      async say(msg: string) {
        spriteState.sayText = String(msg); spriteState.thinkText = '';
        runtime.onUpdate();
      },

      async sayFor(msg: string, secs: number) {
        spriteState.sayText = String(msg); spriteState.thinkText = '';
        runtime.onUpdate();
        await runtime.wait(secs);
        spriteState.sayText = '';
        runtime.onUpdate();
      },

      async think(msg: string) {
        spriteState.thinkText = String(msg); spriteState.sayText = '';
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
        spriteState.currentCostumeIndex = (spriteState.currentCostumeIndex + 1) % Math.max(1, spriteState.costumes.length);
        runtime.onUpdate();
      },

      prevCostume() {
        spriteState.currentCostumeIndex = (spriteState.currentCostumeIndex - 1 + spriteState.costumes.length) % Math.max(1, spriteState.costumes.length);
        runtime.onUpdate();
      },

      switchCostume(name: string) {
        const idx = spriteState.costumes.findIndex(c => c.name === name);
        if (idx >= 0) spriteState.currentCostumeIndex = idx;
        runtime.onUpdate();
      },

      flipCostume(direction: string) {
        if (direction === 'horizontal') {
          spriteState.flipX = !spriteState.flipX;
        } else {
          spriteState.flipY = !spriteState.flipY;
        }
        runtime.onUpdate();
      },

      setDraggable(draggable: boolean) {
        spriteState.draggable = draggable;
      },

      setRotationStyle(style: string) {
        spriteState.rotationStyle = style as SpriteState['rotationStyle'];
        runtime.onUpdate();
      },

      pointTowardsMouse() {
        const dx = runtime.mouseX - spriteState.x;
        const dy = runtime.mouseY - spriteState.y;
        spriteState.direction = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
        runtime.onUpdate();
      },

      clearEffects() { spriteState.colorEffect = 0; spriteState.flipX = false; spriteState.flipY = false; runtime.onUpdate(); },

      bounceOffEdge() {
        const hw = STAGE_WIDTH / 2, hh = STAGE_HEIGHT / 2;
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
        const hw = STAGE_WIDTH / 2, hh = STAGE_HEIGHT / 2;
        return Math.abs(spriteState.x) >= hw - 10 || Math.abs(spriteState.y) >= hh - 10;
      },

      isTouching(target: string) {
        if (target === '_edge_') {
          return this.isTouchingEdge();
        }
        if (target === '_mouse_') {
          const dx = runtime.mouseX - spriteState.x;
          const dy = runtime.mouseY - spriteState.y;
          return Math.sqrt(dx * dx + dy * dy) < (spriteState.size / 100) * 30;
        }
        // Check touching another sprite by name
        const other = runtime.sprites.find(s => s.name === target && s.id !== spriteState.id);
        if (other) {
          const dx = other.x - spriteState.x;
          const dy = other.y - spriteState.y;
          return Math.sqrt(dx * dx + dy * dy) < ((spriteState.size + other.size) / 200) * 30;
        }
        return false;
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
      if (e.message !== 'STOPPED') console.error('Aurora runtime error:', e);
    }
  }

  toAurFile(workspaceXml: string): string {
    return JSON.stringify({
      version: 1, workspace: workspaceXml,
      sprites: this.sprites, stageBackground: this.stageBackground,
    }, null, 2);
  }

  loadAurFile(data: string) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.sprites) {
        this.sprites = parsed.sprites.map((s: any) => ({
          ...createDefaultSprite(s.id, s.name),
          ...s,
          draggable: s.draggable || false,
          flipX: s.flipX || false,
          flipY: s.flipY || false,
          rotationStyle: s.rotationStyle || 'all-around',
        }));
      }
      if (parsed.stageBackground) this.stageBackground = parsed.stageBackground;
      this.penLines = [];
      this.onUpdate();
      return parsed.workspace || null;
    } catch (e) { console.error('Failed to load .aur file:', e); return null; }
  }
}
