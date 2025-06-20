import { Song, Playlist, Category, User } from '@/types/app';

const API_BASE = '';

// Songs API
export const songsApi = {
  getAll: async (params?: { genre?: string; search?: string; limit?: number }): Promise<Song[]> => {
    const searchParams = new URLSearchParams();
    if (params?.genre) searchParams.append('genre', params.genre);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await fetch(`${API_BASE}/api/songs?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch songs');
    return response.json();
  },

  create: async (song: Partial<Song>): Promise<Song> => {
    const response = await fetch(`${API_BASE}/api/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(song),
    });
    if (!response.ok) throw new Error('Failed to create song');
    return response.json();
  },

  update: async (id: string, song: Partial<Song>): Promise<Song> => {
    const response = await fetch(`${API_BASE}/api/songs`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...song }),
    });
    if (!response.ok) throw new Error('Failed to update song');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/songs?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete song');
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE}/api/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  create: async (category: Partial<Category>): Promise<Category> => {
    const response = await fetch(`${API_BASE}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    const response = await fetch(`${API_BASE}/api/categories`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...category }),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/categories?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete category');
  },
};

// Playlists API
export const playlistsApi = {
  getAll: async (userId?: string): Promise<Playlist[]> => {
    const searchParams = new URLSearchParams();
    if (userId) searchParams.append('userId', userId);
    
    const response = await fetch(`${API_BASE}/api/playlists?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch playlists');
    return response.json();
  },

  create: async (playlist: Partial<Playlist>): Promise<Playlist> => {
    const response = await fetch(`${API_BASE}/api/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playlist),
    });
    if (!response.ok) throw new Error('Failed to create playlist');
    return response.json();
  },

  update: async (id: string, playlist: Partial<Playlist>): Promise<Playlist> => {
    const response = await fetch(`${API_BASE}/api/playlists`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...playlist }),
    });
    if (!response.ok) throw new Error('Failed to update playlist');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/playlists?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete playlist');
  },
};

// Favorites API
export const favoritesApi = {
  getAll: async (userId: string): Promise<Song[]> => {
    const response = await fetch(`${API_BASE}/api/favorites?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch favorites');
    return response.json();
  },

  add: async (userId: string, songId: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, songId }),
    });
    if (!response.ok) throw new Error('Failed to add favorite');
  },

  remove: async (userId: string, songId: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/favorites?userId=${userId}&songId=${songId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove favorite');
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE}/api/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  create: async (user: Partial<User> & { password: string }): Promise<User> => {
    const response = await fetch(`${API_BASE}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE}/api/users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...user }),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/users?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },
};