import React, { useState, useRef } from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, FontFamily, FontSizes, BorderRadius } from '@/constants/Theme';
import { Song } from '@/types/app';
import { uploadFile, validateAudioFile, validateImageFile, formatFileSize, getAudioDuration, pickAudioFile, pickImageFile, FileUploadResult } from '@/utils/fileUpload';
import { sampleAudioFiles } from '@/data/sampleAudio';
import { Upload, Music, Image as ImageIcon, X, FileAudio, Clock, Smartphone } from 'lucide-react-native';

interface SongDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (song: Partial<Song>) => void;
  initialData?: Song;
  mode: 'add' | 'edit';
}

export function SongDialog({ isVisible, onClose, onSubmit, initialData, mode }: SongDialogProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    artist: initialData?.artist || '',
    album: initialData?.album || '',
    genre: initialData?.genre || '',
    releaseYear: initialData?.releaseYear?.toString() || '',
    coverArt: initialData?.coverArt || '',
    audioUrl: initialData?.audioUrl || '',
    duration: initialData?.duration || 0,
  });

  const [audioFile, setAudioFile] = useState<File | FileUploadResult | null>(null);
  const [coverFile, setCoverFile] = useState<File | FileUploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGettingDuration, setIsGettingDuration] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedSampleAudio, setSelectedSampleAudio] = useState<string>('');

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist is required';
    }
    if (!formData.audioUrl && !audioFile && !selectedSampleAudio) {
      newErrors.audio = 'Audio file is required';
    }
    if (formData.releaseYear && (isNaN(Number(formData.releaseYear)) || Number(formData.releaseYear) < 1900 || Number(formData.releaseYear) > new Date().getFullYear())) {
      newErrors.releaseYear = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAudioFileSelect = async (event?: React.ChangeEvent<HTMLInputElement>) => {
    let file: File | FileUploadResult | null = null;

    if (Platform.OS === 'web' && event) {
      // Web file selection
      file = event.target.files?.[0] || null;
    } else {
      // Mobile file selection
      file = await pickAudioFile();
    }

    if (file) {
      if (validateAudioFile(file)) {
        setAudioFile(file);
        setSelectedSampleAudio('');
        setErrors(prev => ({ ...prev, audio: '' }));
        
        // Auto-fill title if empty
        if (!formData.title) {
          const fileName = file.name.replace(/\.[^/.]+$/, '');
          setFormData(prev => ({ ...prev, title: fileName }));
        }

        // Get audio duration
        setIsGettingDuration(true);
        try {
          const duration = await getAudioDuration(file);
          setFormData(prev => ({ ...prev, duration: Math.round(duration) }));
        } catch (error) {
          console.warn('Could not get audio duration:', error);
          setFormData(prev => ({ ...prev, duration: 180 })); // Default 3 minutes
        } finally {
          setIsGettingDuration(false);
        }
      } else {
        setErrors(prev => ({ ...prev, audio: 'Please select a valid audio file (MP3, WAV, OGG, AAC, M4A, FLAC, WebM)' }));
      }
    }
  };

  const handleCoverFileSelect = async (event?: React.ChangeEvent<HTMLInputElement>) => {
    let file: File | FileUploadResult | null = null;

    if (Platform.OS === 'web' && event) {
      // Web file selection
      file = event.target.files?.[0] || null;
    } else {
      // Mobile file selection
      file = await pickImageFile();
    }

    if (file) {
      if (validateImageFile(file)) {
        setCoverFile(file);
        setErrors(prev => ({ ...prev, cover: '' }));
      } else {
        setErrors(prev => ({ ...prev, cover: 'Please select a valid image file (JPEG, JPG, PNG, GIF, WebP, SVG, BMP, TIFF)' }));
      }
    }
  };

  const handleSampleAudioSelect = (audioId: string) => {
    const sample = sampleAudioFiles.find(s => s.id === audioId);
    if (sample) {
      setSelectedSampleAudio(audioId);
      setAudioFile(null);
      setFormData(prev => ({
        ...prev,
        audioUrl: sample.url,
        duration: sample.duration,
        title: prev.title || sample.title,
      }));
      setErrors(prev => ({ ...prev, audio: '' }));
      
      // Clear file input
      if (audioInputRef.current) {
        audioInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsUploading(true);
    try {
      let audioUrl = formData.audioUrl;
      let coverArtUrl = formData.coverArt;
      let duration = formData.duration;

      // Handle sample audio
      if (selectedSampleAudio) {
        const sample = sampleAudioFiles.find(s => s.id === selectedSampleAudio);
        if (sample) {
          audioUrl = sample.url;
          duration = sample.duration;
        }
      }

      // Handle audio file upload
      if (audioFile) {
        audioUrl = await uploadFile(audioFile);
        // Duration should already be set from file selection
      }

      // Handle cover image upload
      if (coverFile) {
        coverArtUrl = await uploadFile(coverFile);
      }

      // If no cover art, use a default based on genre
      if (!coverArtUrl) {
        const genreImages: Record<string, string> = {
          'Hip Hop': 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg',
          'Electronic': 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
          'Jazz': 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg',
          'Rock': 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
          'Pop': 'https://images.pexels.com/photos/2682543/pexels-photo-2682543.jpeg',
          'Classical': 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg',
          'Chill': 'https://images.pexels.com/photos/1068989/pexels-photo-1068989.jpeg',
          'Ambient': 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg',
        };
        coverArtUrl = genreImages[formData.genre] || 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg';
      }

      const songData: Partial<Song> = {
        ...formData,
        audioUrl,
        coverArt: coverArtUrl,
        duration,
        releaseYear: formData.releaseYear ? parseInt(formData.releaseYear) : undefined,
      };

      if (mode === 'edit' && initialData) {
        songData.id = initialData.id;
      }

      onSubmit(songData);
      handleClose();
    } catch (error) {
      console.error('Error submitting song:', error);
      setErrors({ submit: 'Failed to save song. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      artist: '',
      album: '',
      genre: '',
      releaseYear: '',
      coverArt: '',
      audioUrl: '',
      duration: 0,
    });
    setAudioFile(null);
    setCoverFile(null);
    setSelectedSampleAudio('');
    setErrors({});
    onClose();
  };

  const removeAudioFile = () => {
    setAudioFile(null);
    setSelectedSampleAudio('');
    setFormData(prev => ({ ...prev, audioUrl: '', duration: 0 }));
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  const removeCoverFile = () => {
    setCoverFile(null);
    setFormData(prev => ({ ...prev, coverArt: '' }));
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  return (
    <Dialog
      isVisible={isVisible}
      onClose={handleClose}
      title={mode === 'add' ? 'Add New Song' : 'Edit Song'}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Input
          label="Title *"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          placeholder="Enter song title"
          error={errors.title}
        />
        
        <Input
          label="Artist *"
          value={formData.artist}
          onChangeText={(text) => setFormData({ ...formData, artist: text })}
          placeholder="Enter artist name"
          error={errors.artist}
        />
        
        <Input
          label="Album"
          value={formData.album}
          onChangeText={(text) => setFormData({ ...formData, album: text })}
          placeholder="Enter album name"
        />
        
        <Input
          label="Genre"
          value={formData.genre}
          onChangeText={(text) => setFormData({ ...formData, genre: text })}
          placeholder="Enter genre (e.g., Hip Hop, Jazz, Electronic)"
        />
        
        <Input
          label="Release Year"
          value={formData.releaseYear}
          onChangeText={(text) => setFormData({ ...formData, releaseYear: text })}
          placeholder="Enter release year"
          keyboardType="numeric"
          error={errors.releaseYear}
        />

        {/* Audio File Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio File * (MP3, WAV, OGG, AAC, M4A, FLAC, WebM)</Text>
          {errors.audio && <Text style={styles.errorText}>{errors.audio}</Text>}
          
          <View style={styles.uploadSection}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => Platform.OS === 'web' ? audioInputRef.current?.click() : handleAudioFileSelect()}
              disabled={isGettingDuration}
            >
              {Platform.OS === 'web' ? (
                <FileAudio size={20} color={Colors.primary.default} />
              ) : (
                <Smartphone size={20} color={Colors.primary.default} />
              )}
              <Text style={styles.uploadButtonText}>
                {isGettingDuration ? 'Processing...' : Platform.OS === 'web' ? 'Upload Audio File' : 'Select Audio from Device'}
              </Text>
              {isGettingDuration && <Clock size={16} color={Colors.primary.default} />}
            </TouchableOpacity>
            
            {Platform.OS === 'web' && (
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a,.flac,.webm"
                onChange={handleAudioFileSelect}
                style={{ display: 'none' }}
              />
            )}
            
            {audioFile && (
              <View style={styles.fileInfo}>
                <Music size={16} color={Colors.primary.default} />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName}>{audioFile.name}</Text>
                  <Text style={styles.fileSize}>
                    {audioFile.size ? formatFileSize(audioFile.size) : 'Unknown size'} • {Math.floor(formData.duration / 60)}:{(formData.duration % 60).toString().padStart(2, '0')}
                  </Text>
                </View>
                <TouchableOpacity onPress={removeAudioFile} style={styles.removeButton}>
                  <X size={16} color={Colors.error.default} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Sample Audio Selection */}
          <View style={styles.sampleSection}>
            <Text style={styles.sampleTitle}>Or choose a sample audio:</Text>
            <View style={styles.sampleGrid}>
              {sampleAudioFiles.map((sample) => (
                <TouchableOpacity
                  key={sample.id}
                  style={[
                    styles.sampleButton,
                    selectedSampleAudio === sample.id && styles.selectedSample
                  ]}
                  onPress={() => handleSampleAudioSelect(sample.id)}
                >
                  <Text style={[
                    styles.sampleButtonText,
                    selectedSampleAudio === sample.id && styles.selectedSampleText
                  ]}>
                    {sample.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Cover Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cover Image (JPEG, JPG, PNG, GIF, WebP, SVG)</Text>
          {errors.cover && <Text style={styles.errorText}>{errors.cover}</Text>}
          
          <View style={styles.uploadSection}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => Platform.OS === 'web' ? coverInputRef.current?.click() : handleCoverFileSelect()}
            >
              {Platform.OS === 'web' ? (
                <ImageIcon size={20} color={Colors.primary.default} />
              ) : (
                <Smartphone size={20} color={Colors.primary.default} />
              )}
              <Text style={styles.uploadButtonText}>
                {Platform.OS === 'web' ? 'Upload Cover Image' : 'Select Image from Device'}
              </Text>
            </TouchableOpacity>
            
            {Platform.OS === 'web' && (
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff"
                onChange={handleCoverFileSelect}
                style={{ display: 'none' }}
              />
            )}
            
            {coverFile && (
              <View style={styles.fileInfo}>
                <ImageIcon size={16} color={Colors.primary.default} />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName}>{coverFile.name}</Text>
                  <Text style={styles.fileSize}>
                    {coverFile.size ? formatFileSize(coverFile.size) : 'Unknown size'}
                  </Text>
                </View>
                <TouchableOpacity onPress={removeCoverFile} style={styles.removeButton}>
                  <X size={16} color={Colors.error.default} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <Text style={styles.helpText}>
            If no image is selected, a default cover will be used based on the genre.
          </Text>
        </View>

        {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={handleClose}
            variant="outline"
            style={styles.button}
          />
          <Button
            title={mode === 'add' ? 'Add Song' : 'Save Changes'}
            onPress={handleSubmit}
            variant="primary"
            style={styles.button}
            loading={isUploading || isGettingDuration}
          />
        </View>
      </ScrollView>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 600,
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  uploadSection: {
    marginBottom: Spacing.md,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary.default,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary.light + '10',
    gap: Spacing.xs,
  },
  uploadButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    color: Colors.primary.default,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  fileDetails: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  fileName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    color: Colors.neutral[800],
  },
  fileSize: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.xs,
    color: Colors.neutral[600],
  },
  removeButton: {
    padding: Spacing.xs,
  },
  sampleSection: {
    marginTop: Spacing.md,
  },
  sampleTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
  },
  sampleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  sampleButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    backgroundColor: Colors.neutral[50],
  },
  selectedSample: {
    borderColor: Colors.primary.default,
    backgroundColor: Colors.primary.light + '20',
  },
  sampleButtonText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.xs,
    color: Colors.neutral[700],
  },
  selectedSampleText: {
    color: Colors.primary.default,
    fontFamily: FontFamily.medium,
  },
  helpText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.xs,
    color: Colors.neutral[600],
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.xs,
    color: Colors.error.default,
    marginBottom: Spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  button: {
    minWidth: 100,
  },
});