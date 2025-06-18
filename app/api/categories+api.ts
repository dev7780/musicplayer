import dbConnect from './db/connect';
import { Category } from './models/category';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const categories = await Category.find({});
    return Response.json(categories);
  } catch (error) {
    return new Response('Failed to fetch categories', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const category = await Category.create(data);
    return Response.json(category);
  } catch (error) {
    return new Response('Failed to create category', { status: 500 });
  }
}