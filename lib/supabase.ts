import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      songs: {
        Row: {
          id: string
          title: string
          artist: string
          album: string | null
          duration: number
          cover_art_url: string | null
          audio_url: string
          genre: string | null
          release_year: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          artist: string
          album?: string | null
          duration: number
          cover_art_url?: string | null
          audio_url: string
          genre?: string | null
          release_year?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist?: string
          album?: string | null
          duration?: number
          cover_art_url?: string | null
          audio_url?: string
          genre?: string | null
          release_year?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          cover_art_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          cover_art_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          cover_art_url?: string | null
          created_at?: string
        }
      }
      playlists: {
        Row: {
          id: string
          name: string
          description: string | null
          cover_art_url: string | null
          created_by: string
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          cover_art_url?: string | null
          created_by: string
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          cover_art_url?: string | null
          created_by?: string
          is_public?: boolean
          created_at?: string
        }
      }
      playlist_songs: {
        Row: {
          playlist_id: string
          song_id: string
          position: number
          added_at: string
        }
        Insert: {
          playlist_id: string
          song_id: string
          position: number
          added_at?: string
        }
        Update: {
          playlist_id?: string
          song_id?: string
          position?: number
          added_at?: string
        }
      }
    }
  }
}