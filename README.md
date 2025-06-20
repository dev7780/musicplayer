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
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/`
   - Get your project URL and anon key

4. Configure environment variables:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The app uses the following main tables:

- **songs**: Music tracks with metadata
- **categories**: Music genres/categories  
- **playlists**: User-created playlists
- **playlist_songs**: Junction table for playlist-song relationships
- **user_favorites**: User's favorite songs
- **user_profiles**: Extended user profile information

## Authentication

The app supports:
- Email/password authentication
- User profiles with admin roles
- Row Level Security (RLS) for data protection
- Automatic profile creation on signup

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.