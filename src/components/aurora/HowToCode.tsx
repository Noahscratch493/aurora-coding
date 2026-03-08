import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCubes, faCode } from '@fortawesome/free-solid-svg-icons';

interface HowToCodeProps {
  onClose: () => void;
}

const BLOCK_LESSONS = [
  { title: 'Getting Started', content: 'Drag blocks from the toolbox on the left into the workspace. Snap them together to build scripts. Click the green flag ▶ to run your code!' },
  { title: 'Motion Blocks', content: 'Use "move _ steps" to make your sprite move forward. "turn" blocks rotate the sprite. "go to x: y:" teleports the sprite to a position on the stage.' },
  { title: 'Looks Blocks', content: '"say" and "think" blocks show speech/thought bubbles. "change size" and "set size" control sprite scaling. "show"/"hide" toggle visibility.' },
  { title: 'Control Blocks', content: '"forever" runs blocks inside it forever. "repeat _" runs a set number of times. "if/then" checks a condition. "wait _ seconds" pauses execution.' },
  { title: 'Events', content: '"when 🚩 clicked" starts your code when you press Run. "when _ key pressed" responds to keyboard input. Use "broadcast" to send messages between sprites.' },
  { title: 'Operators', content: 'Math blocks (+, -, ×, ÷) do calculations. Comparison blocks (>, <, =) return true/false for conditions. "join" combines text strings.' },
  { title: 'Pen', content: '"pen down" starts drawing as the sprite moves. "pen up" stops drawing. Set pen color and size. "erase all" clears drawings.' },
];

const PYTHON_LESSONS = [
  { title: 'Getting Started', content: 'Switch to the Python tab to write code directly. Use the sprite object to control your character. All functions are async, so use "await" for movement.' },
  { title: 'Movement', content: '```\nawait sprite.move(10)     # Move forward\nawait sprite.turnRight(90) # Turn right\nawait sprite.goTo(0, 0)    # Go to position\n```' },
  { title: 'Looks', content: '```\nawait sprite.say("Hello!")     # Speech bubble\nawait sprite.sayFor("Hi!", 2)  # Say for 2 seconds\nsprite.setSize(150)            # Set size to 150%\nsprite.visible = False         # Hide sprite\n```' },
  { title: 'Control Flow', content: '```\n# Repeat 10 times\nfor i in range(10):\n    await sprite.move(10)\n    await sprite.turnRight(36)\n    await runtime.tick()\n\n# Forever loop\nwhile runtime.running:\n    await sprite.move(1)\n    await runtime.tick()\n```' },
  { title: 'Pen Drawing', content: '```\nsprite.penDown = True\nsprite.penColor = "#ff0000"\nsprite.penSize = 3\nawait sprite.move(100)\nsprite.penDown = False\n```' },
];

export default function HowToCode({ onClose }: HowToCodeProps) {
  const [mode, setMode] = useState<'blocks' | 'python'>('blocks');
  const [lessonIdx, setLessonIdx] = useState(0);

  const lessons = mode === 'blocks' ? BLOCK_LESSONS : PYTHON_LESSONS;
  const lesson = lessons[lessonIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border aurora-gradient">
          <h2 className="text-sm font-bold text-foreground">How to Code</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => { setMode('blocks'); setLessonIdx(0); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors ${mode === 'blocks' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <FontAwesomeIcon icon={faCubes} /> Block Programming
          </button>
          <button
            onClick={() => { setMode('python'); setLessonIdx(0); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors ${mode === 'python' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <FontAwesomeIcon icon={faCode} /> Python
          </button>
        </div>

        {/* Lesson content */}
        <div className="flex-1 overflow-auto p-5">
          <h3 className="text-base font-bold text-foreground mb-3">{lesson.title}</h3>
          <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-mono">
            {lesson.content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{lessonIdx + 1} / {lessons.length}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setLessonIdx(Math.max(0, lessonIdx - 1))}
              disabled={lessonIdx === 0}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-foreground disabled:opacity-40 hover:bg-muted/80 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setLessonIdx(Math.min(lessons.length - 1, lessonIdx + 1))}
              disabled={lessonIdx === lessons.length - 1}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
