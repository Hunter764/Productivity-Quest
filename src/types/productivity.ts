export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  points: number;
}

export interface Technology {
  id: string;
  name: string;
  color: string;
  icon: string;
  tasks: Task[];
  totalPoints: number;
  level: number;
  experience: number;
}

export interface MonthlyGoal {
  id: string;
  month: string;
  year: number;
  technologies: Technology[];
  totalPoints: number;
  completionPercentage: number;
  createdAt: Date;
}

export interface ProgressEntry {
  date: string;
  technologyId: string;
  points: number;
  cumulativePoints: number;
}

export interface DashboardStats {
  totalPoints: number;
  technologiesCovered: number;
  completionPercentage: number;
  currentStreak: number;
  longestStreak: number;
  tasksCompleted: number;
  averageLevel: number;
}

// Collectible Characters System
export interface CollectibleCharacter {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  series: string;
  imageUrl: string;
  unlockCondition: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

// Achievement System
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'streak' | 'social' | 'special';
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
  condition: {
    type: 'points' | 'streak' | 'tasks' | 'technologies' | 'time' | 'special';
    target: number;
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
  };
  reward: {
    type: 'character' | 'cosmetic' | 'title' | 'badge';
    value: string;
  };
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
}

// Daily Quest System
export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'complete_tasks' | 'study_time' | 'streak' | 'technology_focus';
  target: number;
  progress: number;
  reward: {
    xp: number;
    coins: number;
    character?: string;
  };
  isCompleted: boolean;
  expiresAt: Date;
}

// Social Features
export interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  totalXP: number;
  currentStreak: number;
  lastActive: Date;
  status: 'online' | 'offline' | 'studying';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'group';
  category: 'tasks' | 'streak' | 'time' | 'points';
  target: number;
  duration: number; // days
  participants: string[]; // friend IDs
  progress: { [friendId: string]: number };
  reward: {
    xp: number;
    character?: string;
    title?: string;
  };
  isActive: boolean;
  createdAt: Date;
  endsAt: Date;
}

// User Profile Enhancements
export interface UserCustomization {
  avatarItems: {
    hat?: string;
    outfit?: string;
    accessory?: string;
    background?: string;
  };
  theme: string;
  title?: string;
  favoriteCharacter?: string;
}

export interface UserStats {
  totalStudyTime: number; // in minutes
  longestSession: number;
  perfectDays: number; // days with all quests completed
  charactersCollected: number;
  achievementsUnlocked: number;
  friendsCount: number;
  challengesWon: number;
}

// Enhanced User Profile
export interface EnhancedUserProfile {
  id: string;
  name: string;
  level: number;
  totalXP: number;
  coins: number;
  currentStreak: number;
  longestStreak: number;
  joinedAt: Date;
  lastActive: Date;
  collectibleCharacters: CollectibleCharacter[];
  achievements: Achievement[];
  customization: UserCustomization;
  stats: UserStats;
  friends: Friend[];
  activeChallenges: Challenge[];
}

// Gacha/Reward System
export interface RewardBox {
  id: string;
  type: 'daily' | 'quest' | 'achievement' | 'premium';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  contents: {
    type: 'character' | 'coins' | 'cosmetic' | 'title';
    value: string | number;
    rarity: string;
  }[];
  isOpened: boolean;
  earnedAt: Date;
}