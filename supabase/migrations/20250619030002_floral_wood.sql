/*
  # Seed Initial Data

  1. Categories
    - Insert initial music categories
  
  2. Songs
    - Insert sample songs for testing
  
  3. Demo Users
    - Create demo users in auth.users
*/

-- Insert categories
INSERT INTO categories (id, name, cover_art_url) VALUES
  ('1', 'Hip Hop', 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg'),
  ('2', 'Chill', 'https://images.pexels.com/photos/1068989/pexels-photo-1068989.jpeg'),
  ('3', 'Electronic', 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg'),
  ('4', 'Jazz', 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg'),
  ('5', 'Ambient', 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg')
ON CONFLICT (name) DO NOTHING;

-- Insert sample songs
INSERT INTO songs (id, title, artist, album, duration, cover_art_url, audio_url, genre, release_year) VALUES
  ('1', 'Summer Breeze', 'Ocean Waves', 'Beach Vibes', 60, 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', 'Chill', 2022),
  ('2', 'City Lights', 'Urban Echo', 'Downtown', 45, 'https://images.pexels.com/photos/2682543/pexels-photo-2682543.jpeg', 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav', 'Electronic', 2021),
  ('3', 'Mountain High', 'Nature Sounds', 'Wilderness', 75, 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg', 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav', 'Ambient', 2023),
  ('4', 'Midnight Drive', 'Dark Roads', 'Nightfall', 90, 'https://images.pexels.com/photos/4835419/pexels-photo-4835419.jpeg', 'https://www.soundjay.com/misc/sounds/typewriter-key-1.wav', 'Electronic', 2022),
  ('5', 'Coffee Break', 'Café Lounge', 'Morning Blend', 55, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg', 'https://www.soundjay.com/misc/sounds/clock-chimes-1.wav', 'Jazz', 2021),
  ('6', 'Urban Jungle', 'City Beats', 'Concrete Dreams', 80, 'https://images.pexels.com/photos/1123582/pexels-photo-1123582.jpeg', 'https://www.soundjay.com/misc/sounds/ding-idea-40142.wav', 'Hip Hop', 2023),
  ('7', 'Ocean Waves', 'Serenity', 'Natural Sounds', 120, 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg', 'https://www.soundjay.com/misc/sounds/water-drop-1.wav', 'Ambient', 2023),
  ('8', 'Electric Dreams', 'Synth Master', 'Digital Age', 95, 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', 'https://www.soundjay.com/misc/sounds/beep-07a.wav', 'Electronic', 2022),
  ('9', 'Forest Walk', 'Nature Collective', 'Earth Sounds', 110, 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg', 'https://www.soundjay.com/misc/sounds/wind-chimes-1.wav', 'Ambient', 2023),
  ('10', 'Jazz Café', 'Smooth Operators', 'Late Night Sessions', 85, 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg', 'https://www.soundjay.com/misc/sounds/piano-key-1.wav', 'Jazz', 2021),
  ('11', 'Neon Nights', 'Cyber Punk', 'Future Bass', 70, 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg', 'https://www.soundjay.com/misc/sounds/laser-zap-1.wav', 'Electronic', 2023),
  ('12', 'Sunrise Meditation', 'Zen Masters', 'Inner Peace', 180, 'https://images.pexels.com/photos/1068989/pexels-photo-1068989.jpeg', 'https://www.soundjay.com/misc/sounds/singing-bowl-1.wav', 'Ambient', 2022),
  ('13', 'Street Rhythm', 'Urban Poets', 'City Stories', 65, 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg', 'https://www.soundjay.com/misc/sounds/drum-beat-1.wav', 'Hip Hop', 2023),
  ('14', 'Vintage Vinyl', 'Retro Collective', 'Throwback Hits', 75, 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg', 'https://www.soundjay.com/misc/sounds/record-scratch-1.wav', 'Jazz', 2020),
  ('15', 'Digital Pulse', 'Tech Noir', 'Binary Dreams', 88, 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', 'https://www.soundjay.com/misc/sounds/computer-beep-1.wav', 'Electronic', 2023)
ON CONFLICT (id) DO NOTHING;