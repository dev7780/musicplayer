import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Get users from Supabase Auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('Error fetching users:', error);
      return new Response('Failed to fetch users', { status: 500 });
    }

    // Transform to match our app's User interface
    const transformedUsers = users.map(user => ({
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
      isAdmin: user.user_metadata?.isAdmin || false,
      profilePic: user.user_metadata?.profilePic || '',
    }));

    return Response.json(transformedUsers);
  } catch (error) {
    console.error('Error in users API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      user_metadata: {
        name: body.name,
        isAdmin: body.isAdmin || false,
        profilePic: body.profilePic || '',
      },
      email_confirm: true, // Auto-confirm email for admin-created users
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return new Response('Failed to create user', { status: 500 });
    }

    // Transform back to app format
    const transformedUser = {
      id: authData.user.id,
      email: authData.user.email || '',
      name: body.name,
      isAdmin: body.isAdmin || false,
      profilePic: body.profilePic || '',
    };

    return Response.json(transformedUser);
  } catch (error) {
    console.error('Error in users POST API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return new Response('User ID is required', { status: 400 });
    }

    const updatePayload: any = {
      user_metadata: {
        name: updateData.name,
        isAdmin: updateData.isAdmin,
        profilePic: updateData.profilePic,
      },
    };

    // Only update email if provided
    if (updateData.email) {
      updatePayload.email = updateData.email;
    }

    // Only update password if provided
    if (updateData.password) {
      updatePayload.password = updateData.password;
    }

    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
      id,
      updatePayload
    );

    if (authError) {
      console.error('Error updating user:', authError);
      return new Response('Failed to update user', { status: 500 });
    }

    // Transform back to app format
    const transformedUser = {
      id: authData.user.id,
      email: authData.user.email || '',
      name: authData.user.user_metadata?.name || '',
      isAdmin: authData.user.user_metadata?.isAdmin || false,
      profilePic: authData.user.user_metadata?.profilePic || '',
    };

    return Response.json(transformedUser);
  } catch (error) {
    console.error('Error in users PUT API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response('User ID is required', { status: 400 });
    }

    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      console.error('Error deleting user:', error);
      return new Response('Failed to delete user', { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error in users DELETE API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}