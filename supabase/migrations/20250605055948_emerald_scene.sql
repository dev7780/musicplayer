/*
  # Initial Schema Setup for Music App

  1. New Tables
    - songs
      - id (uuid, primary key)
      - title (text)
      - artist (text)
      - album (text)
      - duration (integer)
      - cover_art_url (text)
      - audio_url (text)
      - genre (text)
      - release_year (integer)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - categories
      - id (uuid, primary key)
      - name (text)
      - cover_art_url (text)
      - created_at (timestamp)
    
    - playlists
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - cover_art_url (text)
      - created_by (uuid, references auth.users)
      - is_public (boolean)
      - created_at (timestamp)
    
    - playlist_songs
      - playlist_id (uuid, references playlists)
      - song_id (uuid, references songs)
      - position (integer)
      - added_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin-specific policies
*/

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  album text,
  duration integer NOT NULL,
  cover_art_url text,
  audio_url text NOT NULL,
  genre text,
  release_year integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  cover_art_url text,
  created_at timestamptz DEFAULT now()
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cover_art_url text,
  created_by uuid REFERENCES auth.users NOT NULL,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create playlist_songs junction table
CREATE TABLE IF NOT EXISTS playlist_songs (
  playlist_id uuid REFERENCES playlists ON DELETE CASCADE,
  song_id uuid REFERENCES songs ON DELETE CASCADE,
  position integer NOT NULL,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (playlist_id, song_id)
);

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- Create policies for songs
CREATE POLICY "Public songs are viewable by everyone" 
ON songs FOR SELECT USING (true);

CREATE POLICY "Admins can insert songs" 
ON songs FOR INSERT TO authenticated 
USING (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
));

CREATE POLICY "Admins can update songs" 
ON songs FOR UPDATE TO authenticated 
USING (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
));

CREATE POLICY "Admins can delete songs" 
ON songs FOR DELETE TO authenticated 
USING (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
));

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone" 
ON categories FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories" 
ON categories FOR INSERT TO authenticated 
USING (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
));

CREATE POLICY "Admins can update categories" 
ON categories FOR UPDATE TO authenticated 
USING (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
));

CREATE POLICY "Admins can delete categories" 
ON categories FOR DELETE TO authenticated 
USING (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.uid() = auth.users.id AND auth.users.raw_user_meta_data->>'isAdmin' = 'true'
));

-- Create policies for playlists
CREATE POLICY "Users can view public playlists" 
ON playlists FOR SELECT 
USING (is_public OR auth.uid() = created_by);

CREATE POLICY "Users can create their own playlists" 
ON playlists FOR INSERT TO authenticated 
USING (auth.uid() = created_by);

CREATE POLICY "Users can update their own playlists" 
ON playlists FOR UPDATE TO authenticated 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own playlists" 
ON playlists FOR DELETE TO authenticated 
USING (auth.uid() = created_by);

-- Create policies for playlist_songs
CREATE POLICY "Users can view songs in viewable playlists" 
ON playlist_songs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM playlists 
    WHERE playlists.id = playlist_id 
    AND (playlists.is_public OR playlists.created_by = auth.uid())
  )
);

CREATE POLICY "Users can modify songs in their playlists" 
ON playlist_songs FOR ALL TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM playlists 
    WHERE playlists.id = playlist_id 
    AND playlists.created_by = auth.uid()
  )
);