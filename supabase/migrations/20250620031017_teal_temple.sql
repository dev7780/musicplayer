/*
  # Seed Production Data

  1. Categories
    - Insert music categories/genres
  
  2. Sample Songs
    - Insert sample songs for demonstration
  
  3. Admin User Setup
    - Instructions for creating admin users
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
  ('550e8400-e29b-41d4-a716-446655440008', 'Classical', 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg', 'Classical and orchestral music')
ON CONFLICT (name) DO NOTHING;

-- Insert sample songs with proper audio URLs
INSERT INTO songs (id, title, artist, album, duration, cover_art_url, audio_url, genre, release_year) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'Summer Breeze', 'Ocean Waves', 'Beach Vibes', 180, 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Chill', 2022),
  ('550e8400-e29b-41d4-a716-446655440102', 'City Lights', 'Urban Echo', 'Downtown', 195, 'https://images.pexels.com/photos/2682543/pexels-photo-2682543.jpeg', 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav', 'Electronic', 2021),
  ('550e8400-e29b-41d4-a716-446655440103', 'Mountain High', 'Nature Sounds', 'Wilderness', 225, 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg', 'https://www.soundjay.com/misc/sounds/wind-chimes-1.wav', 'Ambient', 2023),
  ('550e8400-e29b-41d4-a716-446655440104', 'Midnight Drive', 'Dark Roads', 'Nightfall', 210, 'https://images.pexels.com/photos/4835419/pexels-photo-4835419.jpeg', 'https://www.soundjay.com/misc/sounds/clock-chimes-1.wav', 'Electronic', 2022),
  ('550e8400-e29b-41d4-a716-446655440105', 'Coffee Break', 'Café Lounge', 'Morning Blend', 165, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg', 'https://www.soundjay.com/misc/sounds/piano-key-1.wav', 'Jazz', 2021),
  ('550e8400-e29b-41d4-a716-446655440106', 'Urban Jungle', 'City Beats', 'Concrete Dreams', 240, 'https://images.pexels.com/photos/1123582/pexels-photo-1123582.jpeg', 'https://www.soundjay.com/misc/sounds/drum-beat-1.wav', 'Hip Hop', 2023),
  ('550e8400-e29b-41d4-a716-446655440107', 'Ocean Waves', 'Serenity', 'Natural Sounds', 300, 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg', 'https://www.soundjay.com/misc/sounds/water-drop-1.wav', 'Ambient', 2023),
  ('550e8400-e29b-41d4-a716-446655440108', 'Electric Dreams', 'Synth Master', 'Digital Age', 285, 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', 'https://www.soundjay.com/misc/sounds/beep-07a.wav', 'Electronic', 2022),
  ('550e8400-e29b-41d4-a716-446655440109', 'Forest Walk', 'Nature Collective', 'Earth Sounds', 330, 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg', 'https://www.soundjay.com/misc/sounds/singing-bowl-1.wav', 'Ambient', 2023),
  ('550e8400-e29b-41d4-a716-446655440110', 'Jazz Café', 'Smooth Operators', 'Late Night Sessions', 255, 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg', 'https://www.soundjay.com/misc/sounds/record-scratch-1.wav', 'Jazz', 2021),
  ('550e8400-e29b-41d4-a716-446655440111', 'Neon Nights', 'Cyber Punk', 'Future Bass', 210, 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg', 'https://www.soundjay.com/misc/sounds/laser-zap-1.wav', 'Electronic', 2023),
  ('550e8400-e29b-41d4-a716-446655440112', 'Sunrise Meditation', 'Zen Masters', 'Inner Peace', 420, 'https://images.pexels.com/photos/1068989/pexels-photo-1068989.jpeg', 'https://www.soundjay.com/misc/sounds/computer-beep-1.wav', 'Ambient', 2022),
  ('550e8400-e29b-41d4-a716-446655440113', 'Street Rhythm', 'Urban Poets', 'City Stories', 195, 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg', 'https://www.soundjay.com/misc/sounds/ding-idea-40142.wav', 'Hip Hop', 2023),
  ('550e8400-e29b-41d4-a716-446655440114', 'Vintage Vinyl', 'Retro Collective', 'Throwback Hits', 225, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg', 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav', 'Jazz', 2020),
  ('550e8400-e29b-41d4-a716-446655440115', 'Digital Pulse', 'Tech Noir', 'Binary Dreams', 264, 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', 'https://www.soundjay.com/misc/sounds/typewriter-key-1.wav', 'Electronic', 2023),
  ('550e8400-e29b-41d4-a716-446655440116', 'Acoustic Dreams', 'Folk Stories', 'Unplugged', 198, 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Rock', 2022),
  ('550e8400-e29b-41d4-a716-446655440117', 'Pop Sensation', 'Chart Toppers', 'Hit Singles', 180, 'https://images.pexels.com/photos/2682543/pexels-photo-2682543.jpeg', 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav', 'Pop', 2023),
  ('550e8400-e29b-41d4-a716-446655440118', 'Symphony No. 1', 'Classical Ensemble', 'Orchestral Works', 720, 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg', 'https://www.soundjay.com/misc/sounds/wind-chimes-1.wav', 'Classical', 2021),
  ('550e8400-e29b-41d4-a716-446655440119', 'Midnight Jazz', 'Blue Note Quartet', 'After Hours', 312, 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg', 'https://www.soundjay.com/misc/sounds/piano-key-1.wav', 'Jazz', 2022),
  ('550e8400-e29b-41d4-a716-446655440120', 'Bass Drop', 'Electronic Fusion', 'Club Nights', 240, 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', 'https://www.soundjay.com/misc/sounds/beep-07a.wav', 'Electronic', 2023)
ON CONFLICT (id) DO NOTHING;

-- Note: To create admin users, you'll need to:
-- 1. Sign up users through your app
-- 2. Update their profile to set is_admin = true
-- 3. Or use the Supabase dashboard to manually update user_profiles table

-- Example SQL to make a user admin (run after user signs up):
-- UPDATE user_profiles SET is_admin = true WHERE user_id = 'USER_UUID_HERE';