import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFolderOpen, faFloppyDisk, faShareNodes, faRotateLeft, faRotateRight, faCircleQuestion, faCode } from '@fortawesome/free-solid-svg-icons';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';

interface HeaderMenuBarProps {
  onNew: () => void;
  onSave: () => void;
  onLoad: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAbout: () => void;
  onHowToCode: () => void;
  onShare?: () => void;
}

export default function HeaderMenuBar({ onNew, onSave, onLoad, onUndo, onRedo, onAbout, onHowToCode, onShare }: HeaderMenuBarProps) {
  return (
    <Menubar className="border-none bg-transparent h-auto p-0 gap-0">
      <MenubarMenu>
        <MenubarTrigger className="text-xs font-medium px-3 py-1 text-foreground/80 hover:text-foreground cursor-pointer data-[state=open]:bg-muted rounded-md">
          File
        </MenubarTrigger>
        <MenubarContent className="bg-card border-border">
          <MenubarItem onClick={onNew} className="text-xs gap-2 cursor-pointer">
            <FontAwesomeIcon icon={faFile} className="w-3 h-3 text-muted-foreground" />
            New Project
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onSave} className="text-xs gap-2 cursor-pointer">
            <FontAwesomeIcon icon={faFloppyDisk} className="w-3 h-3 text-muted-foreground" />
            Save as .aur
            <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onLoad} className="text-xs gap-2 cursor-pointer">
            <FontAwesomeIcon icon={faFolderOpen} className="w-3 h-3 text-muted-foreground" />
            Load .aur
            <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onShare} className="text-xs gap-2 cursor-pointer">
            <FontAwesomeIcon icon={faShareNodes} className="w-3 h-3 text-muted-foreground" />
            Share
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-xs font-medium px-3 py-1 text-foreground/80 hover:text-foreground cursor-pointer data-[state=open]:bg-muted rounded-md">
          Edit
        </MenubarTrigger>
        <MenubarContent className="bg-card border-border">
          <MenubarItem onClick={onUndo} className="text-xs gap-2 cursor-pointer">
            <FontAwesomeIcon icon={faRotateLeft} className="w-3 h-3 text-muted-foreground" />
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onRedo} className="text-xs gap-2 cursor-pointer">
            <FontAwesomeIcon icon={faRotateRight} className="w-3 h-3 text-muted-foreground" />
            Redo
            <MenubarShortcut>⌘⇧Z</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-xs font-medium px-3 py-1 text-foreground/80 hover:text-foreground cursor-pointer data-[state=open]:bg-muted rounded-md">
          Help
        </MenubarTrigger>
        <MenubarContent className="bg-card border-border">
          <MenubarItem onClick={onAbout} className="text-xs gap-2 cursor-pointer">
            <FontAwesomeIcon icon={faCircleQuestion} className="w-3 h-3 text-muted-foreground" />
            About Aurora
          </MenubarItem>
          <MenubarItem onClick={onHowToCode} className="text-xs gap-2 cursor-pointer">
            <FontAwesomeIcon icon={faCode} className="w-3 h-3 text-muted-foreground" />
            How to Code
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
