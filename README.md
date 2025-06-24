# Melodify - Music Streaming App

A modern music streaming application built with Expo, React Native, and Supabase.

## Features

- 🎵 **Music Streaming**: Play songs with full audio controls
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🔐 **Authentication**: Secure user authentication with Supabase Auth
- 👤 **User Profiles**: Customizable user profiles with admin roles
- 🎧 **Playlists**: Create and manage custom playlists
- ❤️ **Favorites**: Like and save favorite songs
- 🎨 **Categories**: Browse music by genre/category
- 🔍 **Search**: Search for songs, artists, and albums
- 🛠️ **Admin Panel**: Full content management for admins
- 📊 **Real-time Data**: Live updates with Supabase

## Tech Stack

- **Frontend**: React Native, Expo Router, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Audio**: Expo AV
- **UI**: Custom components with Lucide React Native icons
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+ 
- Expo CLI
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to **SQL Editor** in your Supabase dashboard
   - Run the migration files in order:
     1. Copy and paste `supabase/migrations/20250101000001_initial_schema.sql` and click **Run**
     2. Copy and paste `supabase/migrations/20250101000002_seed_data.sql` and click **Run**

4. Configure environment variables:
   - Go to **Settings → API** in your Supabase dashboard
   - Copy your **Project URL** and **anon public key**
   - Create a `.env` file in your project root:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The app uses the following main tables:

- **songs**: Music tracks with metadata (30+ sample songs included)
- **categories**: Music genres/categories (10 categories included)
- **playlists**: User-created playlists
- **playlist_songs**: Junction table for playlist-song relationships
- **user_favorites**: User's favorite songs
- **user_profiles**: Extended user profile information

## Sample Data Included

After running the seed migration, you'll have:

### 🎵 **30 Sample Songs** across genres:
- **Hip Hop**: Urban Jungle, Street Rhythm, Downtown Flow
- **Electronic**: City Lights, Electric Dreams, Neon Nights, Digital Pulse, Midnight Drive
- **Jazz**: Coffee Break, Jazz Café, Vintage Vinyl, Midnight Jazz
- **Ambient**: Mountain High, Ocean Waves, Forest Walk, Sunrise Meditation
- **Chill**: Summer Breeze, Lazy Sunday, Sunset Dreams
- **Rock**: Acoustic Dreams, Thunder Road, Mountain Echo
- **Pop**: Pop Sensation, Radio Waves, Dance Floor
- **Classical**: Symphony No. 1, Piano Concerto, String Quartet
- **R&B**: Smooth Groove, Midnight Soul, Velvet Voice
- **Indie**: Coffee Shop, Vinyl Dreams, Bedroom Pop

### 🎨 **10 Music Categories**:
- Hip Hop, Electronic, Jazz, Ambient, Chill, Rock, Pop, Classical, R&B, Indie

## Authentication

The app supports:
- Email/password authentication
- User profiles with admin roles
- Row Level Security (RLS) for data protection
- Automatic profile creation on signup

### Creating Demo Users

1. Sign up through the app with these suggested credentials:
   - **Regular User**: `user@example.com` / `password123`
   - **Admin User**: `admin@example.com` / `password123`

2. To make a user admin, run this SQL in Supabase:
   ```sql
   UPDATE user_profiles 
   SET is_admin = true 
   WHERE user_id = 'USER_UUID_HERE';
   ```

## Admin Features

Admins can:
- Add, edit, and delete songs
- Manage music categories
- Create and manage user accounts
- View all playlists and user data

## API Routes

The app includes API routes for:
- `/api/songs` - Song management
- `/api/categories` - Category management  
- `/api/playlists` - Playlist management
- `/api/users` - User management
- `/api/favorites` - User favorites

## Deployment

This app is ready for deployment to:
- **Web**: Netlify, Vercel, or any static hosting
- **Mobile**: Expo Application Services (EAS)
- **Database**: Supabase (production-ready)

### Environment Setup

For production deployment:

1. Set up production Supabase project
2. Configure environment variables in your hosting platform
3. Run database migrations
4. Create admin users through the app or Supabase dashboard

## Troubleshooting

### Common Issues

1. **No tables in Supabase**: Make sure you ran both migration files in the SQL Editor
2. **Authentication errors**: Verify your Supabase URL and anon key in `.env`
3. **Songs not playing**: Check that audio URLs are accessible and valid
4. **Admin features not working**: Ensure user has `is_admin = true` in user_profiles table

### Getting Help

1. Check the Supabase dashboard for any RLS policy errors
2. Verify environment variables are correctly set
3. Check browser console for any JavaScript errors
4. Ensure all migrations ran successfully

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.