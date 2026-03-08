import { useEffect, useRef, useCallback } from 'react';
import * as Blockly from 'blockly';
import { AURORA_TOOLBOX } from '@/lib/aurora-blocks';

interface BlocklyEditorProps {
  onWorkspaceChange?: (workspace: Blockly.WorkspaceSvg) => void;
  workspaceRef?: React.MutableRefObject<Blockly.WorkspaceSvg | null>;
}

export default function BlocklyEditor({ onWorkspaceChange, workspaceRef }: BlocklyEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const handleResize = useCallback(() => {
    if (wsRef.current) {
      Blockly.svgResize(wsRef.current);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || wsRef.current) return;

    const workspace = Blockly.inject(containerRef.current, {
      toolbox: AURORA_TOOLBOX as any,
      grid: {
        spacing: 25,
        length: 3,
        colour: 'rgba(255,255,255,0.05)',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.85,
        maxScale: 2,
        minScale: 0.3,
        scaleSpeed: 1.1,
      },
      trashcan: true,
      renderer: 'zelos',
      theme: Blockly.Theme.defineTheme('aurora', {
        name: 'aurora',
        base: Blockly.Themes.Classic,
        componentStyles: {
          workspaceBackgroundColour: 'hsl(230, 25%, 14%)',
          toolboxBackgroundColour: 'hsl(230, 25%, 12%)',
          toolboxForegroundColour: '#fff',
          flyoutBackgroundColour: 'hsl(230, 25%, 12%)',
          flyoutForegroundColour: '#fff',
          flyoutOpacity: 0.95,
          scrollbarColour: 'rgba(255,255,255,0.15)',
          scrollbarOpacity: 0.5,
          insertionMarkerColour: '#fff',
        },
        fontStyle: {
          family: 'Space Grotesk, sans-serif',
          weight: '500',
          size: 12,
        },
      }),
    });

    wsRef.current = workspace;
    if (workspaceRef) workspaceRef.current = workspace;

    workspace.addChangeListener(() => {
      onWorkspaceChange?.(workspace);
    });

    // Add some starter blocks
    const xml = `
      <xml>
        <block type="when_flag_clicked" x="30" y="30">
          <next>
            <block type="say_message">
              <value name="MSG">
                <shadow type="text">
                  <field name="TEXT">Welcome to Aurora! 🌟</field>
                </shadow>
              </value>
            </block>
          </next>
        </block>
      </xml>
    `;
    const dom = Blockly.utils.xml.textToDom(xml);
    Blockly.Xml.domToWorkspace(dom, workspace);

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      workspace.dispose();
      wsRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}
