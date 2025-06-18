
-- Fix Security Definer Views by dropping and recreating them without SECURITY DEFINER
DROP VIEW IF EXISTS public.enriched_artists;
DROP VIEW IF EXISTS public.high_value_artists;  
DROP VIEW IF EXISTS public.recent_discoveries;

-- Recreate views without SECURITY DEFINER (will use SECURITY INVOKER by default)
CREATE VIEW public.enriched_artists AS
SELECT 
  a.id,
  a.name,
  a.youtube_channel_id,
  a.follower_counts,
  a.social_links,
  a.metadata,
  a.discovery_date,
  a.last_updated,
  a.enrichment_score,
  a.bio,
  a.location,
  a.genres,
  a.email,
  a.spotify_id,
  a.instagram_handle,
  a.youtube_channel_name,
  a.website,
  a.status,
  COUNT(v.id) as video_count,
  COUNT(CASE WHEN la.sentiment_score IS NOT NULL THEN 1 END) as analyzed_videos,
  AVG(la.sentiment_score) as avg_sentiment
FROM artists a
LEFT JOIN videos v ON a.id = v.artist_id
LEFT JOIN lyric_analyses la ON a.id = la.artist_id
GROUP BY a.id, a.name, a.youtube_channel_id, a.follower_counts, a.social_links, 
         a.metadata, a.discovery_date, a.last_updated, a.enrichment_score, 
         a.bio, a.location, a.genres, a.email, a.spotify_id, a.instagram_handle, 
         a.youtube_channel_name, a.website, a.status;

CREATE VIEW public.high_value_artists AS
SELECT 
  a.id,
  a.name,
  a.spotify_url,
  a.avatar_url,
  a.spotify_monthly_listeners,
  a.youtube_subscriber_count,
  a.instagram_follower_count,
  a.instagram_url,
  a.discovery_date,
  a.discovery_score,
  a.is_validated
FROM artists a
WHERE a.discovery_score > 50 
   OR a.spotify_monthly_listeners > 10000 
   OR a.youtube_subscriber_count > 5000;

CREATE VIEW public.recent_discoveries AS
SELECT 
  a.id,
  a.name,
  a.discovery_date,
  a.avatar_url,
  a.spotify_monthly_listeners,
  a.discovery_video_title,
  a.discovery_score,
  a.is_validated
FROM artists a
WHERE a.discovery_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY a.discovery_date DESC;

-- Enable RLS on tables that don't have it
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_chat_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_spotify_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_lyrics_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_discovery_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."KJV_Bible" ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for tables that might need user access
-- Note: Most of these tables appear to be system/admin tables, so restrictive policies

-- For conversations (if user-facing)
CREATE POLICY "Enable read access for authenticated users" ON public.conversations
  FOR SELECT USING (auth.role() = 'authenticated');

-- For documents (if user-facing)  
CREATE POLICY "Enable read access for authenticated users" ON public.documents
  FOR SELECT USING (auth.role() = 'authenticated');

-- For KJV_Bible (likely public read access) - using quoted name for case sensitivity
CREATE POLICY "Enable read access for all users" ON public."KJV_Bible"
  FOR SELECT USING (true);

-- For review_templates (should be readable by authenticated users)
ALTER TABLE public.review_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for authenticated users" ON public.review_templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- For system/admin tables, create restrictive policies that only allow service role access
CREATE POLICY "Service role only" ON public.api_rate_limits
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON public.message_embeddings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON public.n8n_chat_histories
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON public.document_metadata
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON public.document_rows
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON public.artist
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON public.artist_spotify_tracks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON public.artist_lyrics_analysis
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON public.artist_discovery_log
  FOR ALL USING (auth.role() = 'service_role');
