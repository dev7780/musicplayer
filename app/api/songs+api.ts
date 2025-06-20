import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const genre = url.searchParams.get('genre');
    const search = url.searchParams.get('search');
    const limit = url.searchParams.get('limit');

    let query = supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (genre) {
      query = query.eq('genre', genre);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%,album.ilike.%${search}%`);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: songs, error } = await query;

    if (error) {
      console.error('Error fetching songs:', error);
      return new Response('Failed to fetch songs', { status: 500 });
    }

    // Transform to match our app's Song interface
    const transformedSongs = songs.map(song => ({
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

    return Response.json(transformedSongs);
  } catch (error) {
    console.error('Error in songs API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Transform from app format to database format
    const songData = {
      title: body.title,
      artist: body.artist,
      album: body.album || null,
      duration: body.duration,
      cover_art_url: body.coverArt || null,
      audio_url: body.audioUrl,
      genre: body.genre || null,
      release_year: body.releaseYear || null,
    };

    const { data: song, error } = await supabase
      .from('songs')
      .insert([songData])
      .select()
      .single();

    if (error) {
      console.error('Error creating song:', error);
      return new Response('Failed to create song', { status: 500 });
    }

    // Transform back to app format
    const transformedSong = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      duration: song.duration,
      coverArt: song.cover_art_url || '',
      audioUrl: song.audio_url,
      genre: song.genre,
      releaseYear: song.release_year,
    };

    return Response.json(transformedSong);
  } catch (error) {
    console.error('Error in songs POST API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return new Response('Song ID is required', { status: 400 });
    }

    // Transform from app format to database format
    const songData = {
      title: updateData.title,
      artist: updateData.artist,
      album: updateData.album || null,
      duration: updateData.duration,
      cover_art_url: updateData.coverArt || null,
      audio_url: updateData.audioUrl,
      genre: updateData.genre || null,
      release_year: updateData.releaseYear || null,
    };

    const { data: song, error } = await supabase
      .from('songs')
      .update(songData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating song:', error);
      return new Response('Failed to update song', { status: 500 });
    }

    // Transform back to app format
    const transformedSong = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      duration: song.duration,
      coverArt: song.cover_art_url || '',
      audioUrl: song.audio_url,
      genre: song.genre,
      releaseYear: song.release_year,
    };

    return Response.json(transformedSong);
  } catch (error) {
    console.error('Error in songs PUT API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response('Song ID is required', { status: 400 });
    }

    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting song:', error);
      return new Response('Failed to delete song', { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error in songs DELETE API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}