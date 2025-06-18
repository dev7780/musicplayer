import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle } from 'lucide-react-native';
import { Colors, FontFamily, FontSizes, Spacing } from '@/constants/Theme';
import { formatTime } from '@/utils/formatters';

interface PlayerControlsProps {
  isPlaying: boolean;
  duration: number;
  position: number;
  onPlayPause: () => void;
  onSkipNext: () => void;
  onSkipPrevious: () => void;
  onSeek: (value: number) => void;
  onRepeatToggle: () => void;
  onShuffleToggle: () => void;
  repeatMode: 'off' | 'all' | 'one';
  shuffleEnabled: boolean;
  mini?: boolean;
}

export function PlayerControls({
  isPlaying,
  duration,
  position,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  onSeek,
  onRepeatToggle,
  onShuffleToggle,
  repeatMode,
  shuffleEnabled,
  mini = false,
}: PlayerControlsProps) {
  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <Repeat1 size={24} color={Colors.primary.default} />;
      case 'all':
        return <Repeat size={24} color={Colors.primary.default} />;
      default:
        return <Repeat size={24} color={Colors.neutral[500]} />;
    }
  };

  if (mini) {
    return (
      <View style={styles.miniContainer}>
        <TouchableOpacity onPress={onSkipPrevious} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <SkipBack size={24} color={Colors.neutral[800]} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPlayPause}
          style={styles.miniPlayButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isPlaying ? (
            <Pause size={24} color={Colors.neutral[50]} />
          ) : (
            <Play size={24} color={Colors.neutral[50]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onSkipNext} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <SkipForward size={24} color={Colors.neutral[800]} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration > 0 ? duration : 1}
          value={position}
          onSlidingComplete={onSeek}
          minimumTrackTintColor={Colors.primary.default}
          maximumTrackTintColor={Colors.neutral[300]}
          thumbTintColor={Colors.primary.default}
          thumbStyle={styles.sliderThumb}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={onShuffleToggle}
          style={styles.secondaryButton}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Shuffle
            size={22}
            color={shuffleEnabled ? Colors.primary.default : Colors.neutral[500]}
          />
        </TouchableOpacity>

        <View style={styles.mainControls}>
          <TouchableOpacity onPress={onSkipPrevious} style={styles.controlButton}>
            <SkipBack size={28} color={Colors.neutral[800]} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onPlayPause} style={styles.playPauseButton}>
            {isPlaying ? (
              <Pause size={32} color={Colors.neutral[50]} />
            ) : (
              <Play size={32} color={Colors.neutral[50]} />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onSkipNext} style={styles.controlButton}>
            <SkipForward size={28} color={Colors.neutral[800]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onRepeatToggle}
          style={styles.secondaryButton}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          {getRepeatIcon()}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  progressContainer: {
    marginBottom: Spacing.lg,
  },
  slider: {
    width: '100%',
    height: 40,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  sliderThumb: {
    width: 16,
    height: 16,
    backgroundColor: Colors.primary.default,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  timeText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.xs,
    color: Colors.neutral[600],
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: Spacing.sm,
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    padding: Spacing.sm,
  },
  miniContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120,
  },
  miniPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
});