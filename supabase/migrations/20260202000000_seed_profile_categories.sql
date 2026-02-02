-- Seed profile completion categories (idempotent - safe to run multiple times)
-- Categories table already exists with columns: id (text PK), title (text unique), created_at
-- Uses ON CONFLICT (title) to prevent duplicate category names

INSERT INTO public.categories (id, title) VALUES
  ('healthcare', 'Healthcare'),
  ('lifestyle', 'Lifestyle'),
  ('travel', 'Travel'),
  ('entertainment', 'Entertainment'),
  ('finance', 'Finance'),
  ('politics', 'Politics'),
  ('business', 'Business'),
  ('technology', 'Technology'),
  ('uncategorised', 'Uncategorised')
ON CONFLICT (title) DO NOTHING;
