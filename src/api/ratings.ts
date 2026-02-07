import { apiClient } from '@/lib/axios';
import { ENDPOINTS } from '@/api/endpoints';
import type { RestaurantRatingResult } from '@/types/restaurant';
import type { AxiosError } from 'axios';

export interface RatingApiError {
  message: string;
  statusCode: number;
  details?: Record<string, string[] | undefined>;
}

function toApiError(err: unknown): RatingApiError {
  const axiosError = err as AxiosError<{
    error?: string;
    details?: Record<string, string[] | undefined>;
  }>;
  const status = axiosError.response?.status ?? 500;
  const data = axiosError.response?.data;
  const message = data?.error ?? axiosError.message ?? 'Something went wrong';
  return {
    message,
    statusCode: status,
    details: data?.details,
  };
}

export async function getRating(
  restaurantId: string
): Promise<RestaurantRatingResult> {
  const res = await apiClient.get<RestaurantRatingResult>(
    ENDPOINTS.RESTAURANTS.RATINGS(restaurantId)
  );
  return res.data;
}

export async function setRating(
  restaurantId: string,
  stars: number
): Promise<{ id: string; restaurantId: string; userId: string; stars: number }> {
  const res = await apiClient.put<
    { id: string; restaurantId: string; userId: string; stars: number }
  >(ENDPOINTS.RESTAURANTS.RATINGS(restaurantId), { stars });
  return res.data;
}

export { toApiError as toRatingApiError };
