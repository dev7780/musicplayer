import React, { useState, useRef } from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity, Switch } from 'react-native';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, FontFamily, FontSizes, BorderRadius } from '@/constants/Theme';
import { User } from '@/types/app';
import { uploadFile, validateImageFile, formatFileSize, pickImageFile, FileUploadResult } from '@/utils/fileUpload';
import { Image as ImageIcon, X, Smartphone } from 'lucide-react-native';

interface UserDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (user: Partial<User>) => void;
  initialData?: User;
  mode: 'add' | 'edit';
}

export function UserDialog({ isVisible, onClose, onSubmit, initialData, mode }: UserDialogProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    isAdmin: initialData?.isAdmin || false,
    profilePic: initialData?.profilePic || '',
  });

  const [profileFile, setProfileFile] = useState<File | FileUploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const profileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (mode === 'add' && !formData.password) {
      newErrors.password = 'Password is required for new users';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileFileSelect = async (event?: React.ChangeEvent<HTMLInputElement>) => {
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
        setProfileFile(file);
        setErrors(prev => ({ ...prev, profile: '' }));
      } else {
        setErrors(prev => ({ ...prev, profile: 'Please select a valid image file (JPEG, PNG, GIF, WebP)' }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsUploading(true);
    try {
      let profilePicUrl = formData.profilePic;

      // Handle profile image upload
      if (profileFile) {
        profilePicUrl = await uploadFile(profileFile);
      }

      // If no profile pic, use a default avatar
      if (!profilePicUrl) {
        const avatarNumber = Math.floor(Math.random() * 99) + 1;
        const gender = Math.random() > 0.5 ? 'men' : 'women';
        profilePicUrl = `https://randomuser.me/api/portraits/${gender}/${avatarNumber}.jpg`;
      }

      const userData: Partial<User> = {
        name: formData.name,
        email: formData.email.toLowerCase(),
        isAdmin: formData.isAdmin,
        profilePic: profilePicUrl,
      };

      // Only include password if it's provided
      if (formData.password) {
        userData.password = formData.password;
      }

      if (mode === 'edit' && initialData) {
        userData.id = initialData.id;
      }

      onSubmit(userData);
      handleClose();
    } catch (error) {
      console.error('Error submitting user:', error);
      setErrors({ submit: 'Failed to save user. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      isAdmin: false,
      profilePic: '',
    });
    setProfileFile(null);
    setErrors({});
    onClose();
  };

  const removeProfileFile = () => {
    setProfileFile(null);
    setFormData(prev => ({ ...prev, profilePic: '' }));
    if (profileInputRef.current) {
      profileInputRef.current.value = '';
    }
  };

  return (
    <Dialog
      isVisible={isVisible}
      onClose={handleClose}
      title={mode === 'add' ? 'Add New User' : 'Edit User'}
    >
      <View style={styles.container}>
        <Input
          label="Name *"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter user name"
          error={errors.name}
        />
        
        <Input
          label="Email *"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Enter email address"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        
        <Input
          label={mode === 'add' ? 'Password *' : 'Password (leave empty to keep current)'}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          placeholder="Enter password"
          secureTextEntry
          error={errors.password}
        />

        {/* Admin Toggle */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Admin User</Text>
          <Switch
            value={formData.isAdmin}
            onValueChange={(value) => setFormData({ ...formData, isAdmin: value })}
            trackColor={{ false: Colors.neutral[300], true: Colors.primary.light }}
            thumbColor={formData.isAdmin ? Colors.primary.default : Colors.neutral[500]}
          />
        </View>
        
        {/* Profile Picture Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          {errors.profile && <Text style={styles.errorText}>{errors.profile}</Text>}
          
          <View style={styles.uploadSection}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => Platform.OS === 'web' ? profileInputRef.current?.click() : handleProfileFileSelect()}
            >
              {Platform.OS === 'web' ? (
                <ImageIcon size={20} color={Colors.primary.default} />
              ) : (
                <Smartphone size={20} color={Colors.primary.default} />
              )}
              <Text style={styles.uploadButtonText}>
                {Platform.OS === 'web' ? 'Choose Profile Picture' : 'Select Image from Device'}
              </Text>
            </TouchableOpacity>
            
            {Platform.OS === 'web' && (
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileFileSelect}
                style={{ display: 'none' }}
              />
            )}
            
            {profileFile && (
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{profileFile.name}</Text>
                <Text style={styles.fileSize}>
                  {profileFile.size ? formatFileSize(profileFile.size) : 'Unknown size'}
                </Text>
                <TouchableOpacity onPress={removeProfileFile} style={styles.removeButton}>
                  <X size={16} color={Colors.error.default} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <Text style={styles.helpText}>
            If no image is selected, a random avatar will be assigned.
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
            title={mode === 'add' ? 'Add User' : 'Save Changes'}
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    marginBottom: Spacing.md,
  },
  switchLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.md,
    color: Colors.neutral[800],
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