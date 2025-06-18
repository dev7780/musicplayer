import dbConnect from './db/connect';
import { Song } from './models/song';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const songs = await Song.find({});
    return Response.json(songs);
  } catch (error) {
    return new Response('Failed to fetch songs', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const song = await Song.create(data);
    return Response.json(song);
  } catch (error) {
    return new Response('Failed to create song', { status: 500 });
  }
}