import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    let query = supabase
      .from('playlists')
      .select(`
        *,
        playlist_songs (
          song_id,
          position,
          songs (*)
        )
      `)
      .order('created_at', { ascending: false });

    // If userId is provided, filter by user's playlists or public playlists
    if (userId) {
      query = query.or(`created_by.eq.${userId},is_public.eq.true`);
    } else {
      // Only public playlists if no user specified
      query = query.eq('is_public', true);
    }

    const { data: playlists, error } = await query;

    if (error) {
      console.error('Error fetching playlists:', error);
      return new Response('Failed to fetch playlists', { status: 500 });
    }

    // Transform to match our app's Playlist interface
    const transformedPlaylists = playlists.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || '',
      coverArt: playlist.cover_art_url || '',
      createdBy: playlist.created_by,
      isPublic: playlist.is_public,
      songs: playlist.playlist_songs
        .sort((a, b) => a.position - b.position)
        .map(ps => ps.song_id),
    }));

    return Response.json(transformedPlaylists);
  } catch (error) {
    console.error('Error in playlists API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const playlistData = {
      name: body.name,
      description: body.description || null,
      cover_art_url: body.coverArt || null,
      created_by: body.createdBy,
      is_public: body.isPublic || false,
    };

    const { data: playlist, error } = await supabase
      .from('playlists')
      .insert([playlistData])
      .select()
      .single();

    if (error) {
      console.error('Error creating playlist:', error);
      return new Response('Failed to create playlist', { status: 500 });
    }

    // Add songs to playlist if provided
    if (body.songs && body.songs.length > 0) {
      const playlistSongs = body.songs.map((songId: string, index: number) => ({
        playlist_id: playlist.id,
        song_id: songId,
        position: index,
      }));

      const { error: songsError } = await supabase
        .from('playlist_songs')
        .insert(playlistSongs);

      if (songsError) {
        console.error('Error adding songs to playlist:', songsError);
        // Don't fail the request, just log the error
      }
    }

    // Transform back to app format
    const transformedPlaylist = {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || '',
      coverArt: playlist.cover_art_url || '',
      createdBy: playlist.created_by,
      isPublic: playlist.is_public,
      songs: body.songs || [],
    };

    return Response.json(transformedPlaylist);
  } catch (error) {
    console.error('Error in playlists POST API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return new Response('Playlist ID is required', { status: 400 });
    }

    const playlistData = {
      name: updateData.name,
      description: updateData.description || null,
      cover_art_url: updateData.coverArt || null,
      is_public: updateData.isPublic,
    };

    const { data: playlist, error } = await supabase
      .from('playlists')
      .update(playlistData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating playlist:', error);
      return new Response('Failed to update playlist', { status: 500 });
    }

    // Update playlist songs if provided
    if (updateData.songs) {
      // Remove existing songs
      await supabase
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', id);

      // Add new songs
      if (updateData.songs.length > 0) {
        const playlistSongs = updateData.songs.map((songId: string, index: number) => ({
          playlist_id: id,
          song_id: songId,
          position: index,
        }));

        const { error: songsError } = await supabase
          .from('playlist_songs')
          .insert(playlistSongs);

        if (songsError) {
          console.error('Error updating playlist songs:', songsError);
        }
      }
    }

    // Transform back to app format
    const transformedPlaylist = {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || '',
      coverArt: playlist.cover_art_url || '',
      createdBy: playlist.created_by,
      isPublic: playlist.is_public,
      songs: updateData.songs || [],
    };

    return Response.json(transformedPlaylist);
  } catch (error) {
    console.error('Error in playlists PUT API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response('Playlist ID is required', { status: 400 });
    }

    // Delete playlist (playlist_songs will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting playlist:', error);
      return new Response('Failed to delete playlist', { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error in playlists DELETE API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}