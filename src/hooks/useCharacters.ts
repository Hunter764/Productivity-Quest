import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { AnimeCharacter, UserCharacterUnlock, CharacterWithUnlockStatus, CharacterStats } from '@/types/characters';
import { toast } from '@/hooks/use-toast';

export function useCharacters() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<CharacterWithUnlockStatus[]>([]);
  const [stats, setStats] = useState<CharacterStats>({
    totalCharacters: 0,
    unlockedCharacters: 0,
    starterUnlocked: 0,
    rareUnlocked: 0,
    epicUnlocked: 0,
    legendaryUnlocked: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all active characters
      const { data: charactersData, error: charactersError } = await supabase
        .from('anime_characters')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (charactersError) throw charactersError;

      // Fetch user's unlocks
      const { data: unlocksData, error: unlocksError } = await supabase
        .from('user_character_unlocks')
        .select('*')
        .eq('user_id', user.id);

      if (unlocksError) throw unlocksError;

      // Check which characters can be unlocked
      const charactersWithStatus: CharacterWithUnlockStatus[] = [];
      
      for (const character of charactersData || []) {
        const unlock = unlocksData?.find(u => u.character_id === character.id);
        const isUnlocked = !!unlock;
        
        let canUnlock = false;
        if (!isUnlocked) {
          const { data: canUnlockData } = await supabase
            .rpc('check_character_unlock', {
              character_id: character.id,
              user_id: user.id
            });
          canUnlock = canUnlockData || false;
        }

        charactersWithStatus.push({
          ...character,
          tier: character.tier as 'starter' | 'rare' | 'epic' | 'legendary',
          unlock_condition_type: character.unlock_condition_type as 'level' | 'tasks' | 'achievements' | 'xp' | 'streak' | 'special',
          isUnlocked,
          canUnlock,
          unlockedAt: unlock?.unlocked_at,
          equipped: unlock?.equipped || false,
        });
      }

      setCharacters(charactersWithStatus);

      // Calculate stats
      const totalCharacters = charactersWithStatus.length;
      const unlockedChars = charactersWithStatus.filter(c => c.isUnlocked);
      const unlockedCharacters = unlockedChars.length;

      const tierCounts = {
        starter: unlockedChars.filter(c => c.tier === 'starter').length,
        rare: unlockedChars.filter(c => c.tier === 'rare').length,
        epic: unlockedChars.filter(c => c.tier === 'epic').length,
        legendary: unlockedChars.filter(c => c.tier === 'legendary').length,
      };

      setStats({
        totalCharacters,
        unlockedCharacters,
        starterUnlocked: tierCounts.starter,
        rareUnlocked: tierCounts.rare,
        epicUnlocked: tierCounts.epic,
        legendaryUnlocked: tierCounts.legendary,
      });

    } catch (err) {
      console.error('Error fetching characters:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch characters');
    } finally {
      setLoading(false);
    }
  };

  const unlockCharacter = async (characterId: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_character_unlocks')
        .insert({
          user_id: user.id,
          character_id: characterId,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh character data
      await fetchCharacters();

      // Find the character name for the toast
      const character = characters.find(c => c.id === characterId);
      if (character) {
        toast({
          title: "Character Unlocked! 🎉",
          description: `You've unlocked ${character.name} from ${character.series}!`,
        });
      }

      return true;
    } catch (err) {
      console.error('Error unlocking character:', err);
      toast({
        title: "Error",
        description: "Failed to unlock character. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const equipCharacter = async (characterId: string) => {
    if (!user) return false;

    try {
      // First, unequip all characters
      await supabase
        .from('user_character_unlocks')
        .update({ equipped: false })
        .eq('user_id', user.id);

      // Then equip the selected character
      const { error } = await supabase
        .from('user_character_unlocks')
        .update({ equipped: true })
        .eq('user_id', user.id)
        .eq('character_id', characterId);

      if (error) throw error;

      // Refresh character data
      await fetchCharacters();

      const character = characters.find(c => c.id === characterId);
      if (character) {
        toast({
          title: "Character Equipped! ⚔️",
          description: `${character.name} is now your active character!`,
        });
      }

      return true;
    } catch (err) {
      console.error('Error equipping character:', err);
      toast({
        title: "Error",
        description: "Failed to equip character. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Auto-unlock eligible characters
  const checkAutoUnlocks = async () => {
    if (!user) return;

    const eligibleCharacters = characters.filter(c => !c.isUnlocked && c.canUnlock);
    
    for (const character of eligibleCharacters) {
      await unlockCharacter(character.id);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [user]);

  return {
    characters,
    stats,
    loading,
    error,
    unlockCharacter,
    equipCharacter,
    checkAutoUnlocks,
    refetch: fetchCharacters,
  };
}