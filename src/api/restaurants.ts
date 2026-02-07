import { apiClient } from '@/lib/axios';
import { ENDPOINTS } from '@/api/endpoints';
import type {
  Restaurant,
  CreateRestaurantInput,
  UpdateRestaurantInput,
  ListRestaurantsParams,
} from '@/types/restaurant';
import type { AxiosError } from 'axios';

export interface RestaurantApiError {
  message: string;
  statusCode: number;
  details?: Record<string, string[] | undefined>;
}

function toApiError(err: unknown): RestaurantApiError {
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

export async function listRestaurants(
  params?: ListRestaurantsParams
): Promise<Restaurant[]> {
  const res = await apiClient.get<Restaurant[]>(ENDPOINTS.RESTAURANTS.LIST, {
    params: params
      ? {
          ...(params.cuisineType != null && { cuisineType: params.cuisineType }),
          ...(params.limit != null && { limit: params.limit }),
          ...(params.offset != null && { offset: params.offset }),
        }
      : undefined,
  });
  return res.data;
}

export async function getRestaurantById(id: string): Promise<Restaurant> {
  const res = await apiClient.get<Restaurant>(ENDPOINTS.RESTAURANTS.BY_ID(id));
  return res.data;
}

export async function createRestaurant(
  data: CreateRestaurantInput
): Promise<Restaurant> {
  const res = await apiClient.post<Restaurant>(
    ENDPOINTS.RESTAURANTS.LIST,
    data
  );
  return res.data;
}

export async function updateRestaurant(
  id: string,
  data: UpdateRestaurantInput
): Promise<Restaurant> {
  const res = await apiClient.patch<Restaurant>(
    ENDPOINTS.RESTAURANTS.BY_ID(id),
    data
  );
  return res.data;
}

export async function deleteRestaurant(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.RESTAURANTS.BY_ID(id));
}

export { toApiError as toRestaurantApiError };
