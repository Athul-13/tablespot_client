export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  cuisine?: string;
  address?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}
