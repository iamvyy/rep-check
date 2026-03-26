import { FormInput } from '@/core/components/ui/form-input';
import { useTheme } from '@/features/theme/hooks/use-theme';
import {
  WorkoutLogFormInput,
  WorkoutLogFormOutput,
  WorkoutLogSchema,
} from '@/features/workout/schema/workout-schema';
import { useWorkoutStore } from '@/features/workout/store/workout-store';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function WorkoutLog() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [showWorkoutLogForm, setShowWorkoutLogForm] = useState(false);
  const { workouts, isLogging, logWorkout, deleteWorkout } = useWorkoutStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkoutLogFormInput, any, WorkoutLogFormOutput>({
    resolver: zodResolver(WorkoutLogSchema),
  });

  const onSubmit = async (data: WorkoutLogFormOutput) => {
    try {
      await logWorkout(data);
      reset();
      setShowWorkoutLogForm(false);
    } catch (error) {
      console.error('Failed to log workout:', error);
    }
  };

  const renderRightActions = (id: string) => {
    return (
      <Pressable style={styles.deleteAction} onPress={() => deleteWorkout(id)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </Pressable>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {!showWorkoutLogForm ? (
        <Pressable
          style={styles.expandButton}
          onPress={() => setShowWorkoutLogForm(true)}
        >
          <Text style={[styles.expandText, { color: colors.accent }]}>
            Add workout log
          </Text>
          <Ionicons name="add-circle" size={24} color={colors.accent} />
        </Pressable>
      ) : (
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.headerTitle}>Log Workout</Text>
            <Pressable
              onPress={() => {
                setShowWorkoutLogForm(false);
                reset(); // Reset form when closing
              }}
            >
              <Ionicons
                name="close-circle-outline"
                size={24}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          <FormInput
            control={control}
            name="name"
            label="Exercise Name"
            placeholder="e.g., Bench Press"
            error={errors.name?.message}
          />

          <FormInput
            style={styles.flexHalf}
            control={control}
            name="weight"
            label="Weight (kg/lbs)"
            placeholder="e.g., 60"
            keyboardType="numeric"
            error={errors.weight?.message}
          />

          <FormInput
            style={styles.flexHalf}
            control={control}
            name="rep"
            label="Reps"
            placeholder="e.g., 10"
            keyboardType="numeric"
            error={errors.rep?.message}
          />

          <FormInput
            control={control}
            name="notes"
            label="Notes (Optional)"
            placeholder="e.g., Felt heavy today"
            error={errors.notes?.message}
          />

          <Pressable
            style={[
              styles.submitButton,
              isLogging && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLogging}
          >
            {isLogging ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Save Log</Text>
            )}
          </Pressable>
        </View>
      )}

      <Text style={styles.listTitle}>Today&apos;s Logs</Text>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No workouts logged today.</Text>
        }
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <View style={styles.workoutItem}>
              <View>
                <Text style={styles.workoutName}>{item.name}</Text>
                <Text style={styles.workoutDetails}>
                  {item.weight} x {item.rep} reps
                </Text>
                {item.notes ? (
                  <Text style={styles.workoutNotes}>{item.notes}</Text>
                ) : null}
              </View>
            </View>
          </Swipeable>
        )}
      />
    </GestureHandlerRootView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginTop: 0,
    },
    expandButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surfaceSecondary,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
      marginBottom: 24,
      borderStyle: 'dashed',
    },
    expandText: {
      fontSize: 16,
      fontWeight: '600',
    },
    formHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    formCard: {
      backgroundColor: colors.surfaceSecondary,
      padding: 24,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    flexHalf: {
      flex: 1,
    },
    spacer: {
      width: 16,
    },
    submitButton: {
      backgroundColor: colors.accent,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    submitButtonDisabled: {
      opacity: 0.7,
    },
    submitText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    listTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    listContainer: {
      paddingBottom: 40,
    },
    workoutItem: {
      backgroundColor: colors.surfaceSecondary,
      padding: 16,
      borderRadius: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    },
    workoutName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    workoutDetails: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    workoutNotes: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 6,
      fontStyle: 'italic',
    },
    emptyText: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 20,
      fontStyle: 'italic',
    },
    deleteAction: {
      backgroundColor: colors.warning,
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      borderRadius: 16,
      marginBottom: 10,
    },
  });
