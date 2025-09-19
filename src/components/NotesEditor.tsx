import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Undo, 
  Redo,
  Save,
  Type,
  Heading1,
  Heading2
} from "lucide-react";
import { useEffect, useState } from "react";
import { Note } from "@/types/notes";

interface NotesEditorProps {
  note: Note | null;
  onSave: (noteId: string, title: string, content: string) => void;
  onTitleChange?: (title: string) => void;
}

export const NotesEditor = ({ note, onSave, onTitleChange }: NotesEditorProps) => {
  const [title, setTitle] = useState(note?.title || "");
  const [hasChanges, setHasChanges] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your notes here...',
      }),
      Typography,
    ],
    content: note?.content || '',
    onUpdate: () => {
      setHasChanges(true);
    },
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      editor?.commands.setContent(note.content);
      setHasChanges(false);
    }
  }, [note, editor]);

  const handleSave = () => {
    if (!note || !editor) return;
    
    const content = editor.getHTML();
    onSave(note.id, title, content);
    setHasChanges(false);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setHasChanges(true);
    onTitleChange?.(newTitle);
  };

  if (!note) {
    return (
      <Card className="retro-card h-full">
        <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-6xl">📝</div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to Write!</h3>
            <p className="text-muted-foreground">
              Select a note from your collections or create a new one to start writing.
              Earn XP for consistent note-taking and thoughtful content! ✨
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b space-y-4">
        <div className="flex items-center gap-2">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Note title..."
            className="text-lg font-semibold border-none px-0 focus-visible:ring-0"
          />
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            size="sm"
            className="shrink-0"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive('bold') ? 'bg-secondary' : ''}
          >
            <Bold className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={editor?.isActive('italic') ? 'bg-secondary' : ''}
          >
            <Italic className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor?.isActive('heading', { level: 1 }) ? 'bg-secondary' : ''}
          >
            <Heading1 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor?.isActive('heading', { level: 2 }) ? 'bg-secondary' : ''}
          >
            <Heading2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={editor?.isActive('bulletList') ? 'bg-secondary' : ''}
          >
            <List className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={editor?.isActive('orderedList') ? 'bg-secondary' : ''}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={editor?.isActive('blockquote') ? 'bg-secondary' : ''}
          >
            <Quote className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            className={editor?.isActive('code') ? 'bg-secondary' : ''}
          >
            <Code className="w-4 h-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
          >
            <Undo className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <EditorContent 
          editor={editor} 
          className="h-full prose prose-sm max-w-none p-6 focus:outline-none"
        />
      </CardContent>
    </Card>
  );
};