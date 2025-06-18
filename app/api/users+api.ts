import dbConnect from './db/connect';
import { User } from './models/user';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const users = await User.find({}).select('-password');
    return Response.json(users);
  } catch (error) {
    return new Response('Failed to fetch users', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const user = await User.create(data);
    const { password, ...userWithoutPassword } = user.toObject();
    return Response.json(userWithoutPassword);
  } catch (error) {
    return new Response('Failed to create user', { status: 500 });
  }
}