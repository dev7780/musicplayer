import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return new Response('Failed to fetch categories', { status: 500 });
    }

    // Transform to match our app's Category interface
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      coverArt: category.cover_art_url || '',
    }));

    return Response.json(transformedCategories);
  } catch (error) {
    console.error('Error in categories API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const categoryData = {
      name: body.name,
      cover_art_url: body.coverArt || null,
    };

    const { data: category, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return new Response('Failed to create category', { status: 500 });
    }

    // Transform back to app format
    const transformedCategory = {
      id: category.id,
      name: category.name,
      coverArt: category.cover_art_url || '',
    };

    return Response.json(transformedCategory);
  } catch (error) {
    console.error('Error in categories POST API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return new Response('Category ID is required', { status: 400 });
    }

    const categoryData = {
      name: updateData.name,
      cover_art_url: updateData.coverArt || null,
    };

    const { data: category, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return new Response('Failed to update category', { status: 500 });
    }

    // Transform back to app format
    const transformedCategory = {
      id: category.id,
      name: category.name,
      coverArt: category.cover_art_url || '',
    };

    return Response.json(transformedCategory);
  } catch (error) {
    console.error('Error in categories PUT API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response('Category ID is required', { status: 400 });
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return new Response('Failed to delete category', { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error in categories DELETE API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}