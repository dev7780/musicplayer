/*
  # Seed Initial Data

  1. Categories
    - Insert initial music categories/genres
  
  2. Songs
    - Insert sample songs for testing with real audio URLs
  
  3. Demo Users Setup
    - Instructions for creating demo users
*/

-- Insert categories
INSERT INTO categories (id, name, cover_art_url, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Hip Hop', 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg', 'Urban beats and rap music'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Electronic', 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', 'Electronic dance music and synth'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Jazz', 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg', 'Smooth jazz and instrumental'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Ambient', 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg', 'Atmospheric and ambient sounds'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Chill', 'https://images.pexels.com/photos/1068989/pexels-photo-1068989.jpeg', 'Relaxing and chill music'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Rock', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 'Rock and alternative music'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Pop', 'https://images.pexels.com/photos/2682543/pexels-photo-2682543.jpeg', 'Popular and mainstream music'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Classical', 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg', 'Classical and orchestral music'),
  ('550e8400-e29b-41d4-a716-446655440009', 'R&B', 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg', 'Rhythm and blues music'),
  ('550e8400-e29b-41d4-a716-446655440010', 'Indie', 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg', 'Independent and alternative music')
ON CONFLICT (name) DO NOTHING;

-- Insert sample songs with working audio URLs
INSERT INTO songs (id, title, artist, album, duration, cover_art_url, audio_url, genre, release_year) VALUES
  -- Hip Hop Songs
  ('550e8400-e29b-41d4-a716-446655440101', 'Urban Jungle', 'City Beats', 'Concrete Dreams', 240, 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg', 'https://www.soundjay.com/misc/sounds/drum-beat-1.wav', 'Hip Hop', 2023),
  ('550e8400-e29b-41d4-a716-446655440102', 'Street Rhythm', 'Urban Poets', 'City Stories', 195, 'https://images.pexels.com/photos/1123582/pexels-photo-1123582.jpeg', 'https://www.soundjay.com/misc/sounds/ding-idea-40142.wav', 'Hip Hop', 2023),
  ('550e8400-e29b-41d4-a716-446655440103', 'Downtown Flow', 'Metro Collective', 'Street Chronicles', 218, 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg', 'https://www.soundjay.com/misc/sounds/typewriter-key-1.wav', 'Hip Hop', 2022),
  
  -- Electronic Songs
  ('550e8400-e29b-41d4-a716-446655440201', 'City Lights', 'Urban Echo', 'Downtown', 195, 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav', 'Electronic', 2021),
  ('550e8400-e29b-41d4-a716-446655440202', 'Electric Dreams', 'Synth Master', 'Digital Age', 285, 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', 'https://www.soundjay.com/misc/sounds/beep-07a.wav', 'Electronic', 2022),
  ('550e8400-e29b-41d4-a716-446655440203', 'Neon Nights', 'Cyber Punk', 'Future Bass', 210, 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg', 'https://www.soundjay.com/misc/sounds/laser-zap-1.wav', 'Electronic', 2023),
  ('550e8400-e29b-41d4-a716-446655440204', 'Digital Pulse', 'Tech Noir', 'Binary Dreams', 264, 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', 'https://www.soundjay.com/misc/sounds/computer-beep-1.wav', 'Electronic', 2023),
  ('550e8400-e29b-41d4-a716-446655440205', 'Midnight Drive', 'Dark Roads', 'Nightfall', 210, 'https://images.pexels.com/photos/4835419/pexels-photo-4835419.jpeg', 'https://www.soundjay.com/misc/sounds/clock-chimes-1.wav', 'Electronic', 2022),
  
  -- Jazz Songs
  ('550e8400-e29b-41d4-a716-446655440301', 'Coffee Break', 'Café Lounge', 'Morning Blend', 165, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg', 'https://www.soundjay.com/misc/sounds/piano-key-1.wav', 'Jazz', 2021),
  ('550e8400-e29b-41d4-a716-446655440302', 'Jazz Café', 'Smooth Operators', 'Late Night Sessions', 255, 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg', 'https://www.soundjay.com/misc/sounds/record-scratch-1.wav', 'Jazz', 2021),
  ('550e8400-e29b-41d4-a716-446655440303', 'Vintage Vinyl', 'Retro Collective', 'Throwback Hits', 225, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg', 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav', 'Jazz', 2020),
  ('550e8400-e29b-41d4-a716-446655440304', 'Midnight Jazz', 'Blue Note Quartet', 'After Hours', 312, 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg', 'https://www.soundjay.com/misc/sounds/singing-bowl-1.wav', 'Jazz', 2022),
  
  -- Ambient Songs
  ('550e8400-e29b-41d4-a716-446655440401', 'Mountain High', 'Nature Sounds', 'Wilderness', 225, 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg', 'https://www.soundjay.com/misc/sounds/wind-chimes-1.wav', 'Ambient', 2023),
  ('550e8400-e29b-41d4-a716-446655440402', 'Ocean Waves', 'Serenity', 'Natural Sounds', 300, 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg', 'https://www.soundjay.com/misc/sounds/water-drop-1.wav', 'Ambient', 2023),
  ('550e8400-e29b-41d4-a716-446655440403', 'Forest Walk', 'Nature Collective', 'Earth Sounds', 330, 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg', 'https://www.soundjay.com/misc/sounds/singing-bowl-1.wav', 'Ambient', 2023),
  ('550e8400-e29b-41d4-a716-446655440404', 'Sunrise Meditation', 'Zen Masters', 'Inner Peace', 420, 'https://images.pexels.com/photos/1068989/pexels-photo-1068989.jpeg', 'https://www.soundjay.com/misc/sounds/computer-beep-1.wav', 'Ambient', 2022),
  
  -- Chill Songs
  ('550e8400-e29b-41d4-a716-446655440501', 'Summer Breeze', 'Ocean Waves', 'Beach Vibes', 180, 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Chill', 2022),
  ('550e8400-e29b-41d4-a716-446655440502', 'Lazy Sunday', 'Chill Collective', 'Weekend Vibes', 198, 'https://images.pexels.com/photos/1068989/pexels-photo-1068989.jpeg', 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav', 'Chill', 2023),
  ('550e8400-e29b-41d4-a716-446655440503', 'Sunset Dreams', 'Mellow Moods', 'Golden Hour', 234, 'https://images.pexels.com/photos/1068989/pexels-photo-1068989.jpeg', 'https://www.soundjay.com/misc/sounds/wind-chimes-1.wav', 'Chill', 2022),
  
  -- Rock Songs
  ('550e8400-e29b-41d4-a716-446655440601', 'Acoustic Dreams', 'Folk Stories', 'Unplugged', 198, 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Rock', 2022),
  ('550e8400-e29b-41d4-a716-446655440602', 'Thunder Road', 'Electric Storm', 'Lightning Strikes', 276, 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 'https://www.soundjay.com/misc/sounds/drum-beat-1.wav', 'Rock', 2023),
  ('550e8400-e29b-41d4-a716-446655440603', 'Mountain Echo', 'Valley Sounds', 'High Peaks', 245, 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 'https://www.soundjay.com/misc/sounds/typewriter-key-1.wav', 'Rock', 2021),
  
  -- Pop Songs
  ('550e8400-e29b-41d4-a716-446655440701', 'Pop Sensation', 'Chart Toppers', 'Hit Singles', 180, 'https://images.pexels.com/photos/2682543/pexels-photo-2682543.jpeg', 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav', 'Pop', 2023),
  ('550e8400-e29b-41d4-a716-446655440702', 'Radio Waves', 'Mainstream', 'Top 40', 192, 'https://images.pexels.com/photos/2682543/pexels-photo-2682543.jpeg', 'https://www.soundjay.com/misc/sounds/ding-idea-40142.wav', 'Pop', 2023),
  ('550e8400-e29b-41d4-a716-446655440703', 'Dance Floor', 'Party Mix', 'Club Hits', 205, 'https://images.pexels.com/photos/2682543/pexels-photo-2682543.jpeg', 'https://www.soundjay.com/misc/sounds/beep-07a.wav', 'Pop', 2022),
  
  -- Classical Songs
  ('550e8400-e29b-41d4-a716-446655440801', 'Symphony No. 1', 'Classical Ensemble', 'Orchestral Works', 720, 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg', 'https://www.soundjay.com/misc/sounds/wind-chimes-1.wav', 'Classical', 2021),
  ('550e8400-e29b-41d4-a716-446655440802', 'Piano Concerto', 'Grand Orchestra', 'Masterpieces', 654, 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg', 'https://www.soundjay.com/misc/sounds/piano-key-1.wav', 'Classical', 2020),
  ('550e8400-e29b-41d4-a716-446655440803', 'String Quartet', 'Chamber Music', 'Intimate Performances', 432, 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg', 'https://www.soundjay.com/misc/sounds/singing-bowl-1.wav', 'Classical', 2022),
  
  -- R&B Songs
  ('550e8400-e29b-41d4-a716-446655440901', 'Smooth Groove', 'Soul Sisters', 'Rhythm & Soul', 234, 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg', 'https://www.soundjay.com/misc/sounds/record-scratch-1.wav', 'R&B', 2023),
  ('550e8400-e29b-41d4-a716-446655440902', 'Midnight Soul', 'Urban Groove', 'Late Night Vibes', 267, 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg', 'https://www.soundjay.com/misc/sounds/piano-key-1.wav', 'R&B', 2022),
  ('550e8400-e29b-41d4-a716-446655440903', 'Velvet Voice', 'Smooth Operators', 'Silky Sounds', 198, 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg', 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav', 'R&B', 2023),
  
  -- Indie Songs
  ('550e8400-e29b-41d4-a716-446655441001', 'Coffee Shop', 'Indie Collective', 'Underground', 187, 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg', 'https://www.soundjay.com/misc/sounds/typewriter-key-1.wav', 'Indie', 2023),
  ('550e8400-e29b-41d4-a716-446655441002', 'Vinyl Dreams', 'Alternative Sound', 'Retro Future', 223, 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg', 'https://www.soundjay.com/misc/sounds/record-scratch-1.wav', 'Indie', 2022),
  ('550e8400-e29b-41d4-a716-446655441003', 'Bedroom Pop', 'Lo-Fi Dreams', 'Intimate Sessions', 156, 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Indie', 2023)
ON CONFLICT (id) DO NOTHING;

-- Create some sample playlists (these will be created by users after they sign up)
-- Note: You'll need actual user IDs from auth.users to create playlists
-- This is just a template for reference

/*
Example playlists to create after users sign up:

1. "Chill Vibes" - Mix of Chill, Ambient, and Jazz songs
2. "Workout Mix" - Electronic, Hip Hop, and Pop songs
3. "Study Focus" - Ambient, Classical, and Chill songs
4. "Party Time" - Pop, Electronic, and Hip Hop songs
5. "Jazz Collection" - All Jazz songs
6. "Electronic Beats" - All Electronic songs
7. "Indie Discoveries" - Indie and Alternative songs
8. "Classical Masterpieces" - Classical and orchestral pieces
*/

-- Instructions for creating demo users:
-- 1. Users must sign up through the app's authentication system
-- 2. After signup, you can make them admin by running:
--    UPDATE user_profiles SET is_admin = true WHERE user_id = 'USER_UUID_HERE';
-- 3. Demo credentials can be created with these emails:
--    - user@example.com (regular user)
--    - admin@example.com (admin user)
--    - Both with password: password123

-- Add some indexes for better performance
CREATE INDEX IF NOT EXISTS idx_songs_genre_year ON songs(genre, release_year);
CREATE INDEX IF NOT EXISTS idx_songs_artist_title ON songs(artist, title);
CREATE INDEX IF NOT EXISTS idx_categories_name_lower ON categories(LOWER(name));