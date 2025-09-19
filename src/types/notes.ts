export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  color: string;
  icon: string;
  createdAt: Date;
  children?: Folder[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  totalXP: number;
  joinedAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    autoSave: boolean;
    enableMarkdown: boolean;
  };
}