import {
  WorkoutItem,
  WorkoutLogFormOutput,
} from '@/features/workout/schema/workout-schema';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

interface WorkoutState {
  workouts: WorkoutItem[];
  isLogging: boolean;
  logWorkout: (data: WorkoutLogFormOutput) => Promise<void>;
  deleteWorkout: (id: string) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  isLogging: false,
  logWorkout: async (data) => {
    set({ isLogging: true });

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newItem: WorkoutItem = {
      ...data,
      id: uuidv4(),
      date: new Date().toISOString(),
    };

    set((state) => ({
      workouts: [newItem, ...state.workouts],
      isLogging: false,
    }));
  },
  deleteWorkout: (id) => {
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    }));
  },
}));
