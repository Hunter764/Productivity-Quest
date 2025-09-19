export interface AnimeCharacter {
  id: string;
  name: string;
  series: string;
  tier: 'starter' | 'rare' | 'epic' | 'legendary';
  image_url: string | null;
  preview_image_url: string | null;
  art_style: string | null;
  description: string | null;
  unlock_condition_type: 'level' | 'tasks' | 'achievements' | 'xp' | 'streak' | 'special';
  unlock_condition_value: number;
  unlock_condition_description: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCharacterUnlock {
  id: string;
  user_id: string;
  character_id: string;
  unlocked_at: string;
  equipped: boolean;
  created_at: string;
}

export interface CharacterWithUnlockStatus extends AnimeCharacter {
  isUnlocked: boolean;
  canUnlock: boolean;
  unlockedAt?: string;
  equipped?: boolean;
}

export interface CharacterStats {
  totalCharacters: number;
  unlockedCharacters: number;
  starterUnlocked: number;
  rareUnlocked: number;
  epicUnlocked: number;
  legendaryUnlocked: number;
}