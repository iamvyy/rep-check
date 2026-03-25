import { ApiError } from '@/core/utils/error';
import { fetch, FetchRequestInit } from 'expo/fetch';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const linkSignals = (
  externalSignal?: AbortSignal,
  internalController?: AbortController,
) => {
  if (!externalSignal || !internalController) return null;

  const onAbort = () => internalController.abort();
  externalSignal.addEventListener('abort', onAbort);

  return () => externalSignal.removeEventListener('abort', onAbort);
};

export const createApiClient = (config: ApiClientConfig) => {
  const { baseUrl, defaultHeaders } = config;

  return async <T, B = unknown>(
    endpoint: string,
    options: RequestOptions & { body?: B } = {},
  ): Promise<T> => {
    const {
      params,
      headers,
      body,
      signal,
      timeoutMs = 10000,
      retries = 0,
      retryDelayMs = 300,
      ...customConfig
    } = options;

    const url = new URL(
      endpoint.replace(/^\//, ''),
      `${baseUrl.replace(/\/$/, '')}/`,
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const isFormData = body instanceof FormData;

    const makeRequest = async (): Promise<T> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      const cleanupSignalLink = linkSignals(signal, controller);

      const fetchConfig: FetchRequestInit = {
        ...customConfig,
        method: options.method || 'GET',
        headers: {
          ...(!isFormData && { 'Content-Type': 'application/json' }),
          ...defaultHeaders,
          ...headers,
        },
        body: isFormData
          ? (body as FormData)
          : body
            ? JSON.stringify(body)
            : undefined,
        signal: controller.signal,
      };

      try {
        const response = await fetch(url.toString(), fetchConfig);

        if (response.status === 204) {
          return {} as T;
        }

        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        const rawText = await response.text();

        if (!response.ok) {
          let errorMessage = `Error: ${response.status}`;

          if (isJson && rawText) {
            try {
              const errorData = JSON.parse(rawText);
              errorMessage =
                errorData?.message || errorData?.error || errorMessage;
            } catch {
              errorMessage = rawText;
            }
          } else if (rawText) {
            errorMessage = rawText;
          }

          throw new ApiError(errorMessage, response.status);
        }

        if (isJson && rawText) {
          return JSON.parse(rawText) as T;
        }

        return rawText as unknown as T;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          const wasTimeout = !signal?.aborted;
          throw new ApiError(
            wasTimeout ? 'Request timed out' : 'Request aborted',
            408,
          );
        }

        if (error instanceof ApiError) throw error;

        throw new ApiError(
          error instanceof Error ? error.message : 'Network request failed',
        );
      } finally {
        clearTimeout(timeoutId);
        cleanupSignalLink?.();
      }
    };

    let attempt = 0;

    while (true) {
      try {
        return await makeRequest();
      } catch (error) {
        const isLastAttempt = attempt >= retries;
        const isRetryableError =
          error instanceof ApiError &&
          error.status &&
          (error.status >= 500 || error.status === 408);

        if (isLastAttempt || !isRetryableError) {
          throw error;
        }

        attempt++;

        const jitter = Math.random() * 100;
        const delay = retryDelayMs * Math.pow(2, attempt - 1) + jitter;

        await sleep(delay);
      }
    }
  };
};

const exerciseDbClient = createApiClient({
  baseUrl: 'https://exercisedb.dev/api/v1',
  defaultHeaders: {
    Accept: 'application/json',
  },
});

export default exerciseDbClient;
