/** Restaurant as returned by list/getById (matches server RestaurantEntity + averageRating). */
export interface Restaurant {
  id: string;
  name: string;
  fullAddress: string;
  phone: string;
  cuisineType: string;
  imageUrl: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  averageRating?: number;
}

/** Payload for creating a restaurant (matches server createRestaurantSchema). */
export interface CreateRestaurantInput {
  name: string;
  fullAddress: string;
  phone: string;
  cuisineType: string;
  imageUrl?: string | null;
}

/** Payload for updating a restaurant (matches server updateRestaurantSchema). */
export interface UpdateRestaurantInput {
  name?: string;
  fullAddress?: string;
  phone?: string;
  cuisineType?: string;
  imageUrl?: string | null;
}

/** Comment as returned by listByRestaurant (matches server CommentEntity with user). */
export interface Comment {
  id: string;
  restaurantId: string;
  userId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string };
}

/** Rating summary for a restaurant (GET :restaurantId/ratings). */
export interface RestaurantRatingResult {
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
}

/** Query params for list restaurants (optional). */
export interface ListRestaurantsParams {
  cuisineType?: string;
  limit?: number;
  offset?: number;
}
