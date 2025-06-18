import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { PlayerState, Song } from '@/types/app';

interface PlayerContextType extends PlayerState {
  play: (song: Song, playlist?: Song[]) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Configure notifications for background playback
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    playlist: [],
    isPlaying: false,
    repeat: 'off',
    shuffle: false,
    currentTime: 0,
    duration: 0,
  });

  const soundRef = useRef<Audio.Sound | null>(null);
  const playbackUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    setupAudio();
    if (Platform.OS !== 'web') {
      setupNotifications();
    }
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = async () => {
    if (playbackUpdateIntervalRef.current) {
      clearInterval(playbackUpdateIntervalRef.current);
      playbackUpdateIntervalRef.current = null;
    }
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch (error) {
        console.warn('Error unloading sound:', error);
      }
    }
  };

  const setupAudio = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      }
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const setupNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  const updateNotification = async (song: Song, isPlaying: boolean) => {
    if (Platform.OS === 'web') return;

    try {
      await Notifications.dismissAllNotificationsAsync();
      
      if (song) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: isPlaying ? `♪ ${song.title}` : `⏸ ${song.title}`,
            body: `${song.artist}${song.album ? ` • ${song.album}` : ''}`,
            data: { songId: song.id, isPlaying },
            categoryIdentifier: 'music-player',
            sound: false,
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const startPlaybackStatusUpdate = (sound: Audio.Sound) => {
    if (playbackUpdateIntervalRef.current) {
      clearInterval(playbackUpdateIntervalRef.current);
    }

    playbackUpdateIntervalRef.current = setInterval(async () => {
      try {
        if (!sound || isLoadingRef.current) return;
        
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setState((prev) => ({
            ...prev,
            currentTime: (status.positionMillis || 0) / 1000,
            duration: (status.durationMillis || 0) / 1000,
            isPlaying: status.isPlaying || false,
          }));

          if (status.didJustFinish) {
            handleSongFinished();
          }
        }
      } catch (error) {
        console.error('Error getting playback status:', error);
      }
    }, 1000);
  };

  const handleSongFinished = async () => {
    try {
      switch (state.repeat) {
        case 'one':
          if (soundRef.current) {
            await soundRef.current.replayAsync();
          }
          break;
        case 'all':
          await playNext();
          break;
        case 'off':
          const currentIndex = state.playlist.findIndex(s => s.id === state.currentSong?.id);
          if (currentIndex === state.playlist.length - 1) {
            setState((prev) => ({
              ...prev,
              isPlaying: false,
              currentTime: 0,
            }));
            if (state.currentSong) {
              await updateNotification(state.currentSong, false);
            }
          } else {
            await playNext();
          }
          break;
      }
    } catch (error) {
      console.error('Error handling song finished:', error);
    }
  };

  const play = async (song: Song, playlist?: Song[]) => {
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      console.log('🎵 Starting to play song:', song.title);
      console.log('🔗 Audio URL:', song.audioUrl);

      // Stop and unload current sound
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        } catch (error) {
          console.warn('Error stopping previous sound:', error);
        }
        soundRef.current = null;
      }

      // Clear any existing interval
      if (playbackUpdateIntervalRef.current) {
        clearInterval(playbackUpdateIntervalRef.current);
        playbackUpdateIntervalRef.current = null;
      }

      // Validate audio URL
      if (!song.audioUrl || song.audioUrl.trim() === '') {
        throw new Error('Invalid audio URL');
      }

      console.log('🎧 Creating sound object...');

      // Create and load new sound with better error handling
      const { sound } = await Audio.Sound.createAsync(
        { uri: song.audioUrl },
        { 
          shouldPlay: true,
          progressUpdateIntervalMillis: 500,
          volume: 1.0,
          rate: 1.0,
          shouldCorrectPitch: true,
        },
        (status) => {
          if (status.isLoaded) {
            console.log('✅ Audio loaded successfully');
            setState((prev) => ({
              ...prev,
              duration: (status.durationMillis || song.duration * 1000) / 1000,
            }));
          } else if (status.error) {
            console.error('❌ Audio loading error:', status.error);
          }
        }
      );

      soundRef.current = sound;
      
      // Start playback status updates
      startPlaybackStatusUpdate(sound);

      // Update state immediately
      setState((prev) => ({
        ...prev,
        currentSong: song,
        playlist: playlist || [song],
        isPlaying: true,
        currentTime: 0,
        duration: song.duration || 0,
      }));

      await updateNotification(song, true);
      console.log('🎉 Song started playing successfully!');
      
    } catch (error) {
      console.error('❌ Error playing song:', error);
      setState((prev) => ({
        ...prev,
        isPlaying: false,
      }));
      
      // Show user-friendly error
      if (Platform.OS === 'web') {
        console.error(`Failed to play "${song.title}". Error:`, error);
      }
    } finally {
      isLoadingRef.current = false;
    }
  };

  const pause = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setState((prev) => ({ ...prev, isPlaying: false }));
        if (state.currentSong) {
          await updateNotification(state.currentSong, false);
        }
      }
    } catch (error) {
      console.error('Error pausing song:', error);
    }
  };

  const resume = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.playAsync();
        setState((prev) => ({ ...prev, isPlaying: true }));
        if (state.currentSong) {
          await updateNotification(state.currentSong, true);
        }
      }
    } catch (error) {
      console.error('Error resuming song:', error);
    }
  };

  const togglePlayPause = async () => {
    if (state.isPlaying) {
      await pause();
    } else {
      await resume();
    }
  };

  const playNext = async () => {
    if (!state.currentSong || state.playlist.length === 0) return;

    try {
      let nextIndex;
      const currentIndex = state.playlist.findIndex((s) => s.id === state.currentSong!.id);

      if (state.shuffle) {
        let availableIndices = Array.from(
          { length: state.playlist.length },
          (_, i) => i
        ).filter((i) => i !== currentIndex);

        if (availableIndices.length > 0) {
          const randomIdx = Math.floor(Math.random() * availableIndices.length);
          nextIndex = availableIndices[randomIdx];
        } else {
          nextIndex = 0;
        }
      } else {
        nextIndex = (currentIndex + 1) % state.playlist.length;
      }

      await play(state.playlist[nextIndex], state.playlist);
    } catch (error) {
      console.error('Error playing next song:', error);
    }
  };

  const playPrevious = async () => {
    if (!state.currentSong || state.playlist.length === 0) return;

    try {
      let prevIndex;
      const currentIndex = state.playlist.findIndex((s) => s.id === state.currentSong!.id);

      if (state.shuffle) {
        let availableIndices = Array.from(
          { length: state.playlist.length },
          (_, i) => i
        ).filter((i) => i !== currentIndex);

        if (availableIndices.length > 0) {
          const randomIdx = Math.floor(Math.random() * availableIndices.length);
          prevIndex = availableIndices[randomIdx];
        } else {
          prevIndex = 0;
        }
      } else {
        prevIndex = (currentIndex - 1 + state.playlist.length) % state.playlist.length;
      }

      await play(state.playlist[prevIndex], state.playlist);
    } catch (error) {
      console.error('Error playing previous song:', error);
    }
  };

  const seekTo = async (position: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(position * 1000);
        setState((prev) => ({ ...prev, currentTime: position }));
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const toggleShuffle = () => {
    setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  };

  const toggleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(state.repeat);
    const nextIndex = (currentIndex + 1) % modes.length;
    setState((prev) => ({ ...prev, repeat: modes[nextIndex] }));
  };

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        play,
        pause,
        resume,
        playNext,
        playPrevious,
        seekTo,
        togglePlayPause,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};