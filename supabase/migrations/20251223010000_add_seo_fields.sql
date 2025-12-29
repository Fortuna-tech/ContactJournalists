-- Add SEO scoring fields to blogs table
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS seo_breakdown JSONB,
ADD COLUMN IF NOT EXISTS seo_flags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS seo_last_scored_at TIMESTAMPTZ;

-- Add index for filtering by SEO score
CREATE INDEX IF NOT EXISTS idx_blogs_seo_score ON public.blogs(seo_score);

-- Add index for filtering by flags
CREATE INDEX IF NOT EXISTS idx_blogs_seo_flags ON public.blogs USING GIN(seo_flags);

