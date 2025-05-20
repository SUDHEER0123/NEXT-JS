// hooks/useApi.ts
import { useState } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: object;
  credentials?: RequestCredentials;
  cache?: RequestCache;
}

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: <R = T>(url: string, options?: FetchOptions) => Promise<R | null>;
}

export function useApi<T = any>(): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async <R = T>(
    url: string,
    options?: FetchOptions
  ): Promise<R | null> => {
    // Set loading state
    setLoading(true);
    setError(null);

    try {
      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: options?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        credentials: options?.credentials || 'same-origin',
        cache: options?.cache || 'default',
      };

      // Add body for non-GET requests
      if (options?.body && options.method !== 'GET') {
        fetchOptions.body = JSON.stringify(options.body);
      }

      // Execute fetch
      const response = await fetch(url, fetchOptions);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // Handle text or other response types
        const text = await response.text();
        result = text as unknown as R;
      }

      // Handle error responses
      if (!response.ok) {
        throw new Error(
          result.message || result.error || `Request failed with status ${response.status}`
        );
      }

      // Update state with successful response
      setData(result as unknown as T);
      setLoading(false);
      return result as R;
    } catch (err) {
      // Handle and set error state
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return { data, loading, error, fetchData };
}

// Type utilities for API responses
export type ApiSuccessResponse<T> = {
  data: T;
  success: true;
};

export type ApiErrorResponse = {
  error: string;
  success: false;
};

export type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;