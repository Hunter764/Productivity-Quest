import { useState, useEffect } from "react";
import { Note, Folder, UserProfile } from "@/types/notes";

const NOTES_STORAGE_KEY = "notes_system";

export const useNotesData = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setNotes(data.notes || []);
      setFolders(data.folders || []);
      setUserProfile(data.userProfile || createDefaultProfile());
    } else {
      // Initialize with default data
      const defaultProfile = createDefaultProfile();
      const defaultFolders = createDefaultFolders();
      setUserProfile(defaultProfile);
      setFolders(defaultFolders);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    const data = {
      notes,
      folders,
      userProfile
    };
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(data));
  }, [notes, folders, userProfile]);

  const createDefaultProfile = (): UserProfile => ({
    id: crypto.randomUUID(),
    name: "Luffy",
    email: "luffy@strawhat.com",
    avatar: "/src/assets/luffy-avatar.png",
    level: 1,
    totalXP: 0,
    joinedAt: new Date(),
    preferences: {
      theme: 'system',
      autoSave: true,
      enableMarkdown: true
    }
  });

  const createDefaultFolders = (): Folder[] => [
    {
      id: crypto.randomUUID(),
      name: "Learning Notes",
      color: "#61dafb",
      icon: "📚",
      createdAt: new Date()
    },
    {
      id: crypto.randomUUID(),
      name: "Project Ideas",
      color: "#3178c6",
      icon: "💡",
      createdAt: new Date()
    },
    {
      id: crypto.randomUUID(),
      name: "Daily Journal",
      color: "#ff6b6b",
      icon: "📝",
      createdAt: new Date()
    },
    {
      id: crypto.randomUUID(),
      name: "Meeting Notes",
      color: "#10b981",
      icon: "🤝",
      createdAt: new Date()
    }
  ];

  const createFolder = (name: string, color: string, icon: string, parentId?: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      color,
      icon,
      parentId,
      createdAt: new Date()
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    setFolders(prev => prev.map(folder => 
      folder.id === id ? { ...folder, ...updates } : folder
    ));
  };

  const deleteFolder = (id: string) => {
    // Delete all notes in this folder
    setNotes(prev => prev.filter(note => note.folderId !== id));
    // Delete the folder
    setFolders(prev => prev.filter(folder => folder.id !== id));
    // Clear selection if deleted folder was selected
    if (selectedFolderId === id) {
      setSelectedFolderId(null);
      setSelectedNoteId(null);
    }
  };

  const createNote = (title: string, folderId: string, content: string = "") => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      folderId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [...prev, newNote]);
    setSelectedNoteId(newNote.id);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  const getNotesForFolder = (folderId: string) => {
    return notes.filter(note => note.folderId === folderId);
  };

  const getSelectedNote = () => {
    return selectedNoteId ? notes.find(note => note.id === selectedNoteId) : null;
  };

  const getSelectedFolder = () => {
    return selectedFolderId ? folders.find(folder => folder.id === selectedFolderId) : null;
  };

  const searchNotes = (query: string) => {
    return notes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    notes,
    folders,
    userProfile,
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
    searchNotes,
    setUserProfile
  };
};