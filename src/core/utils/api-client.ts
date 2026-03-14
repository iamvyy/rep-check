import { ApiError } from '@/core/utils/error';

// Suppose to be in an environment variable, not in source code. but since its a quick mockup ill be leaving it here
const BASE_URL = 'https://exercisedb.dev/api/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { params, headers, signal, ...customConfig } = options;

  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;
  const url = new URL(`${BASE_URL}${normalizedEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal,
    ...customConfig,
  };

  try {
    const response = await fetch(url.toString(), config);

    if (!response.ok) {
      let errorMessage = `Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        /* ignore parse error */
        // Can catch in sentry
      }
      throw new ApiError(errorMessage, response.status);
    }

    const data = await response.json();

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
    );
  }
};
