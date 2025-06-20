import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    const { data: favorites, error } = await supabase
      .from('user_favorites')
      .select(`
        song_id,
        songs (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return new Response('Failed to fetch favorites', { status: 500 });
    }

    // Transform to match our app's Song interface
    const transformedSongs = favorites.map(fav => ({
      id: fav.songs.id,
      title: fav.songs.title,
      artist: fav.songs.artist,
      album: fav.songs.album || '',
      duration: fav.songs.duration,
      coverArt: fav.songs.cover_art_url || '',
      audioUrl: fav.songs.audio_url,
      genre: fav.songs.genre,
      releaseYear: fav.songs.release_year,
      liked: true,
    }));

    return Response.json(transformedSongs);
  } catch (error) {
    console.error('Error in favorites API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, songId } = body;

    if (!userId || !songId) {
      return new Response('User ID and Song ID are required', { status: 400 });
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .insert([{ user_id: userId, song_id: songId }])
      .select()
      .single();

    if (error) {
      console.error('Error adding favorite:', error);
      return new Response('Failed to add favorite', { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Error in favorites POST API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const songId = url.searchParams.get('songId');

    if (!userId || !songId) {
      return new Response('User ID and Song ID are required', { status: 400 });
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('song_id', songId);

    if (error) {
      console.error('Error removing favorite:', error);
      return new Response('Failed to remove favorite', { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error in favorites DELETE API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}