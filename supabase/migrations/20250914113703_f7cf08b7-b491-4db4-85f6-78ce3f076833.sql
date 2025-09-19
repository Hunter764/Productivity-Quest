-- Fix search path for check_character_unlock function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;