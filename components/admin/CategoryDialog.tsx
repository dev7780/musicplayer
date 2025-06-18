import React, { useState, useRef } from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, FontFamily, FontSizes, BorderRadius } from '@/constants/Theme';
import { Category } from '@/types/app';
import { uploadFile, validateImageFile, formatFileSize, pickImageFile, FileUploadResult } from '@/utils/fileUpload';
import { Image as ImageIcon, X, Smartphone } from 'lucide-react-native';

interface CategoryDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (category: Partial<Category>) => void;
  initialData?: Category;
  mode: 'add' | 'edit';
}

export function CategoryDialog({ isVisible, onClose, onSubmit, initialData, mode }: CategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    coverArt: initialData?.coverArt || '',
  });

  const [coverFile, setCoverFile] = useState<File | FileUploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const coverInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        setErrors(prev => ({ ...prev, cover: 'Please select a valid image file (JPEG, PNG, GIF, WebP)' }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsUploading(true);
    try {
      let coverArtUrl = formData.coverArt;

      // Handle cover image upload
      if (coverFile) {
        coverArtUrl = await uploadFile(coverFile);
      }

      // If no cover art, use a default based on category name
      if (!coverArtUrl) {
        const categoryImages: Record<string, string> = {
          'Hip Hop': 'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg',
          'Electronic': 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
          'Jazz': 'https://images.pexels.com/photos/4940600/pexels-photo-4940600.jpeg',
          'Rock': 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
          'Pop': 'https://images.pexels.com/photos/2682543/pexels-photo-2682543.jpeg',
          'Classical': 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg',
          'Chill': 'https://images.pexels.com/photos/1068989/pexels-photo-1068989.jpeg',
          'Ambient': 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg',
        };
        coverArtUrl = categoryImages[formData.name] || 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg';
      }

      const categoryData: Partial<Category> = {
        ...formData,
        coverArt: coverArtUrl,
      };

      if (mode === 'edit' && initialData) {
        categoryData.id = initialData.id;
      }

      onSubmit(categoryData);
      handleClose();
    } catch (error) {
      console.error('Error submitting category:', error);
      setErrors({ submit: 'Failed to save category. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      coverArt: '',
    });
    setCoverFile(null);
    setErrors({});
    onClose();
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
      title={mode === 'add' ? 'Add New Category' : 'Edit Category'}
    >
      <View style={styles.container}>
        <Input
          label="Category Name *"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter category name"
          error={errors.name}
        />
        
        {/* Cover Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cover Image</Text>
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
                {Platform.OS === 'web' ? 'Choose Cover Image' : 'Select Image from Device'}
              </Text>
            </TouchableOpacity>
            
            {Platform.OS === 'web' && (
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverFileSelect}
                style={{ display: 'none' }}
              />
            )}
            
            {coverFile && (
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{coverFile.name}</Text>
                <Text style={styles.fileSize}>
                  {coverFile.size ? formatFileSize(coverFile.size) : 'Unknown size'}
                </Text>
                <TouchableOpacity onPress={removeCoverFile} style={styles.removeButton}>
                  <X size={16} color={Colors.error.default} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <Text style={styles.helpText}>
            If no image is selected, a default image will be used based on the category name.
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
            title={mode === 'add' ? 'Add Category' : 'Save Changes'}
            onPress={handleSubmit}
            variant="primary"
            style={styles.button}
            loading={isUploading}
          />
        </View>
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  uploadButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    color: Colors.primary.default,
    marginLeft: Spacing.xs,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  fileName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    color: Colors.neutral[800],
    flex: 1,
  },
  fileSize: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.xs,
    color: Colors.neutral[600],
    marginRight: Spacing.sm,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  helpText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.xs,
    color: Colors.neutral[600],
    fontStyle: 'italic',
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
  },
  button: {
    minWidth: 100,
  },
});