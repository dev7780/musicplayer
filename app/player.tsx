import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/Theme';
import { ChevronDown, Heart, FileHeart as HeartFilled, MoveVertical as MoreVertical, Share } from 'lucide-react-native';
import { PlayerControls } from '@/components/PlayerControls';
import { usePlayer } from '@/context/PlayerContext';
import { MediaItem } from '@/components/MediaItem';

export default function PlayerScreen() {
  const router = useRouter();
  const {
    currentSong,
    playlist,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    toggleRepeat,
    toggleShuffle,
    repeat,
    shuffle,
    play,
  } = usePlayer();

  console.log('🎵 Player screen rendered with song:', currentSong?.title);

  const handleBack = () => {
    console.log('⬅️ Back button pressed');
    router.back();
  };

  const handleLike = () => {
    console.log('❤️ Like button pressed');
    // In a real app, this would toggle the liked status of the song
  };

  const handleShare = () => {
    console.log('📤 Share button pressed');
    if (Platform.OS === 'web') {
      if (navigator.share && currentSong) {
        navigator.share({
          title: currentSong.title,
          text: `Check out "${currentSong.title}" by ${currentSong.artist}`,
          url: window.location.href,
        });
      }
    }
  };

  const handleSongPress = (song) => {
    console.log('🎵 Song pressed in playlist:', song.title);
    play(song, playlist);
  };

  if (!currentSong) {
    console.log('❌ No current song, showing empty state');
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No song is currently playing</Text>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  console.log('✅ Rendering player with song:', currentSong.title);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['rgba(255, 140, 0, 0.8)', 'rgba(255, 255, 255, 0.9)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronDown size={28} color={Colors.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Share size={24} color={Colors.neutral[800]} />
        </TouchableOpacity>
      </View>

      <View style={styles.coverArtContainer}>
        <View style={styles.coverArtWrapper}>
          <Image source={{ uri: currentSong.coverArt }} style={styles.coverArt} />
          <View style={styles.coverArtShadow} />
        </View>
      </View>

      <View style={styles.songInfoContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.titleWrapper}>
            <Text style={styles.songTitle} numberOfLines={2}>
              {currentSong.title}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {currentSong.artist}
            </Text>
            {currentSong.album && (
              <Text style={styles.albumName} numberOfLines={1}>
                {currentSong.album}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
            {currentSong.liked ? (
              <HeartFilled size={28} color={Colors.primary.default} />
            ) : (
              <Heart size={28} color={Colors.neutral[600]} />
            )}
          </TouchableOpacity>
        </View>

        <PlayerControls
          isPlaying={isPlaying}
          duration={duration}
          position={currentTime}
          onPlayPause={togglePlayPause}
          onSkipNext={playNext}
          onSkipPrevious={playPrevious}
          onSeek={seekTo}
          onRepeatToggle={toggleRepeat}
          onShuffleToggle={toggleShuffle}
          repeatMode={repeat}
          shuffleEnabled={shuffle}
        />
      </View>

      <View style={styles.upNextContainer}>
        <Text style={styles.upNextTitle}>Up Next ({playlist.length} songs)</Text>
        <ScrollView style={styles.playlistContainer} showsVerticalScrollIndicator={false}>
          {playlist.map((song, index) => (
            <View key={song.id} style={styles.playlistItem}>
              <Text style={styles.trackNumber}>{index + 1}</Text>
              <MediaItem
                item={song}
                onPress={() => handleSongPress(song)}
                isPlaying={currentSong.id === song.id && isPlaying}
                showDuration={false}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.lg,
    color: Colors.neutral[600],
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
  },
  backButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    color: Colors.primary.default,
  },
  headerTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    color: Colors.neutral[800],
  },
  shareButton: {
    padding: Spacing.xs,
  },
  coverArtContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  coverArtWrapper: {
    position: 'relative',
  },
  coverArt: {
    width: 300,
    height: 300,
    borderRadius: 20,
  },
  coverArtShadow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: -10,
    bottom: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    zIndex: -1,
  },
  songInfoContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  titleWrapper: {
    flex: 1,
    marginRight: Spacing.md,
  },
  songTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.xxl,
    color: Colors.neutral[900],
    marginBottom: 4,
    lineHeight: FontSizes.xxl * 1.2,
  },
  artistName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.lg,
    color: Colors.neutral[700],
    marginBottom: 2,
  },
  albumName: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.md,
    color: Colors.neutral[600],
  },
  likeButton: {
    padding: Spacing.sm,
  },
  upNextContainer: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  upNextTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.lg,
    color: Colors.neutral[900],
    marginBottom: Spacing.md,
  },
  playlistContainer: {
    flex: 1,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  trackNumber: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    color: Colors.neutral[500],
    width: 30,
    textAlign: 'center',
    marginRight: Spacing.sm,
  },
});