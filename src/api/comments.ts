import { apiClient } from '@/lib/axios';
import { ENDPOINTS } from '@/api/endpoints';
import type { Comment } from '@/types/restaurant';
import type { AxiosError } from 'axios';

export interface CommentApiError {
  message: string;
  statusCode: number;
  details?: Record<string, string[] | undefined>;
}

function toApiError(err: unknown): CommentApiError {
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

export async function listCommentsByRestaurant(
  restaurantId: string
): Promise<Comment[]> {
  const res = await apiClient.get<Comment[]>(
    ENDPOINTS.RESTAURANTS.COMMENTS(restaurantId)
  );
  return res.data;
}

export async function addComment(
  restaurantId: string,
  body: string
): Promise<Comment> {
  const res = await apiClient.post<Comment>(
    ENDPOINTS.RESTAURANTS.COMMENTS(restaurantId),
    { body }
  );
  return res.data;
}

export async function deleteComment(
  restaurantId: string,
  commentId: string
): Promise<void> {
  await apiClient.delete(
    ENDPOINTS.RESTAURANTS.COMMENT(restaurantId, commentId)
  );
}

export { toApiError as toCommentApiError };
