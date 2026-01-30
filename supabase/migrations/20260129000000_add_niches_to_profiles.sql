-- Add niches column to profiles table
-- This is an optional text array for storing journalist coverage niches/topics

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'niches'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN niches text[] DEFAULT NULL;
    COMMENT ON COLUMN public.profiles.niches IS 'Optional array of niche topics/beats the journalist covers';
  END IF;
END $$;
