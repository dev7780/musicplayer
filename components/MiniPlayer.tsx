import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlayer } from '@/context/PlayerContext';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/Theme';
import { PlayerControls } from './PlayerControls';
import { LinearGradient } from 'expo-linear-gradient';

export function MiniPlayer() {
  const router = useRouter();
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    currentTime,
    duration,
  } = usePlayer();

  if (!currentSong) return null;

  const handlePress = () => {
    router.push('/player');
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.95}
    >
      <LinearGradient
        colors={['rgba(255, 140, 0, 0.95)', 'rgba(255, 165, 0, 0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }
          ]} 
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Image source={{ uri: currentSong.coverArt }} style={styles.cover} />
        
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
        
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onSkipNext={playNext}
          onSkipPrevious={playPrevious}
          duration={duration}
          position={currentTime}
          onSeek={() => {}}
          onRepeatToggle={() => {}}
          onShuffleToggle={() => {}}
          repeatMode="off"
          shuffleEnabled={false}
          mini={true}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // Height of the tab bar
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: Colors.primary.default,
    zIndex: 100,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.neutral[50],
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    height: '100%',
    marginTop: 2,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
  },
  infoContainer: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    color: Colors.neutral[50],
    marginBottom: 2,
  },
  artist: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.xs,
    color: Colors.neutral[200],
  },
});