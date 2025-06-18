import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Play, Pause, MoveVertical as MoreVertical } from 'lucide-react-native';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/Theme';
import { Song } from '@/types/app';
import { formatTime } from '@/utils/formatters';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { usePlayer } from '@/context/PlayerContext';

interface MediaItemProps {
  item: Song;
  onPress?: () => void;
  onOptionsPress?: () => void;
  showDuration?: boolean;
  isPlaying?: boolean;
}

export function MediaItem({
  item,
  onPress,
  onOptionsPress,
  showDuration = true,
  isPlaying = false,
}: MediaItemProps) {
  const router = useRouter();
  const { play, currentSong, playlist } = usePlayer();

  const handlePress = async () => {
    console.log('🎵 MediaItem pressed:', item.title);
    
    if (onPress) {
      onPress();
    } else {
      // Default behavior: play the song and navigate to player
      try {
        console.log('🚀 Starting playback and navigation...');
        await play(item, playlist.length > 0 ? playlist : [item]);
        console.log('✅ Playback started, navigating to player...');
        router.push('/player');
      } catch (error) {
        console.error('❌ Error playing song:', error);
      }
    }
  };

  const handlePlayButtonPress = async (event: any) => {
    // Stop event propagation to prevent triggering the main onPress
    event.stopPropagation();
    
    console.log('▶️ Play button pressed for:', item.title);
    
    try {
      await play(item, playlist.length > 0 ? playlist : [item]);
      router.push('/player');
    } catch (error) {
      console.error('❌ Error playing song from play button:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isPlaying && styles.playingContainer]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {isPlaying && (
        <LinearGradient
          colors={['rgba(255, 140, 0, 0.1)', 'rgba(255, 140, 0, 0.05)']}
          style={StyleSheet.absoluteFill}
        />
      )}
      
      <Image source={{ uri: item.coverArt }} style={styles.cover} />
      
      <View style={styles.infoContainer}>
        <Text
          style={[styles.title, isPlaying && styles.playingText]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      
      <View style={styles.rightContainer}>
        {showDuration && (
          <Text style={styles.duration}>{formatTime(item.duration)}</Text>
        )}
        
        {isPlaying ? (
          <View style={styles.playingIndicator}>
            <View style={styles.bar1} />
            <View style={styles.bar2} />
            <View style={styles.bar3} />
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={handlePlayButtonPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Play size={16} color={Colors.neutral[50]} />
          </TouchableOpacity>
        )}
        
        {onOptionsPress && (
          <TouchableOpacity 
            style={styles.optionsButton} 
            onPress={onOptionsPress} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MoreVertical size={20} color={Colors.neutral[600]} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.neutral[50],
  },
  playingContainer: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary.default,
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
  },
  infoContainer: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  playingText: {
    color: Colors.primary.default,
  },
  artist: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.sm,
    color: Colors.neutral[600],
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.sm,
    color: Colors.neutral[600],
    marginRight: Spacing.sm,
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsButton: {
    marginLeft: Spacing.sm,
    padding: 2,
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 16,
    width: 28,
  },
  bar1: {
    width: 3,
    height: 12,
    backgroundColor: Colors.primary.default,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  bar2: {
    width: 3,
    height: 16,
    backgroundColor: Colors.primary.default,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  bar3: {
    width: 3,
    height: 8,
    backgroundColor: Colors.primary.default,
    marginHorizontal: 1,
    borderRadius: 1,
  },
});