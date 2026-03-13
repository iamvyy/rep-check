import { notify } from '@/core/utils/notifications';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const message =
        (query.meta?.errorMessage as string) ??
        error.message ??
        'An unexpected error occurred';

      notify.error('Error', message);

      if (process.env.NODE_ENV === 'development') {
        console.error(`[Query Error][${query.queryKey}]:`, error);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const message =
        (mutation.meta?.errorMessage as string) ??
        error.message ??
        'An unexpected error occurred';

      notify.error('Error', message);

      if (process.env.NODE_ENV === 'development') {
        console.error(`[Mutation Error]:`, error);
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});
