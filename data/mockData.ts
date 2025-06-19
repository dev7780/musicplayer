import { User, Song, Playlist, Category } from '@/types/app';
import { supabase } from '@/lib/supabase';

// Keep mock users for demo purposes (these will be created in Supabase Auth)
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Regular User',
    isAdmin: false,
    profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    isAdmin: true,
    profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
];

// Keep mock data for initial seeding and fallback
export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Summer Breeze',
    artist: 'Ocean Waves',
    album: 'Beach Vibes',
    duration: 60,
    coverArt: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    genre: 'Chill',
    releaseYear: 2022,
    liked: true,
  },
  {
    id: '2',
    title: 'City Lights',
    artist: 'Urban Echo',
    album: 'Downtown',
    duration: 45,
    coverArt: 'https://images.pexels.com/photos/2682543/pexels-photo-2682543.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav',
    genre: 'Electronic',
    releaseYear: 2021,
  },
  {
    id: '3',
    title: 'Mountain High',
    artist: 'Nature Sounds',
    album: 'Wilderness',
    duration: 75,
    coverArt: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav',
    genre: 'Ambient',
    releaseYear: 2023,
  },
  {
    id: '4',
    title: 'Midnight Drive',
    artist: 'Dark Roads',
    album: 'Nightfall',
    duration: 90,
    coverArt: 'https://images.pexels.com/photos/4835419/pexels-photo-4835419.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/typewriter-key-1.wav',
    genre: 'Electronic',
    releaseYear: 2022,
    liked: true,
  },
  {
    id: '5',
    title: 'Coffee Break',
    artist: 'Café Lounge',
    album: 'Morning Blend',
    duration: 55,
    coverArt: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/clock-chimes-1.wav',
    genre: 'Jazz',
    releaseYear: 2021,
  },
  {
    id: '6',
    title: 'Urban Jungle',
    artist: 'City Beats',
    album: 'Concrete Dreams',
    duration: 80,
    coverArt: 'https://images.pexels.com/photos/1123582/pexels-photo-1123582.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/ding-idea-40142.wav',
    genre: 'Hip Hop',
    releaseYear: 2023,
  },
  {
    id: '7',
    title: 'Ocean Waves',
    artist: 'Serenity',
    album: 'Natural Sounds',
    duration: 120,
    coverArt: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/water-drop-1.wav',
    genre: 'Ambient',
    releaseYear: 2023,
    liked: true,
  },
  {
    id: '8',
    title: 'Electric Dreams',
    artist: 'Synth Master',
    album: 'Digital Age',
    duration: 95,
    coverArt: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/beep-07a.wav',
    genre: 'Electronic',
    releaseYear: 2022,
  },
  {
    id: '9',
    title: 'Forest Walk',
    artist: 'Nature Collective',
    album: 'Earth Sounds',
    duration: 110,
    coverArt: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/wind-chimes-1.wav',
    genre: 'Ambient',
    releaseYear: 2023,
  },
  {
    id: '10',
    title: 'Jazz Café',
    artist: 'Smooth Operators',
    album: 'Late Night Sessions',
    duration: 85,
    coverArt: 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/piano-key-1.wav',
    genre: 'Jazz',
    releaseYear: 2021,
    liked: true,
  },
  {
    id: '11',
    title: 'Neon Nights',
    artist: 'Cyber Punk',
    album: 'Future Bass',
    duration: 70,
    coverArt: 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/laser-zap-1.wav',
    genre: 'Electronic',
    releaseYear: 2023,
  },
  {
    id: '12',
    title: 'Sunrise Meditation',
    artist: 'Zen Masters',
    album: 'Inner Peace',
    duration: 180,
    coverArt: 'https://images.pexels.com/photos/1068989/pexels-photo-1068989.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/singing-bowl-1.wav',
    genre: 'Ambient',
    releaseYear: 2022,
  },
  {
    id: '13',
    title: 'Street Rhythm',
    artist: 'Urban Poets',
    album: 'City Stories',
    duration: 65,
    coverArt: 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/drum-beat-1.wav',
    genre: 'Hip Hop',
    releaseYear: 2023,
    liked: true,
  },
  {
    id: '14',
    title: 'Vintage Vinyl',
    artist: 'Retro Collective',
    album: 'Throwback Hits',
    duration: 75,
    coverArt: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/record-scratch-1.wav',
    genre: 'Jazz',
    releaseYear: 2020,
  },
  {
    id: '15',
    title: 'Digital Pulse',
    artist: 'Tech Noir',
    album: 'Binary Dreams',
    duration: 88,
    coverArt: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/computer-beep-1.wav',
    genre: 'Electronic',
    releaseYear: 2023,
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Chill Vibes',
    description: 'Perfect for relaxing moments',
    coverArt: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg',
    createdBy: '1',
    songs: ['1', '3', '5', '7', '9', '12'],
    isPublic: true,
  },
  {
    id: '2',
    name: 'Workout Mix',
    description: 'High energy tracks to keep you motivated',
    coverArt: 'https://images.pexels.com/photos/28080/pexels-photo.jpg',
    createdBy: '1',
    songs: ['2', '4', '6', '8', '11', '15'],
    isPublic: true,
  },
  {
    id: '3',
    name: 'Focus Time',
    description: 'Concentrate better with these tracks',
    coverArt: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg',
    createdBy: '2',
    songs: ['3', '5', '7', '12'],
    isPublic: true,
  },
  {
    id: '4',
    name: 'Jazz Collection',
    description: 'Smooth jazz for any occasion',
    coverArt: 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg',
    createdBy: '2',
    songs: ['5', '10', '14'],
    isPublic: true,
  },
  {
    id: '5',
    name: 'Electronic Beats',
    description: 'The best electronic music',
    coverArt: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    createdBy: '1',
    songs: ['2', '4', '8', '11', '15'],
    isPublic: true,
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Hip Hop',
    coverArt: 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg',
  },
  {
    id: '2',
    name: 'Chill',
    coverArt: 'https://images.pexels.com/photos/1068989/pexels-photo-1068989.jpeg',
  },
  {
    id: '3',
    name: 'Electronic',
    coverArt: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
  },
  {
    id: '4',
    name: 'Jazz',
    coverArt: 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg',
  },
  {
    id: '5',
    name: 'Ambient',
    coverArt: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg',
  },
];

