export interface ApiMetadata {
  currentPage: number;
  nextPage: string | null;
  previousPage: string | null;
  totalExercises: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  metadata: ApiMetadata;
}
