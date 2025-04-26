/**
 * Utility functions for handling API responses and errors
 */

/**
 * Handle API errors in a consistent way
 * @param error The error object from the API call
 * @param toast Optional toast function to display error messages
 * @returns The error message
 */
export const handleApiError = (error: any, toast?: any): string => {
  console.error('API Error:', error);
  
  let errorMessage = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.data && error.response.data.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response.status === 401) {
      errorMessage = 'غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.';
    } else if (error.response.status === 403) {
      errorMessage = 'ليس لديك صلاحيات كافية للقيام بهذه العملية.';
    } else if (error.response.status === 404) {
      errorMessage = 'لم يتم العثور على المورد المطلوب.';
    } else if (error.response.status === 500) {
      errorMessage = 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقًا.';
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'لم يتم تلقي استجابة من الخادم. يرجى التحقق من اتصالك بالإنترنت.';
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message || errorMessage;
  }
  
  if (toast) {
    toast({
      title: 'خطأ',
      description: errorMessage,
      variant: 'destructive',
    });
  }
  
  return errorMessage;
};

/**
 * Format API request parameters
 * @param params Object containing parameters
 * @returns Formatted URL parameters string
 */
export const formatParams = (params: Record<string, any>): string => {
  const validParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${key}=${encodeURIComponent(v)}`).join('&');
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');
  
  return validParams ? `?${validParams}` : '';
};

/**
 * Get base API URL based on environment
 * @returns The base API URL
 */
export const getApiBaseUrl = (): string => {
  // Use environment variable if available
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Default to production URL if not in development
  if (import.meta.env.PROD) {
    return 'https://mihwaralarab-1072625241731.me-central1.run.app/';
  }
  
  // Use new URL for development as well, unless overridden by VITE_API_BASE_URL
  return 'https://mihwaralarab-1072625241731.me-central1.run.app';
};
