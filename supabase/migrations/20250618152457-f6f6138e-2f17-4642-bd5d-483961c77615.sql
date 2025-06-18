
-- First, let's completely drop the views to ensure clean recreation
DROP VIEW IF EXISTS public.enriched_artists CASCADE;
DROP VIEW IF EXISTS public.high_value_artists CASCADE;  
DROP VIEW IF EXISTS public.recent_discoveries CASCADE;

-- Recreate the views explicitly WITHOUT SECURITY DEFINER
-- (By default, views use SECURITY INVOKER unless explicitly specified otherwise)

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

-- Verify the views are created with SECURITY INVOKER (default)
-- You can check this by running: 
-- SELECT schemaname, viewname, viewowner, definition FROM pg_views WHERE schemaname = 'public' AND viewname IN ('enriched_artists', 'high_value_artists', 'recent_discoveries');
