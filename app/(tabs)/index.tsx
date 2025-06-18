import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '@/context/PlayerContext';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/Theme';
import { MediaItem } from '@/components/MediaItem';
import { PlaylistCard } from '@/components/PlaylistCard';
import { mockSongs, mockPlaylists, mockCategories, getPlaylistSongs } from '@/data/mockData';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { play, currentSong, isPlaying } = usePlayer();

  const handleSongPress = async (song: any) => {
    try {
      await play(song, mockSongs);
      router.push('/player');
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const handlePlaylistPress = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  const handlePlaylistPlay = async (playlistId: string) => {
    try {
      const songs = getPlaylistSongs(playlistId);
      if (songs.length > 0) {
        await play(songs[0], songs);
        router.push('/player');
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['rgba(255, 140, 0, 0.3)', 'rgba(255, 255, 255, 1)']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Welcome to Melodify</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Played</Text>
          <View style={styles.recentlyPlayedContainer}>
            {mockSongs.slice(0, 6).map((song) => (
              <MediaItem
                key={song.id}
                item={song}
                onPress={() => handleSongPress(song)}
                isPlaying={currentSong?.id === song.id && isPlaying}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Playlists</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.playlistContainer}
          >
            {mockPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onPress={() => handlePlaylistPress(playlist.id)}
                onPlayPress={() => handlePlaylistPlay(playlist.id)}
              />
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {mockCategories.map((category) => (
              <View key={category.id} style={styles.categoryItem}>
                <Image
                  source={{ uri: category.coverArt }}
                  style={styles.categoryImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.categoryGradient}
                />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  greeting: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.md,
    color: Colors.neutral[700],
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.xxxl,
    color: Colors.neutral[900],
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.xl,
    color: Colors.neutral[900],
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  recentlyPlayedContainer: {
    paddingHorizontal: Spacing.md,
  },
  playlistContainer: {
    paddingHorizontal: Spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.md,
  },
  categoryItem: {
    width: 140,
    height: 80,
    marginRight: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
  },
  categoryName: {
    position: 'absolute',
    bottom: Spacing.xs,
    left: Spacing.xs,
    right: Spacing.xs,
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.md,
    color: Colors.neutral[50],
  },
});