export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  profilePic?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverArt: string;
  audioUrl: string;
  genre?: string;
  releaseYear?: number;
  liked?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverArt: string;
  createdBy: string;
  songs: string[];
  isPublic: boolean;
}

export interface Category {
  id: string;
  name: string;
  coverArt: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type PlayerState = {
  currentSong: Song | null;
  playlist: Song[];
  isPlaying: boolean;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
  currentTime: number;
  duration: number;
};