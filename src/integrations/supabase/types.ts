export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_rate_limits: {
        Row: {
          api_name: string
          endpoint: string | null
          id: string
          last_request: string | null
          metadata: Json | null
          quota_limit: number | null
          requests_made: number | null
          reset_time: string | null
        }
        Insert: {
          api_name: string
          endpoint?: string | null
          id?: string
          last_request?: string | null
          metadata?: Json | null
          quota_limit?: number | null
          requests_made?: number | null
          reset_time?: string | null
        }
        Update: {
          api_name?: string
          endpoint?: string | null
          id?: string
          last_request?: string | null
          metadata?: Json | null
          quota_limit?: number | null
          requests_made?: number | null
          reset_time?: string | null
        }
        Relationships: []
      }
      artist: {
        Row: {
          created_at: string | null
          discovery_score: number | null
          discovery_source: string | null
          discovery_video_id: string | null
          discovery_video_title: string | null
          facebook_url: string | null
          id: number
          instagram_follower_count: number | null
          instagram_url: string | null
          instagram_username: string | null
          is_validated: boolean | null
          last_crawled_at: string | null
          music_sentiment_tags: Json | null
          music_theme_analysis: string | null
          name: string
          spotify_avatar_url: string | null
          spotify_biography: string | null
          spotify_genres: Json | null
          spotify_id: string | null
          spotify_monthly_listeners: number | null
          spotify_top_city: string | null
          spotify_url: string | null
          tiktok_follower_count: number | null
          tiktok_likes_count: number | null
          tiktok_url: string | null
          tiktok_username: string | null
          twitter_url: string | null
          updated_at: string | null
          website_url: string | null
          youtube_channel_id: string | null
          youtube_channel_url: string | null
          youtube_subscriber_count: number | null
        }
        Insert: {
          created_at?: string | null
          discovery_score?: number | null
          discovery_source?: string | null
          discovery_video_id?: string | null
          discovery_video_title?: string | null
          facebook_url?: string | null
          id?: number
          instagram_follower_count?: number | null
          instagram_url?: string | null
          instagram_username?: string | null
          is_validated?: boolean | null
          last_crawled_at?: string | null
          music_sentiment_tags?: Json | null
          music_theme_analysis?: string | null
          name: string
          spotify_avatar_url?: string | null
          spotify_biography?: string | null
          spotify_genres?: Json | null
          spotify_id?: string | null
          spotify_monthly_listeners?: number | null
          spotify_top_city?: string | null
          spotify_url?: string | null
          tiktok_follower_count?: number | null
          tiktok_likes_count?: number | null
          tiktok_url?: string | null
          tiktok_username?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
          youtube_channel_id?: string | null
          youtube_channel_url?: string | null
          youtube_subscriber_count?: number | null
        }
        Update: {
          created_at?: string | null
          discovery_score?: number | null
          discovery_source?: string | null
          discovery_video_id?: string | null
          discovery_video_title?: string | null
          facebook_url?: string | null
          id?: number
          instagram_follower_count?: number | null
          instagram_url?: string | null
          instagram_username?: string | null
          is_validated?: boolean | null
          last_crawled_at?: string | null
          music_sentiment_tags?: Json | null
          music_theme_analysis?: string | null
          name?: string
          spotify_avatar_url?: string | null
          spotify_biography?: string | null
          spotify_genres?: Json | null
          spotify_id?: string | null
          spotify_monthly_listeners?: number | null
          spotify_top_city?: string | null
          spotify_url?: string | null
          tiktok_follower_count?: number | null
          tiktok_likes_count?: number | null
          tiktok_url?: string | null
          tiktok_username?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
          youtube_channel_id?: string | null
          youtube_channel_url?: string | null
          youtube_subscriber_count?: number | null
        }
        Relationships: []
      }
      artist_discovery_log: {
        Row: {
          artist_id: number | null
          created_at: string | null
          data_extracted: Json | null
          discovery_step: string
          error_message: string | null
          id: number
          processing_time_ms: number | null
          status: string
        }
        Insert: {
          artist_id?: number | null
          created_at?: string | null
          data_extracted?: Json | null
          discovery_step: string
          error_message?: string | null
          id?: number
          processing_time_ms?: number | null
          status: string
        }
        Update: {
          artist_id?: number | null
          created_at?: string | null
          data_extracted?: Json | null
          discovery_step?: string
          error_message?: string | null
          id?: number
          processing_time_ms?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_discovery_log_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_lyrics_analysis: {
        Row: {
          analyzed_at: string | null
          artist_id: number | null
          id: number
          lyrics_snippet: string | null
          sentiment_score: number | null
          song_title: string
          themes: Json | null
        }
        Insert: {
          analyzed_at?: string | null
          artist_id?: number | null
          id?: number
          lyrics_snippet?: string | null
          sentiment_score?: number | null
          song_title: string
          themes?: Json | null
        }
        Update: {
          analyzed_at?: string | null
          artist_id?: number | null
          id?: number
          lyrics_snippet?: string | null
          sentiment_score?: number | null
          song_title?: string
          themes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_lyrics_analysis_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_spotify_tracks: {
        Row: {
          artist_id: number | null
          created_at: string | null
          id: number
          play_count: number | null
          popularity: number | null
          preview_url: string | null
          track_id: string | null
          track_name: string
          track_url: string | null
        }
        Insert: {
          artist_id?: number | null
          created_at?: string | null
          id?: number
          play_count?: number | null
          popularity?: number | null
          preview_url?: string | null
          track_id?: string | null
          track_name: string
          track_url?: string | null
        }
        Update: {
          artist_id?: number | null
          created_at?: string | null
          id?: number
          play_count?: number | null
          popularity?: number | null
          preview_url?: string | null
          track_id?: string | null
          track_name?: string
          track_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_spotify_tracks_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          avatar_url: string | null
          bio: string | null
          discovery_date: string | null
          discovery_score: number | null
          discovery_source: string | null
          discovery_video_id: string | null
          discovery_video_title: string | null
          email: string | null
          enrichment_score: number | null
          facebook_url: string | null
          follower_counts: Json | null
          genres: string[] | null
          id: string
          instagram_follower_count: number | null
          instagram_handle: string | null
          instagram_url: string | null
          is_validated: boolean | null
          last_crawled_at: string | null
          last_updated: string | null
          location: string | null
          lyrical_themes: string[] | null
          metadata: Json | null
          music_theme_analysis: string | null
          name: string
          social_links: Json | null
          spotify_biography: string | null
          spotify_followers: number | null
          spotify_genres: Json | null
          spotify_id: string | null
          spotify_monthly_listeners: number | null
          spotify_popularity_score: number | null
          spotify_top_city: string | null
          spotify_url: string | null
          status: string | null
          tiktok_follower_count: number | null
          tiktok_likes_count: number | null
          tiktok_url: string | null
          twitter_url: string | null
          website: string | null
          website_url: string | null
          youtube_channel_id: string | null
          youtube_channel_name: string | null
          youtube_channel_url: string | null
          youtube_subscriber_count: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          discovery_date?: string | null
          discovery_score?: number | null
          discovery_source?: string | null
          discovery_video_id?: string | null
          discovery_video_title?: string | null
          email?: string | null
          enrichment_score?: number | null
          facebook_url?: string | null
          follower_counts?: Json | null
          genres?: string[] | null
          id?: string
          instagram_follower_count?: number | null
          instagram_handle?: string | null
          instagram_url?: string | null
          is_validated?: boolean | null
          last_crawled_at?: string | null
          last_updated?: string | null
          location?: string | null
          lyrical_themes?: string[] | null
          metadata?: Json | null
          music_theme_analysis?: string | null
          name: string
          social_links?: Json | null
          spotify_biography?: string | null
          spotify_followers?: number | null
          spotify_genres?: Json | null
          spotify_id?: string | null
          spotify_monthly_listeners?: number | null
          spotify_popularity_score?: number | null
          spotify_top_city?: string | null
          spotify_url?: string | null
          status?: string | null
          tiktok_follower_count?: number | null
          tiktok_likes_count?: number | null
          tiktok_url?: string | null
          twitter_url?: string | null
          website?: string | null
          website_url?: string | null
          youtube_channel_id?: string | null
          youtube_channel_name?: string | null
          youtube_channel_url?: string | null
          youtube_subscriber_count?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          discovery_date?: string | null
          discovery_score?: number | null
          discovery_source?: string | null
          discovery_video_id?: string | null
          discovery_video_title?: string | null
          email?: string | null
          enrichment_score?: number | null
          facebook_url?: string | null
          follower_counts?: Json | null
          genres?: string[] | null
          id?: string
          instagram_follower_count?: number | null
          instagram_handle?: string | null
          instagram_url?: string | null
          is_validated?: boolean | null
          last_crawled_at?: string | null
          last_updated?: string | null
          location?: string | null
          lyrical_themes?: string[] | null
          metadata?: Json | null
          music_theme_analysis?: string | null
          name?: string
          social_links?: Json | null
          spotify_biography?: string | null
          spotify_followers?: number | null
          spotify_genres?: Json | null
          spotify_id?: string | null
          spotify_monthly_listeners?: number | null
          spotify_popularity_score?: number | null
          spotify_top_city?: string | null
          spotify_url?: string | null
          status?: string | null
          tiktok_follower_count?: number | null
          tiktok_likes_count?: number | null
          tiktok_url?: string | null
          twitter_url?: string | null
          website?: string | null
          website_url?: string | null
          youtube_channel_id?: string | null
          youtube_channel_name?: string | null
          youtube_channel_url?: string | null
          youtube_subscriber_count?: number | null
        }
        Relationships: []
      }
      code_examples: {
        Row: {
          chunk_number: number
          content: string
          created_at: string
          embedding: string | null
          id: number
          metadata: Json
          source_id: string
          summary: string
          url: string
        }
        Insert: {
          chunk_number: number
          content: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          source_id: string
          summary: string
          url: string
        }
        Update: {
          chunk_number?: number
          content?: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          source_id?: string
          summary?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_examples_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["source_id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          revision_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          revision_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          revision_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          id: number
          instagram_user_id: string
          message_content: string
          metadata: Json | null
          response_content: string
          timestamp: string | null
        }
        Insert: {
          id?: number
          instagram_user_id: string
          message_content: string
          metadata?: Json | null
          response_content: string
          timestamp?: string | null
        }
        Update: {
          id?: number
          instagram_user_id?: string
          message_content?: string
          metadata?: Json | null
          response_content?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      crawled_pages: {
        Row: {
          chunk_number: number
          content: string
          created_at: string
          embedding: string | null
          id: number
          metadata: Json
          source_id: string
          url: string
        }
        Insert: {
          chunk_number: number
          content: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          source_id: string
          url: string
        }
        Update: {
          chunk_number?: number
          content?: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          source_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "crawled_pages_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["source_id"]
          },
        ]
      }
      discovery_sessions: {
        Row: {
          artists_discovered: number | null
          completed_at: string | null
          error_logs: Json | null
          id: string
          metadata: Json | null
          started_at: string | null
          status: string | null
          videos_processed: number | null
        }
        Insert: {
          artists_discovered?: number | null
          completed_at?: string | null
          error_logs?: Json | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string | null
          videos_processed?: number | null
        }
        Update: {
          artists_discovered?: number | null
          completed_at?: string | null
          error_logs?: Json | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string | null
          videos_processed?: number | null
        }
        Relationships: []
      }
      document_metadata: {
        Row: {
          created_at: string | null
          id: string
          schema: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          schema?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          schema?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: []
      }
      document_rows: {
        Row: {
          dataset_id: string | null
          id: number
          row_data: Json | null
        }
        Insert: {
          dataset_id?: string | null
          id?: number
          row_data?: Json | null
        }
        Update: {
          dataset_id?: string | null
          id?: number
          row_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_rows_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "document_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          blurred_url: string
          created_at: string
          id: string
          original_url: string
          price: number
        }
        Insert: {
          blurred_url: string
          created_at?: string
          id?: string
          original_url: string
          price: number
        }
        Update: {
          blurred_url?: string
          created_at?: string
          id?: string
          original_url?: string
          price?: number
        }
        Relationships: []
      }
      goals: {
        Row: {
          ai_enhanced: boolean | null
          ai_suggestions: Json | null
          created_at: string
          description: string | null
          id: string
          pillar_id: string | null
          priority: number | null
          status: string
          target_date: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_enhanced?: boolean | null
          ai_suggestions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          pillar_id?: string | null
          priority?: number | null
          status?: string
          target_date?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_enhanced?: boolean | null
          ai_suggestions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          pillar_id?: string | null
          priority?: number | null
          status?: string
          target_date?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          habit_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date: string
          habit_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          habit_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string
          description: string | null
          frequency: string
          goal_id: string | null
          id: string
          status: string
          title: string
          tracking_period: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          frequency?: string
          goal_id?: string | null
          id?: string
          status?: string
          title: string
          tracking_period?: number | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          frequency?: string
          goal_id?: string | null
          id?: string
          status?: string
          title?: string
          tracking_period?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          Price: number | null
          url: string | null
        }
        Insert: {
          Price?: number | null
          url?: string | null
        }
        Update: {
          Price?: number | null
          url?: string | null
        }
        Relationships: []
      }
      journals: {
        Row: {
          content: string
          created_at: string
          date: string
          entry_type: string
          id: string
          insights: string | null
          mood_rating: number | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          date: string
          entry_type?: string
          id?: string
          insights?: string | null
          mood_rating?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          date?: string
          entry_type?: string
          id?: string
          insights?: string | null
          mood_rating?: number | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      KJV_Bible: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      knowledge_connections: {
        Row: {
          connection_type: string
          created_at: string
          id: string
          source_id: string
          target_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connection_type?: string
          created_at?: string
          id?: string
          source_id: string
          target_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connection_type?: string
          created_at?: string
          id?: string
          source_id?: string
          target_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_vault: {
        Row: {
          content: string
          created_at: string
          id: string
          linked_goal_id: string | null
          linked_project_id: string | null
          source: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          linked_goal_id?: string | null
          linked_project_id?: string | null
          source?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          linked_goal_id?: string | null
          linked_project_id?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_vault_linked_goal_id_fkey"
            columns: ["linked_goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_vault_linked_project_id_fkey"
            columns: ["linked_project_id"]
            isOneToOne: false
            referencedRelation: "los_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      los_projects: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          linked_goal_id: string | null
          pillar_id: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          linked_goal_id?: string | null
          pillar_id?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          linked_goal_id?: string | null
          pillar_id?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "los_projects_linked_goal_id_fkey"
            columns: ["linked_goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "los_projects_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      los_tasks: {
        Row: {
          created_at: string
          description: string
          due_date: string | null
          goal_id: string | null
          id: string
          priority: number | null
          project_id: string | null
          status: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          due_date?: string | null
          goal_id?: string | null
          id?: string
          priority?: number | null
          project_id?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          due_date?: string | null
          goal_id?: string | null
          id?: string
          priority?: number | null
          project_id?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "los_tasks_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "los_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "los_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      lyric_analyses: {
        Row: {
          analysis_metadata: Json | null
          artist_id: string | null
          created_at: string | null
          emotional_content: string[] | null
          id: string
          language: string | null
          lyrical_style: string | null
          sentiment_score: number | null
          subject_matter: string | null
          themes: string[] | null
          video_id: string | null
        }
        Insert: {
          analysis_metadata?: Json | null
          artist_id?: string | null
          created_at?: string | null
          emotional_content?: string[] | null
          id?: string
          language?: string | null
          lyrical_style?: string | null
          sentiment_score?: number | null
          subject_matter?: string | null
          themes?: string[] | null
          video_id?: string | null
        }
        Update: {
          analysis_metadata?: Json | null
          artist_id?: string | null
          created_at?: string | null
          emotional_content?: string[] | null
          id?: string
          language?: string | null
          lyrical_style?: string | null
          sentiment_score?: number | null
          subject_matter?: string | null
          themes?: string[] | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lyric_analyses_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lyric_analyses_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "enriched_artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lyric_analyses_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "high_value_artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lyric_analyses_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "recent_discoveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lyric_analyses_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      message_embeddings: {
        Row: {
          content: string
          conversation_id: number | null
          created_at: string | null
          embedding: string | null
          id: number
        }
        Insert: {
          content: string
          conversation_id?: number | null
          created_at?: string | null
          embedding?: string | null
          id?: number
        }
        Update: {
          content?: string
          conversation_id?: number | null
          created_at?: string | null
          embedding?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "message_embeddings_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          annual_enabled: boolean
          created_at: string
          daily_time: string
          id: string
          monthly_enabled: boolean
          notifications_enabled: boolean
          quarterly_enabled: boolean
          updated_at: string
          user_id: string
          weekly_enabled: boolean
        }
        Insert: {
          annual_enabled?: boolean
          created_at?: string
          daily_time?: string
          id?: string
          monthly_enabled?: boolean
          notifications_enabled?: boolean
          quarterly_enabled?: boolean
          updated_at?: string
          user_id: string
          weekly_enabled?: boolean
        }
        Update: {
          annual_enabled?: boolean
          created_at?: string
          daily_time?: string
          id?: string
          monthly_enabled?: boolean
          notifications_enabled?: boolean
          quarterly_enabled?: boolean
          updated_at?: string
          user_id?: string
          weekly_enabled?: boolean
        }
        Relationships: []
      }
      pillar_energy_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          pillar_id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          pillar_id: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          pillar_id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pillar_energy_logs_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pillar_energy_logs_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      pillars: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          artist: string
          audio_url: string
          created_at: string
          description: string
          featured: boolean | null
          genre: string
          id: string
          image_url: string
          title: string
          updated_at: string
        }
        Insert: {
          artist: string
          audio_url: string
          created_at?: string
          description: string
          featured?: boolean | null
          genre: string
          id?: string
          image_url: string
          title: string
          updated_at?: string
        }
        Update: {
          artist?: string
          audio_url?: string
          created_at?: string
          description?: string
          featured?: boolean | null
          genre?: string
          id?: string
          image_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          genre: string | null
          id: string
          name: string
          price: number | null
          reference_tracks: string[] | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          genre?: string | null
          id?: string
          name: string
          price?: number | null
          reference_tracks?: string[] | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          genre?: string | null
          id?: string
          name?: string
          price?: number | null
          reference_tracks?: string[] | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          amount: number
          artwork_id: string
          created_at: string
          id: string
          stripe_payment_id: string
          user_id: string
        }
        Insert: {
          amount: number
          artwork_id: string
          created_at?: string
          id?: string
          stripe_payment_id: string
          user_id: string
        }
        Update: {
          amount?: number
          artwork_id?: string
          created_at?: string
          id?: string
          stripe_payment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "gallery_images"
            referencedColumns: ["id"]
          },
        ]
      }
      review_templates: {
        Row: {
          created_at: string | null
          id: string
          prompts: Json | null
          review_type: string
          step_description: string | null
          step_number: number
          step_title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompts?: Json | null
          review_type: string
          step_description?: string | null
          step_number: number
          step_title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prompts?: Json | null
          review_type?: string
          step_description?: string | null
          step_number?: number
          step_title?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          date: string
          id: string
          is_completed: boolean | null
          linked_goals: string[] | null
          linked_journals: string[] | null
          reflections: string | null
          review_step: number | null
          review_type: string
          selected_pillars: string[] | null
          summary: string | null
          template_responses: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_completed?: boolean | null
          linked_goals?: string[] | null
          linked_journals?: string[] | null
          reflections?: string | null
          review_step?: number | null
          review_type: string
          selected_pillars?: string[] | null
          summary?: string | null
          template_responses?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_completed?: boolean | null
          linked_goals?: string[] | null
          linked_journals?: string[] | null
          reflections?: string | null
          review_step?: number | null
          review_type?: string
          selected_pillars?: string[] | null
          summary?: string | null
          template_responses?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      revisions: {
        Row: {
          assignee_id: string | null
          audio_urls: string[] | null
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          project_id: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          audio_urls?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          audio_urls?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revisions_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revisions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          created_at: string
          source_id: string
          summary: string | null
          total_word_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          source_id: string
          summary?: string | null
          total_word_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          source_id?: string
          summary?: string | null
          total_word_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          status: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          status: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          amount_paid: number
          artwork_id: string
          id: string
          purchase_date: string
          user_id: string
        }
        Insert: {
          amount_paid: number
          artwork_id: string
          id?: string
          purchase_date?: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          artwork_id?: string
          id?: string
          purchase_date?: string
          user_id?: string
        }
        Relationships: []
      }
      value_goal_connections: {
        Row: {
          created_at: string
          goal_id: string
          id: string
          value_id: string
        }
        Insert: {
          created_at?: string
          goal_id: string
          id?: string
          value_id: string
        }
        Update: {
          created_at?: string
          goal_id?: string
          id?: string
          value_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "value_goal_connections_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "value_goal_connections_value_id_fkey"
            columns: ["value_id"]
            isOneToOne: false
            referencedRelation: "values_vault"
            referencedColumns: ["id"]
          },
        ]
      }
      value_logs: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          updated_at: string | null
          user_id: string
          value_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          value_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          value_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "value_logs_value_id_fkey"
            columns: ["value_id"]
            isOneToOne: false
            referencedRelation: "values_vault"
            referencedColumns: ["id"]
          },
        ]
      }
      values_vault: {
        Row: {
          created_at: string
          description: string | null
          id: string
          importance_rating: number | null
          updated_at: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          importance_rating?: number | null
          updated_at?: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          importance_rating?: number | null
          updated_at?: string
          user_id?: string
          value?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          artist_id: string | null
          captions_available: boolean | null
          comment_count: number | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          like_count: number | null
          metadata: Json | null
          published_at: string | null
          tags: string[] | null
          title: string
          view_count: number | null
          youtube_video_id: string
        }
        Insert: {
          artist_id?: string | null
          captions_available?: boolean | null
          comment_count?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          like_count?: number | null
          metadata?: Json | null
          published_at?: string | null
          tags?: string[] | null
          title: string
          view_count?: number | null
          youtube_video_id: string
        }
        Update: {
          artist_id?: string | null
          captions_available?: boolean | null
          comment_count?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          like_count?: number | null
          metadata?: Json | null
          published_at?: string | null
          tags?: string[] | null
          title?: string
          view_count?: number | null
          youtube_video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "enriched_artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "high_value_artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "recent_discoveries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      enriched_artists: {
        Row: {
          analyzed_videos: number | null
          avg_sentiment: number | null
          bio: string | null
          discovery_date: string | null
          email: string | null
          enrichment_score: number | null
          follower_counts: Json | null
          genres: string[] | null
          id: string | null
          instagram_handle: string | null
          last_updated: string | null
          location: string | null
          metadata: Json | null
          name: string | null
          social_links: Json | null
          spotify_id: string | null
          status: string | null
          video_count: number | null
          website: string | null
          youtube_channel_id: string | null
          youtube_channel_name: string | null
        }
        Relationships: []
      }
      high_value_artists: {
        Row: {
          avatar_url: string | null
          discovery_date: string | null
          discovery_score: number | null
          id: string | null
          instagram_follower_count: number | null
          instagram_url: string | null
          is_validated: boolean | null
          name: string | null
          spotify_monthly_listeners: number | null
          spotify_url: string | null
          youtube_subscriber_count: number | null
        }
        Insert: {
          avatar_url?: string | null
          discovery_date?: string | null
          discovery_score?: number | null
          id?: string | null
          instagram_follower_count?: number | null
          instagram_url?: string | null
          is_validated?: boolean | null
          name?: string | null
          spotify_monthly_listeners?: number | null
          spotify_url?: string | null
          youtube_subscriber_count?: number | null
        }
        Update: {
          avatar_url?: string | null
          discovery_date?: string | null
          discovery_score?: number | null
          id?: string | null
          instagram_follower_count?: number | null
          instagram_url?: string | null
          is_validated?: boolean | null
          name?: string | null
          spotify_monthly_listeners?: number | null
          spotify_url?: string | null
          youtube_subscriber_count?: number | null
        }
        Relationships: []
      }
      recent_discoveries: {
        Row: {
          avatar_url: string | null
          discovery_date: string | null
          discovery_score: number | null
          discovery_video_title: string | null
          id: string | null
          is_validated: boolean | null
          name: string | null
          spotify_monthly_listeners: number | null
        }
        Insert: {
          avatar_url?: string | null
          discovery_date?: string | null
          discovery_score?: number | null
          discovery_video_title?: string | null
          id?: string | null
          is_validated?: boolean | null
          name?: string | null
          spotify_monthly_listeners?: number | null
        }
        Update: {
          avatar_url?: string | null
          discovery_date?: string | null
          discovery_score?: number | null
          discovery_video_title?: string | null
          id?: string | null
          is_validated?: boolean | null
          name?: string | null
          spotify_monthly_listeners?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_api_usage_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          api_name: string
          total_requests: number
          quota_limit: number
          usage_percentage: number
        }[]
      }
      get_genre_distribution: {
        Args: Record<PropertyKey, never>
        Returns: {
          genre: string
          count: number
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_code_examples: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
          source_filter?: string
        }
        Returns: {
          id: number
          url: string
          chunk_number: number
          content: string
          summary: string
          metadata: Json
          source_id: string
          similarity: number
        }[]
      }
      match_crawled_pages: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
          source_filter?: string
        }
        Returns: {
          id: number
          url: string
          chunk_number: number
          content: string
          metadata: Json
          source_id: string
          similarity: number
        }[]
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      update_enrichment_score: {
        Args: { artist_uuid: string }
        Returns: undefined
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
