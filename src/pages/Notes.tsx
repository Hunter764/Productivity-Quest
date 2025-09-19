import { useState } from "react";
import { useNotesData } from "@/hooks/useNotesData";
import { NotesEditor } from "@/components/NotesEditor";
import { FoldersPanel } from "@/components/FoldersPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProductivityData } from "@/hooks/useProductivityData";
import { useToast } from "@/hooks/use-toast";
import { Search, BookOpen, TrendingUp, Star } from "lucide-react";

export const Notes = () => {
  const {
    notes,
    folders,
    selectedFolderId,
    selectedNoteId,
    setSelectedFolderId,
    setSelectedNoteId,
    createFolder,
    updateFolder,
    deleteFolder,
    createNote,
    updateNote,
    deleteNote,
    getNotesForFolder,
    getSelectedNote,
    getSelectedFolder,
    searchNotes
  } = useNotesData();

  const { addTask } = useProductivityData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [xpEarned, setXpEarned] = useState(0);

  const selectedNote = getSelectedNote();
  const selectedFolder = getSelectedFolder();
  const filteredNotes = searchQuery ? searchNotes(searchQuery) : [];

  const handleSaveNote = (noteId: string, title: string, content: string) => {
    updateNote(noteId, { content, title });
    
    // Award XP for note activity
    const wordCount = content.split(' ').length;
    if (wordCount >= 50) { // Substantial note content
      const xpGained = Math.floor(wordCount / 25); // 1 XP per 25 words
      setXpEarned(prev => prev + xpGained);
      
      // Add to productivity system
      if (selectedFolder) {
        addTask(
          "notes-" + selectedFolder.id, 
          `Note: ${title}`, 
          `Updated note with ${wordCount} words`, 
          xpGained
        );
      }
      
      toast({
        title: "Note Saved! 📝",
        description: `Earned ${xpGained} XP for your thoughtful writing!`,
      });
    }
  };

  const handleCreateNote = (title: string, folderId: string) => {
    const newNote = createNote(title, folderId);
    
    // Award XP for creating notes
    const xpGained = 5;
    setXpEarned(prev => prev + xpGained);
    
    toast({
      title: "New Note Created! ✨",
      description: `Earned ${xpGained} XP for starting a new note!`,
    });
  };

  const totalNotes = notes.length;
  const totalFolders = folders.length;
  const totalWords = notes.reduce((acc, note) => 
    acc + note.content.split(' ').length, 0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="retro-card bg-gradient-to-r from-gaming-primary/10 to-gaming-accent/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gaming-accent" />
              Notes & Knowledge Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Organize your thoughts, capture ideas, and build your knowledge base. 
              Earn XP for consistent note-taking and unlock premium templates! 📚
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {totalNotes} Notes
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {totalFolders} Collections
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {totalWords.toLocaleString()} Words
              </Badge>
              {xpEarned > 0 && (
                <Badge variant="default" className="flex items-center gap-1 animate-pulse">
                  ⭐ {xpEarned} XP Earned
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes and collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Search Results */}
            {searchQuery && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Found {filteredNotes.length} results
                </p>
                {filteredNotes.map((note) => (
                  <Button
                    key={note.id}
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setSelectedFolderId(note.folderId);
                      setSelectedNoteId(note.id);
                      setSearchQuery("");
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{note.title}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {note.content.substring(0, 100)}...
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Folders Panel */}
          <div className="lg:col-span-1">
            <FoldersPanel
              folders={folders}
              notes={notes}
              selectedFolderId={selectedFolderId}
              selectedNoteId={selectedNoteId}
              onSelectFolder={setSelectedFolderId}
              onSelectNote={setSelectedNoteId}
              onCreateFolder={createFolder}
              onUpdateFolder={updateFolder}
              onDeleteFolder={deleteFolder}
              onCreateNote={handleCreateNote}
              onDeleteNote={deleteNote}
              getNotesForFolder={getNotesForFolder}
            />
          </div>

          {/* Notes Editor */}
          <div className="lg:col-span-2">
            <NotesEditor
              note={selectedNote}
              onSave={handleSaveNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
};