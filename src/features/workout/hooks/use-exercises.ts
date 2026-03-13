import {
  exerciseApi,
  ExerciseFilters,
} from '@/features/workout/api/exercise-api';
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

export const exerciseKeys = {
  all: ['exercises'] as const,
  lists: () => [...exerciseKeys.all, 'list'] as const,
  list: (filters: ExerciseFilters) =>
    [...exerciseKeys.lists(), filters] as const,
  details: () => [...exerciseKeys.all, 'detail'] as const,
  detail: (id: string) => [...exerciseKeys.details(), id] as const,
};

export const exerciseQueries = {
  list: (filters: ExerciseFilters) =>
    queryOptions({
      queryKey: exerciseKeys.list(filters),
      queryFn: ({ signal }) => exerciseApi.getExercises(filters, signal),
    }),

  infinite: (filters: Omit<ExerciseFilters, 'offset'>) =>
    infiniteQueryOptions({
      queryKey: [...exerciseKeys.list(filters), 'infinite'],
      queryFn: ({ pageParam, signal }) =>
        exerciseApi.getExercises({ ...filters, offset: pageParam }, signal),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const metadata = (lastPage as any)?.metadata;
        if (!metadata) return undefined;

        if (metadata.nextPage === null) return undefined;

        const limit = filters.limit ?? 20;
        return (lastPage as any).data?.length < limit
          ? undefined
          : metadata.currentPage * limit;
      },
    }),
};

export const useExercises = (
  filters: ExerciseFilters = { limit: 5, offset: 0 },
) => {
  return useQuery({
    ...exerciseQueries.list(filters),
    meta: {
      errorMessage: 'Could not load exercises. Please try again.',
    },
  });
};

export const useInfiniteExercises = (
  filters: Omit<ExerciseFilters, 'offset'> = { limit: 20 },
) => {
  return useInfiniteQuery({
    ...exerciseQueries.infinite(filters),
    meta: {
      errorMessage: 'Failed to fetch more exercises.',
    },
  });
};
