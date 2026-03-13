import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: {
      errorMessage?: string;
    };
    mutationMeta: {
      successMessage?: string;
      errorMessage?: string;
    };
  }
}
