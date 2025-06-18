import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/Theme';
import { mockPlaylists, getPlaylistSongs } from '@/data/mockData';
import { useRouter } from 'expo-router';
import { usePlayer } from '@/context/PlayerContext';
import { useAuth } from '@/context/AuthContext';

export default function LibraryScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { play } = usePlayer();
  const [activeTab, setActiveTab] = useState<'playlists' | 'albums'>('playlists');

  const handlePlaylistPress = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  const handlePlayPlaylist = async (playlistId: string) => {
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

  const handleCreatePlaylist = () => {
    if (!isAuthenticated) {
      router.push('/(auth)');
    } else {
      // In a real app, this would open a create playlist form
      alert('Create Playlist functionality would be implemented here');
    }
  };

  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => handlePlaylistPress(item.id)}
    >
      <Image source={{ uri: item.coverArt }} style={styles.playlistImage} />
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistDescription}>
          {item.description || `${item.songs.length} songs`}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => handlePlayPlaylist(item.id)}
      >
        <Text style={styles.playButtonText}>Play</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePlaylist}
        >
          <Plus size={20} color={Colors.neutral[50]} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'playlists' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('playlists')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'playlists' && styles.activeTabText,
            ]}
          >
            Playlists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'albums' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('albums')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'albums' && styles.activeTabText,
            ]}
          >
            Albums
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'playlists' ? (
        <FlatList
          data={mockPlaylists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No albums yet</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.xxl,
    color: Colors.neutral[900],
  },
  createButton: {
    backgroundColor: Colors.primary.default,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  tabButton: {
    paddingVertical: Spacing.sm,
    marginRight: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: Colors.primary.default,
  },
  tabText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    color: Colors.neutral[600],
  },
  activeTabText: {
    color: Colors.primary.default,
    fontFamily: FontFamily.bold,
  },
  listContainer: {
    paddingHorizontal: Spacing.md,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
  },
  playlistInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  playlistName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    color: Colors.neutral[900],
  },
  playlistDescription: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.sm,
    color: Colors.neutral[600],
    marginTop: 2,
  },
  playButton: {
    backgroundColor: Colors.primary.default,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  playButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    color: Colors.neutral[50],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.lg,
    color: Colors.neutral[600],
  },
});