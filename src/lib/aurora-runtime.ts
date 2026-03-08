// Aurora Runtime Engine - executes generated code on a canvas

export interface SpriteState {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: number;
  size: number;
  visible: boolean;
  costume: string;
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

export const STAGE_WIDTH = 480;
export const STAGE_HEIGHT = 360;

export function createDefaultSprite(id: string, name: string): SpriteState {
  return {
    id,
    name,
    x: 0,
    y: 0,
    direction: 90,
    size: 100,
    visible: true,
    costume: 'default',
    sayText: '',
    thinkText: '',
    penDown: false,
    penColor: '#4C97FF',
    penSize: 2,
    colorEffect: 0,
  };
}

export class AuroraRuntime {
  running = false;
  sprites: SpriteState[] = [];
  penLines: PenLine[] = [];
  mouseX = 0;
  mouseY = 0;
  answer = '';
  private keysPressed = new Set<string>();
  private onUpdate: () => void;
  private abortController: AbortController | null = null;

  constructor(onUpdate: () => void) {
    this.onUpdate = onUpdate;
    this.sprites = [createDefaultSprite('sprite1', 'Sprite 1')];
  }

  start() {
    this.running = true;
    this.abortController = new AbortController();
  }

  stopAll() {
    this.running = false;
    this.abortController?.abort();
    this.abortController = null;
    // Clear speech bubbles
    this.sprites.forEach(s => {
      s.sayText = '';
      s.thinkText = '';
    });
    this.onUpdate();
  }

  async tick() {
    if (!this.running) throw new Error('STOPPED');
    await new Promise(r => setTimeout(r, 1000 / 30)); // ~30fps
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

  handleKeyDown(key: string) {
    this.keysPressed.add(key);
  }

  handleKeyUp(key: string) {
    this.keysPressed.delete(key);
  }

  handleMouseMove(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  clearPen() {
    this.penLines = [];
    this.onUpdate();
  }

  broadcast(_msg: string) {
    // TODO: implement message passing
  }

  async ask(question: string) {
    this.answer = prompt(question) || '';
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
        const rad = (spriteState.direction - 90) * Math.PI / 180;
        const oldX = spriteState.x;
        const oldY = spriteState.y;
        spriteState.x += Math.cos(rad) * steps;
        spriteState.y += Math.sin(rad) * steps;
        if (spriteState.penDown) {
          runtime.penLines.push({
            x1: oldX, y1: oldY,
            x2: spriteState.x, y2: spriteState.y,
            color: spriteState.penColor,
            size: spriteState.penSize,
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
            x1: oldX, y1: oldY,
            x2: x, y2: y,
            color: spriteState.penColor,
            size: spriteState.penSize,
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
              color: spriteState.penColor,
              size: spriteState.penSize,
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
            x1: oldX, y1: spriteState.y,
            x2: x, y2: spriteState.y,
            color: spriteState.penColor,
            size: spriteState.penSize,
          });
        }
        runtime.onUpdate();
      },

      async setY(y: number) {
        const oldY = spriteState.y;
        spriteState.y = y;
        if (spriteState.penDown) {
          runtime.penLines.push({
            x1: spriteState.x, y1: oldY,
            x2: spriteState.x, y2: y,
            color: spriteState.penColor,
            size: spriteState.penSize,
          });
        }
        runtime.onUpdate();
      },

      async changeX(dx: number) {
        await this.setX(spriteState.x + dx);
      },

      async changeY(dy: number) {
        await this.setY(spriteState.y + dy);
      },

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

      clearEffects() {
        spriteState.colorEffect = 0;
        runtime.onUpdate();
      },

      bounceOffEdge() {
        const hw = STAGE_WIDTH / 2;
        const hh = STAGE_HEIGHT / 2;
        if (spriteState.x > hw || spriteState.x < -hw) {
          spriteState.direction = (180 - spriteState.direction + 360) % 360;
          spriteState.x = Math.max(-hw, Math.min(hw, spriteState.x));
        }
        if (spriteState.y > hh || spriteState.y < -hh) {
          spriteState.direction = (360 - spriteState.direction) % 360;
          spriteState.y = Math.max(-hh, Math.min(hh, spriteState.y));
        }
        runtime.onUpdate();
      },

      isTouchingEdge() {
        const hw = STAGE_WIDTH / 2;
        const hh = STAGE_HEIGHT / 2;
        return Math.abs(spriteState.x) >= hw - 10 || Math.abs(spriteState.y) >= hh - 10;
      },

      stamp() {
        // Draw current sprite appearance at current position to pen layer
        runtime.onUpdate();
      },
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
}
