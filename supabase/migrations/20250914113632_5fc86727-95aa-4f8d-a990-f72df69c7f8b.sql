-- Create anime characters table
CREATE TABLE public.anime_characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  series TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('starter', 'rare', 'epic', 'legendary')),
  image_url TEXT,
  description TEXT,
  unlock_condition_type TEXT NOT NULL CHECK (unlock_condition_type IN ('level', 'tasks', 'achievements', 'xp', 'streak', 'special')),
  unlock_condition_value INTEGER NOT NULL,
  unlock_condition_description TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user character unlocks table
CREATE TABLE public.user_character_unlocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.anime_characters(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  equipped BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, character_id)
);

-- Enable Row Level Security
ALTER TABLE public.anime_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_character_unlocks ENABLE ROW LEVEL SECURITY;

-- Create policies for anime_characters
CREATE POLICY "Anyone can view active characters" 
ON public.anime_characters 
FOR SELECT 
USING (is_active = true);

-- Create policies for user_character_unlocks
CREATE POLICY "Users can view their own unlocks" 
ON public.user_character_unlocks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own unlocks" 
ON public.user_character_unlocks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own unlocks" 
ON public.user_character_unlocks 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to check if character should be unlocked
CREATE OR REPLACE FUNCTION public.check_character_unlock(character_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  char_rec RECORD;
  user_profile RECORD;
BEGIN
  -- Get character unlock requirements
  SELECT unlock_condition_type, unlock_condition_value 
  INTO char_rec
  FROM public.anime_characters 
  WHERE id = character_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Get user profile data
  SELECT level, total_xp, current_streak, longest_streak
  INTO user_profile
  FROM public.profiles 
  WHERE user_id = check_character_unlock.user_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check unlock conditions
  CASE char_rec.unlock_condition_type
    WHEN 'level' THEN
      RETURN user_profile.level >= char_rec.unlock_condition_value;
    WHEN 'xp' THEN
      RETURN user_profile.total_xp >= char_rec.unlock_condition_value;
    WHEN 'streak' THEN
      RETURN user_profile.longest_streak >= char_rec.unlock_condition_value;
    ELSE
      RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_anime_characters_updated_at
BEFORE UPDATE ON public.anime_characters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial anime characters
INSERT INTO public.anime_characters (name, series, tier, image_url, description, unlock_condition_type, unlock_condition_value, unlock_condition_description, order_index) VALUES
-- Starter Characters
('Izuku Midoriya', 'My Hero Academia', 'starter', '/placeholder.svg', 'The aspiring hero with One For All!', 'level', 1, 'Complete tutorial', 1),
('Tanjiro Kamado', 'Demon Slayer', 'starter', '/placeholder.svg', 'The determined demon slayer!', 'tasks', 1, 'Complete your first task', 2),

-- Rare Characters  
('Naruto Uzumaki', 'Naruto', 'rare', '/placeholder.svg', 'The ninja who never gives up!', 'level', 5, 'Reach level 5', 3),
('Edward Elric', 'Fullmetal Alchemist', 'rare', '/placeholder.svg', 'The Fullmetal Alchemist!', 'tasks', 10, 'Complete 10 tasks', 4),
('Ichigo Kurosaki', 'Bleach', 'rare', '/placeholder.svg', 'The substitute Soul Reaper!', 'xp', 500, 'Earn 500 XP', 5),
('Natsu Dragneel', 'Fairy Tail', 'rare', '/placeholder.svg', 'The Fire Dragon Slayer!', 'streak', 3, 'Maintain a 3-day streak', 6),

-- Epic Characters
('Monkey D. Luffy', 'One Piece', 'epic', '/placeholder.svg', 'The future Pirate King!', 'level', 10, 'Reach level 10', 7),
('Son Goku', 'Dragon Ball Z', 'epic', '/placeholder.svg', 'The legendary Super Saiyan!', 'xp', 1000, 'Earn 1000 XP', 8),
('Eren Yeager', 'Attack on Titan', 'epic', '/placeholder.svg', 'The Attack Titan wielder!', 'tasks', 25, 'Complete 25 tasks', 9),
('Light Yagami', 'Death Note', 'epic', '/placeholder.svg', 'The genius with the Death Note!', 'streak', 7, 'Maintain a 7-day streak', 10),
('Senku Ishigami', 'Dr. Stone', 'epic', '/placeholder.svg', 'The science genius!', 'level', 15, 'Reach level 15', 11),

-- Legendary Characters
('Saitama', 'One Punch Man', 'legendary', '/placeholder.svg', 'The hero who can defeat anyone with one punch!', 'level', 20, 'Reach level 20', 12),
('Lelouch vi Britannia', 'Code Geass', 'legendary', '/placeholder.svg', 'The strategic mastermind!', 'xp', 2000, 'Earn 2000 XP', 13),
('Gon Freecss', 'Hunter x Hunter', 'legendary', '/placeholder.svg', 'The determined hunter!', 'tasks', 50, 'Complete 50 tasks', 14),
('Rimuru Tempest', 'That Time I Got Reincarnated as a Slime', 'legendary', '/placeholder.svg', 'The powerful slime overlord!', 'streak', 14, 'Maintain a 14-day streak', 15),
('Anos Voldigoad', 'The Misfit of Demon King Academy', 'legendary', '/placeholder.svg', 'The reincarnated Demon King!', 'level', 30, 'Reach level 30', 16),

-- More Epic Characters
('Yusuke Urameshi', 'Yu Yu Hakusho', 'epic', '/placeholder.svg', 'The Spirit Detective!', 'xp', 1500, 'Earn 1500 XP', 17),
('Ainz Ooal Gown', 'Overlord', 'epic', '/placeholder.svg', 'The undead overlord!', 'level', 18, 'Reach level 18', 18),
('Meliodas', 'Seven Deadly Sins', 'epic', '/placeholder.svg', 'The Dragon Sin of Wrath!', 'tasks', 30, 'Complete 30 tasks', 19),

-- More Rare Characters
('Kirito', 'Sword Art Online', 'rare', '/placeholder.svg', 'The Black Swordsman!', 'level', 8, 'Reach level 8', 20),
('Asta', 'Black Clover', 'rare', '/placeholder.svg', 'The magic-less mage!', 'tasks', 15, 'Complete 15 tasks', 21),
('Yami Sukehiro', 'Black Clover', 'rare', '/placeholder.svg', 'The Dark Magic captain!', 'xp', 750, 'Earn 750 XP', 22),

-- Ultimate Legendary Characters
('Giorno Giovanna', 'JoJos Bizarre Adventure', 'legendary', '/placeholder.svg', 'The Golden Experience user!', 'xp', 3000, 'Earn 3000 XP', 23),
('Mob', 'Mob Psycho 100', 'legendary', '/placeholder.svg', 'The psychic powerhouse!', 'streak', 21, 'Maintain a 21-day streak', 24),
('All Might', 'My Hero Academia', 'legendary', '/placeholder.svg', 'The Symbol of Peace!', 'level', 25, 'Reach level 25', 25);