import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Colors, FontFamily, FontSizes, Spacing } from '@/constants/Theme';

interface DeleteDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function DeleteDialog({ isVisible, onClose, onConfirm, title, message }: DeleteDialogProps) {
  return (
    <Dialog isVisible={isVisible} onClose={onClose} title={title}>
      <View style={styles.container}>
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={onClose}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Delete"
            onPress={onConfirm}
            variant="primary"
            style={[styles.button, styles.deleteButton]}
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
  message: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.md,
    color: Colors.neutral[700],
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  button: {
    minWidth: 100,
  },
  deleteButton: {
    backgroundColor: Colors.error.default,
  },
});