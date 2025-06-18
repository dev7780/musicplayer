import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export interface FileUploadResult {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export const uploadFile = async (file: File | FileUploadResult): Promise<string> => {
  // In a real app, this would upload to your server/cloud storage
  // For demo purposes, we'll return a blob URL or mock URL
  
  if (Platform.OS === 'web' && file instanceof File) {
    // For web, we can create a blob URL for preview/playback
    return URL.createObjectURL(file);
  }
  
  // For mobile or already processed files
  if ('uri' in file) {
    return file.uri;
  }
  
  // Fallback to a placeholder
  return 'https://via.placeholder.com/300x300.png?text=Uploaded+File';
};

export const pickAudioFile = async (): Promise<FileUploadResult | null> => {
  try {
    if (Platform.OS === 'web') {
      // Web file picker will be handled by the component
      return null;
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/*'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType || 'audio/mpeg',
        size: asset.size,
      };
    }

    return null;
  } catch (error) {
    console.error('Error picking audio file:', error);
    return null;
  }
};

export const pickImageFile = async (): Promise<FileUploadResult | null> => {
  try {
    if (Platform.OS === 'web') {
      // Web file picker will be handled by the component
      return null;
    }

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to select images!');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        name: `image_${Date.now()}.jpg`,
        type: 'image/jpeg',
        size: asset.fileSize,
      };
    }

    return null;
  } catch (error) {
    console.error('Error picking image file:', error);
    return null;
  }
};

export const validateAudioFile = (file: File | FileUploadResult): boolean => {
  if (Platform.OS === 'web' && file instanceof File) {
    const allowedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      'audio/m4a',
      'audio/flac',
      'audio/webm',
      'audio/x-wav',
      'audio/x-mpeg',
      'audio/mp4',
    ];
    
    const allowedExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac', '.webm'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
  }

  // For mobile, check the type or name
  if ('type' in file) {
    return file.type.startsWith('audio/') || 
           file.name.match(/\.(mp3|wav|ogg|aac|m4a|flac|webm)$/i) !== null;
  }

  return true; // Default to true for mobile files
};

export const validateImageFile = (file: File | FileUploadResult): boolean => {
  if (Platform.OS === 'web' && file instanceof File) {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
    ];
    
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
  }

  // For mobile, check the type or name
  if ('type' in file) {
    return file.type.startsWith('image/') || 
           file.name.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i) !== null;
  }

  return true; // Default to true for mobile files
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getAudioDuration = (file: File | FileUploadResult): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'web' && file instanceof File) {
        const audio = new Audio();
        
        const handleLoadedMetadata = () => {
          const duration = audio.duration;
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('error', handleError);
          URL.revokeObjectURL(audio.src);
          resolve(isFinite(duration) ? duration : 180);
        };
        
        const handleError = () => {
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('error', handleError);
          URL.revokeObjectURL(audio.src);
          resolve(180); // Default 3 minutes if can't read duration
        };
        
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('error', handleError);
        
        const url = URL.createObjectURL(file);
        audio.src = url;
        audio.load();
        
        // Timeout after 5 seconds
        setTimeout(() => {
          if (audio.readyState === 0) {
            handleError();
          }
        }, 5000);
      } else {
        // For mobile files, we can't easily get duration without loading the audio
        // Return a default duration
        resolve(180); // Default 3 minutes
      }
      
    } catch (error) {
      console.warn('Error getting audio duration:', error);
      resolve(180); // Default 3 minutes
    }
  });
};