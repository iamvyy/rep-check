import { ScreenWrapper } from '@/core/components/screen-wrapper';
import { useTheme } from '@/features/theme/hooks/use-theme';
import { ExerciseList } from '@/features/workout/components/exercise-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function WorkoutScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ScreenWrapper backgroundColor={colors.background} withKeyboard={false}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.borderSubtle,
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Exercise Library
        </Text>
      </View>

      <View style={styles.content}>
        <ExerciseList />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
});