// API helper functions that now use Supabase
export const getPlaylistSongs = async (playlistId: string): Promise<Song[]> => {
  try {
    const { data: playlist, error } = await supabase
      .from('playlists')
      .select(`
        playlist_songs (
          song_id,
          position,
          songs (*)
        )
      `)
      .eq('id', playlistId)
      .single();

    if (error || !playlist) {
      console.error('Error fetching playlist songs:', error);
      // Fallback to mock data
      const mockPlaylist = mockPlaylists.find((p) => p.id === playlistId);
      if (!mockPlaylist) return [];
      
      return mockPlaylist.songs.map((songId) => 
        mockSongs.find((s) => s.id === songId)
      ).filter((song): song is Song => song !== undefined);
    }

    // Transform and sort by position
    const songs = playlist.playlist_songs
      .sort((a, b) => a.position - b.position)
      .map(ps => ({
        id: ps.songs.id,
        title: ps.songs.title,
        artist: ps.songs.artist,
        album: ps.songs.album || '',
        duration: ps.songs.duration,
        coverArt: ps.songs.cover_art_url || '',
        audioUrl: ps.songs.audio_url,
        genre: ps.songs.genre,
        releaseYear: ps.songs.release_year,
      }));

    return songs;
  } catch (error) {
    console.error('Error in getPlaylistSongs:', error);
    // Fallback to mock data
    const mockPlaylist = mockPlaylists.find((p) => p.id === playlistId);
    if (!mockPlaylist) return [];
    
    return mockPlaylist.songs.map((songId) => 
      mockSongs.find((s) => s.id === songId)
    ).filter((song): song is Song => song !== undefined);
  }
};

export const getSongsByCategory = async (categoryId: string): Promise<Song[]> => {
  try {
    // First get the category name
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('name')
      .eq('id', categoryId)
      .single();

    if (categoryError || !category) {
      console.error('Error fetching category:', categoryError);
      // Fallback to mock data
      const mockCategory = mockCategories.find((c) => c.id === categoryId);
      if (!mockCategory) return [];
      return mockSongs.filter((song) => song.genre === mockCategory.name);
    }

    // Get songs by genre
    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .eq('genre', category.name);

    if (songsError) {
      console.error('Error fetching songs by category:', songsError);
      // Fallback to mock data
      return mockSongs.filter((song) => song.genre === category.name);
    }

    // Transform to app format
    return songs.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      duration: song.duration,
      coverArt: song.cover_art_url || '',
      audioUrl: song.audio_url,
      genre: song.genre,
      releaseYear: song.release_year,
    }));
  } catch (error) {
    console.error('Error in getSongsByCategory:', error);
    // Fallback to mock data
    const mockCategory = mockCategories.find((c) => c.id === categoryId);
    if (!mockCategory) return [];
    return mockSongs.filter((song) => song.genre === mockCategory.name);
  }
};

export const getLikedSongs = (): Song[] => {
  // For now, return mock liked songs
  // In a real app, you'd store user preferences in a separate table
  return mockSongs.filter((song) => song.liked);
};

// Seed data function for initial setup
export const seedDatabase = async () => {
  try {
    console.log('Seeding database with initial data...');

    // Seed categories
    for (const category of mockCategories) {
      const { error } = await supabase
        .from('categories')
        .upsert({
          id: category.id,
          name: category.name,
          cover_art_url: category.coverArt,
        }, { onConflict: 'name' });

      if (error) {
        console.error('Error seeding category:', category.name, error);
      }
    }

    // Seed songs
    for (const song of mockSongs) {
      const { error } = await supabase
        .from('songs')
        .upsert({
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album,
          duration: song.duration,
          cover_art_url: song.coverArt,
          audio_url: song.audioUrl,
          genre: song.genre,
          release_year: song.releaseYear,
        }, { onConflict: 'id' });

      if (error) {
        console.error('Error seeding song:', song.title, error);
      }
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};