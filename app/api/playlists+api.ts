import dbConnect from './db/connect';
import { Playlist } from './models/playlist';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const playlists = await Playlist.find({}).populate('songs.songId');
    return Response.json(playlists);
  } catch (error) {
    return new Response('Failed to fetch playlists', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const playlist = await Playlist.create(data);
    return Response.json(playlist);
  } catch (error) {
    return new Response('Failed to create playlist', { status: 500 });
  }
}