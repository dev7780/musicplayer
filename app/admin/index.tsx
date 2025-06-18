import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Music, Users, Tag, Edit, Trash2 } from 'lucide-react-native';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';
import { SongDialog } from '@/components/admin/SongDialog';
import { CategoryDialog } from '@/components/admin/CategoryDialog';
import { UserDialog } from '@/components/admin/UserDialog';
import { DeleteDialog } from '@/components/admin/DeleteDialog';
import { Song, Category, User } from '@/types/app';
import { mockSongs, mockCategories, mockUsers } from '@/data/mockData';

export default function AdminScreen() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'songs' | 'categories' | 'users'>('songs');
  
  // Data states
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  // Dialog states
  const [songDialogVisible, setSongDialogVisible] = useState(false);
  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
  const [userDialogVisible, setUserDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  // Move navigation logic to useEffect to prevent side effects during render
  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      router.replace('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleBack = () => {
    router.back();
  };

  const handleAdd = () => {
    setDialogMode('add');
    setSelectedItem(null);
    switch (activeTab) {
      case 'songs':
        setSongDialogVisible(true);
        break;
      case 'categories':
        setCategoryDialogVisible(true);
        break;
      case 'users':
        setUserDialogVisible(true);
        break;
    }
  };

  const handleEdit = (item: any) => {
    setDialogMode('edit');
    setSelectedItem(item);
    switch (activeTab) {
      case 'songs':
        setSongDialogVisible(true);
        break;
      case 'categories':
        setCategoryDialogVisible(true);
        break;
      case 'users':
        setUserDialogVisible(true);
        break;
    }
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setDeleteDialogVisible(true);
  };

  const handleSongSubmit = async (song: Partial<Song>) => {
    try {
      if (dialogMode === 'add') {
        const newSong: Song = {
          id: Date.now().toString(),
          title: song.title!,
          artist: song.artist!,
          album: song.album || '',
          duration: song.duration || 180,
          coverArt: song.coverArt || '',
          audioUrl: song.audioUrl!,
          genre: song.genre,
          releaseYear: song.releaseYear,
        };
        setSongs(prev => [...prev, newSong]);
        Alert.alert('Success', 'Song added successfully');
      } else {
        setSongs(prev => prev.map(s => s.id === selectedItem.id ? { ...s, ...song } : s));
        Alert.alert('Success', 'Song updated successfully');
      }
      setSongDialogVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save song');
    }
  };

  const handleCategorySubmit = async (category: Partial<Category>) => {
    try {
      if (dialogMode === 'add') {
        const newCategory: Category = {
          id: Date.now().toString(),
          name: category.name!,
          coverArt: category.coverArt || '',
        };
        setCategories(prev => [...prev, newCategory]);
        Alert.alert('Success', 'Category added successfully');
      } else {
        setCategories(prev => prev.map(c => c.id === selectedItem.id ? { ...c, ...category } : c));
        Alert.alert('Success', 'Category updated successfully');
      }
      setCategoryDialogVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save category');
    }
  };

  const handleUserSubmit = async (user: Partial<User>) => {
    try {
      if (dialogMode === 'add') {
        const newUser: User = {
          id: Date.now().toString(),
          name: user.name!,
          email: user.email!,
          isAdmin: user.isAdmin || false,
          profilePic: user.profilePic || '',
        };
        setUsers(prev => [...prev, newUser]);
        Alert.alert('Success', 'User added successfully');
      } else {
        setUsers(prev => prev.map(u => u.id === selectedItem.id ? { ...u, ...user } : u));
        Alert.alert('Success', 'User updated successfully');
      }
      setUserDialogVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save user');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      switch (activeTab) {
        case 'songs':
          setSongs(prev => prev.filter(s => s.id !== selectedItem.id));
          break;
        case 'categories':
          setCategories(prev => prev.filter(c => c.id !== selectedItem.id));
          break;
        case 'users':
          setUsers(prev => prev.filter(u => u.id !== selectedItem.id));
          break;
      }
      Alert.alert('Success', 'Item deleted successfully');
      setDeleteDialogVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'songs':
        return songs;
      case 'categories':
        return categories;
      case 'users':
        return users;
      default:
        return [];
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (activeTab) {
      case 'songs':
        return (
          <View style={styles.listItem}>
            <Image source={{ uri: item.coverArt }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.artist} • {item.album}</Text>
              <Text style={styles.itemDetails}>{item.genre} • {item.releaseYear}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                <Edit size={16} color={Colors.primary.default} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
                <Trash2 size={16} color={Colors.error.default} />
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'categories':
        return (
          <View style={styles.listItem}>
            <Image source={{ uri: item.coverArt }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSubtitle}>Category</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                <Edit size={16} color={Colors.primary.default} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
                <Trash2 size={16} color={Colors.error.default} />
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'users':
        return (
          <View style={styles.listItem}>
            <Image source={{ uri: item.profilePic }} style={styles.userImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSubtitle}>{item.email}</Text>
              <Text style={styles.itemDetails}>{item.isAdmin ? 'Admin' : 'User'}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                <Edit size={16} color={Colors.primary.default} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
                <Trash2 size={16} color={Colors.error.default} />
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  // Return null if not authenticated or not admin to prevent rendering
  if (!isAuthenticated || !isAdmin()) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'songs' && styles.activeTab]}
          onPress={() => setActiveTab('songs')}
        >
          <Music size={20} color={activeTab === 'songs' ? Colors.primary.default : Colors.neutral[600]} />
          <Text style={[styles.tabText, activeTab === 'songs' && styles.activeTabText]}>
            Songs
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'categories' && styles.activeTab]}
          onPress={() => setActiveTab('categories')}
        >
          <Tag size={20} color={activeTab === 'categories' ? Colors.primary.default : Colors.neutral[600]} />
          <Text style={[styles.tabText, activeTab === 'categories' && styles.activeTabText]}>
            Categories
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Users size={20} color={activeTab === 'users' ? Colors.primary.default : Colors.neutral[600]} />
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Users
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentHeader}>
        <Text style={styles.contentTitle}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({getCurrentData().length})
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getCurrentData()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Dialogs */}
      <SongDialog
        isVisible={songDialogVisible}
        onClose={() => setSongDialogVisible(false)}
        onSubmit={handleSongSubmit}
        initialData={selectedItem}
        mode={dialogMode}
      />

      <CategoryDialog
        isVisible={categoryDialogVisible}
        onClose={() => setCategoryDialogVisible(false)}
        onSubmit={handleCategorySubmit}
        initialData={selectedItem}
        mode={dialogMode}
      />

      <UserDialog
        isVisible={userDialogVisible}
        onClose={() => setUserDialogVisible(false)}
        onSubmit={handleUserSubmit}
        initialData={selectedItem}
        mode={dialogMode}
      />

      <DeleteDialog
        isVisible={deleteDialogVisible}
        onClose={() => setDeleteDialogVisible(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message={`Are you sure you want to delete this ${activeTab.slice(0, -1)}? This action cannot be undone.`}
      />
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
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.xl,
    color: Colors.neutral[900],
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.neutral[100],
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  activeTab: {
    backgroundColor: Colors.neutral[200],
  },
  tabText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    color: Colors.neutral[600],
    marginLeft: 4,
  },
  activeTabText: {
    color: Colors.primary.default,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  contentTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.lg,
    color: Colors.neutral[900],
  },
  addButton: {
    backgroundColor: Colors.primary.default,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  addButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    color: Colors.neutral[50],
  },
  listContainer: {
    padding: Spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  itemSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.sm,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  itemDetails: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.xs,
    color: Colors.neutral[500],
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
});