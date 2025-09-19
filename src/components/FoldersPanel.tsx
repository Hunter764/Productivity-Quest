import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Folder as FolderIcon, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  File
} from "lucide-react";
import { Folder, Note } from "@/types/notes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FoldersPanelProps {
  folders: Folder[];
  notes: Note[];
  selectedFolderId: string | null;
  selectedNoteId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onSelectNote: (noteId: string | null) => void;
  onCreateFolder: (name: string, color: string, icon: string) => void;
  onUpdateFolder: (id: string, updates: Partial<Folder>) => void;
  onDeleteFolder: (id: string) => void;
  onCreateNote: (title: string, folderId: string) => void;
  onDeleteNote: (id: string) => void;
  getNotesForFolder: (folderId: string) => Note[];
}

export const FoldersPanel = ({ 
  folders, 
  notes,
  selectedFolderId, 
  selectedNoteId,
  onSelectFolder, 
  onSelectNote,
  onCreateFolder, 
  onUpdateFolder,
  onDeleteFolder,
  onCreateNote,
  onDeleteNote,
  getNotesForFolder 
}: FoldersPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const colors = ["#61dafb", "#3178c6", "#ff6b6b", "#51cf66", "#ffd43b", "#9775fa"];
      const icons = ["📁", "📚", "💡", "🎯", "🔬", "🎨", "⚙️", "🚀"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      
      onCreateFolder(newFolderName, randomColor, randomIcon);
      setNewFolderName("");
      setShowCreateFolder(false);
    }
  };

  const handleCreateNote = () => {
    if (newNoteTitle.trim() && selectedFolderId) {
      onCreateNote(newNoteTitle, selectedFolderId);
      setNewNoteTitle("");
      setShowCreateNote(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Notes</h3>
          <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateFolder} className="flex-1">
                    Create
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateFolder(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search folders and notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {filteredFolders.map((folder) => {
              const folderNotes = getNotesForFolder(folder.id);
              
              return (
                <div key={folder.id} className="space-y-1">
                  <div 
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors hover:bg-secondary/50 ${
                      selectedFolderId === folder.id ? 'bg-secondary' : ''
                    }`}
                    onClick={() => onSelectFolder(folder.id)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">{folder.icon}</span>
                      <span className="font-medium">{folder.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {folderNotes.length}
                      </Badge>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setShowCreateNote(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Note
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteFolder(folder.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Notes in this folder */}
                  {selectedFolderId === folder.id && (
                    <div className="ml-6 space-y-1">
                      {folderNotes.map((note) => (
                        <div
                          key={note.id}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors hover:bg-secondary/30 ${
                            selectedNoteId === note.id ? 'bg-secondary/50' : ''
                          }`}
                          onClick={() => onSelectNote(note.id)}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate">{note.title}</span>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem 
                                onClick={() => onDeleteNote(note.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full justify-start ml-0 text-muted-foreground"
                        onClick={() => setShowCreateNote(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Create Note Dialog */}
        <Dialog open={showCreateNote} onOpenChange={setShowCreateNote}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Note title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateNote()}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateNote} 
                  className="flex-1"
                  disabled={!selectedFolderId}
                >
                  Create
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateNote(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};