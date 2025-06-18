import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { usePlayer } from '@/context/PlayerContext';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/Theme';
import { MediaItem } from '@/components/MediaItem';
import { mockSongs, mockPlaylists, mockCategories } from '@/data/mockData';
import { Song, Playlist, Category } from '@/types/app';
import { useRouter } from 'expo-router';

type SearchResult = {
  type: 'song' | 'playlist' | 'category';
  data: Song | Playlist | Category;
};

export default function SearchScreen() {
  const router = useRouter();
  const { play, currentSong, isPlaying } = usePlayer();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filteredSongs = mockSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase()) ||
          song.album.toLowerCase().includes(query.toLowerCase())
      );

      const filteredPlaylists = mockPlaylists.filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(query.toLowerCase()) ||
          (playlist.description &&
            playlist.description.toLowerCase().includes(query.toLowerCase()))
      );

      const filteredCategories = mockCategories.filter(
        (category) => category.name.toLowerCase().includes(query.toLowerCase())
      );

      const newResults: SearchResult[] = [
        ...filteredSongs.map((song) => ({ type: 'song', data: song })),
        ...filteredPlaylists.map((playlist) => ({ type: 'playlist', data: playlist })),
        ...filteredCategories.map((category) => ({ type: 'category', data: category })),
      ];

      setResults(newResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleResultPress = async (result: SearchResult) => {
    if (result.type === 'song') {
      const song = result.data as Song;
      try {
        await play(song, mockSongs);
        router.push('/player');
        
        // Add to recent searches
        if (!recentSearches.includes(song.title)) {
          setRecentSearches((prev) => [song.title, ...prev.slice(0, 4)]);
        }
      } catch (error) {
        console.error('Error playing song:', error);
      }
    } else if (result.type === 'playlist') {
      const playlist = result.data as Playlist;
      router.push(`/playlist/${playlist.id}`);
      
      // Add to recent searches
      if (!recentSearches.includes(playlist.name)) {
        setRecentSearches((prev) => [playlist.name, ...prev.slice(0, 4)]);
      }
    } else if (result.type === 'category') {
      const category = result.data as Category;
      router.push(`/category/${category.id}`);
      
      // Add to recent searches
      if (!recentSearches.includes(category.name)) {
        setRecentSearches((prev) => [category.name, ...prev.slice(0, 4)]);
      }
    }
  };

  const handleClearSearch = () => {
    setQuery('');
  };

  const handleRecentSearchPress = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    if (item.type === 'song') {
      const song = item.data as Song;
      return (
        <MediaItem
          item={song}
          onPress={() => handleResultPress(item)}
          isPlaying={currentSong?.id === song.id && isPlaying}
        />
      );
    } else if (item.type === 'playlist') {
      const playlist = item.data as Playlist;
      return (
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => handleResultPress(item)}
        >
          <Text style={styles.itemTitle}>{playlist.name}</Text>
          <Text style={styles.itemSubtitle}>Playlist</Text>
        </TouchableOpacity>
      );
    } else if (item.type === 'category') {
      const category = item.data as Category;
      return (
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => handleResultPress(item)}
        >
          <Text style={styles.itemTitle}>{category.name}</Text>
          <Text style={styles.itemSubtitle}>Category</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color={Colors.neutral[600]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Songs, artists, or playlists"
            placeholderTextColor={Colors.neutral[500]}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <X size={18} color={Colors.neutral[600]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item, index) => `${item.type}-${item.data.id}-${index}`}
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          {recentSearches.length > 0 ? (
            <>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={`recent-${index}`}
                  style={styles.recentItem}
                  onPress={() => handleRecentSearchPress(search)}
                >
                  <SearchIcon size={16} color={Colors.neutral[600]} />
                  <Text style={styles.recentText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              <SearchIcon size={64} color={Colors.neutral[400]} />
              <Text style={styles.emptyText}>
                Search for songs, artists, or playlists
              </Text>
            </>
          )}
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.xxl,
    color: Colors.neutral[900],
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[200],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.md,
    color: Colors.neutral[900],
  },
  clearButton: {
    padding: Spacing.xs,
  },
  resultsList: {
    paddingHorizontal: Spacing.md,
  },
  listItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  itemTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  itemSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.sm,
    color: Colors.neutral[600],
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
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  recentTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.lg,
    color: Colors.neutral[900],
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  recentText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.md,
    color: Colors.neutral[800],
    marginLeft: Spacing.sm,
  },
});