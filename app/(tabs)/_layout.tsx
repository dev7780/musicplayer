import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Search, Library, User } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { Colors, FontFamily } from '@/constants/Theme';
import { MiniPlayer } from '@/components/MiniPlayer';
import { usePlayer } from '@/context/PlayerContext';

export default function TabLayout() {
  const { currentSong } = usePlayer();
  
  return (
    <View style={styles.container}>
      {currentSong && <MiniPlayer />}
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary.default,
          tabBarInactiveTintColor: Colors.neutral[600],
          tabBarStyle: [
            styles.tabBar,
            // Adjust tab bar position if mini player is showing
            currentSong && { marginBottom: 60 }
          ],
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  tabBar: {
    backgroundColor: Colors.neutral[50],
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
});