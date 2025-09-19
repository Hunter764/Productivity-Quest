-- Add preview image and art style fields to anime_characters table
ALTER TABLE public.anime_characters 
ADD COLUMN preview_image_url TEXT,
ADD COLUMN art_style TEXT DEFAULT 'official';

-- Update existing characters with preview images from curated sources
UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE name = 'Izuku Midoriya';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE name = 'Tanjiro Kamado';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE name = 'Naruto Uzumaki';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE name = 'Edward Elric';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE name = 'Ichigo Kurosaki';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE name = 'Natsu Dragneel';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE name = 'Monkey D. Luffy';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE name = 'Son Goku';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE name = 'Eren Yeager';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE name = 'Light Yagami';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE name = 'Senku Ishigami';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=512&h=512&fit=crop&crop=face',
  art_style = 'legendary'
WHERE name = 'Saitama';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=512&h=512&fit=crop&crop=face',
  art_style = 'legendary'
WHERE name = 'Lelouch vi Britannia';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=512&h=512&fit=crop&crop=face',
  art_style = 'legendary'
WHERE name = 'Gon Freecss';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=512&h=512&fit=crop&crop=face',
  art_style = 'legendary'
WHERE name = 'Rimuru Tempest';

UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=512&h=512&fit=crop&crop=face',
  art_style = 'legendary'
WHERE name = 'Anos Voldigoad';

-- Update remaining characters with placeholder images
UPDATE public.anime_characters SET 
  preview_image_url = 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=512&h=512&fit=crop&crop=face',
  art_style = 'official'
WHERE preview_image_url IS NULL;