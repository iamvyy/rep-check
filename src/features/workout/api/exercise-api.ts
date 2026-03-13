import { ApiResponse } from '@/core/types/api';
import { apiClient } from '@/core/utils/api-client';
import { Exercise } from '@/features/workout/types/exercise';

export type ExerciseFilters = {
  limit?: number;
  offset?: number;
  bodyPart?: string;
};

export const exerciseApi = {
  getExercises: async (filters: ExerciseFilters, signal?: AbortSignal) => {
    const path = filters.bodyPart
      ? `/exercises/bodyPart/${filters.bodyPart}`
      : '/exercises';

    const response = await apiClient<ApiResponse<Exercise[]>>(path, {
      params: filters,
      signal,
    });

    return response;
  },
};
