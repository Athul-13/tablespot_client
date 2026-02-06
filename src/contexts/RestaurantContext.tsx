import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Restaurant } from '@/types/restaurant';

interface RestaurantContextValue {
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
  isLoading: boolean;
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'The Golden Fork',
    description: 'Fine dining with a modern twist. Seasonal menus and an extensive wine list.',
    cuisine: 'Contemporary',
    address: '123 Main Street',
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: '2',
    name: 'Saffron Kitchen',
    description: 'Authentic Indian cuisine in a warm, family-run setting.',
    cuisine: 'Indian',
    address: '45 Oak Avenue',
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '3',
    name: 'Harbor View Bistro',
    description: 'Fresh seafood and waterfront views. Perfect for a special evening.',
    cuisine: 'Seafood',
    address: '78 Harbor Drive',
    rating: 4.9,
    reviewCount: 203,
  },
];

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurantsState] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [isLoading] = useState(false);

  const setRestaurants = useCallback((list: Restaurant[]) => {
    setRestaurantsState(list);
  }, []);

  const value: RestaurantContextValue = {
    restaurants,
    setRestaurants,
    isLoading,
  };

  return (
    <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>
  );
}

export function useRestaurants(): RestaurantContextValue {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurants must be used within RestaurantProvider');
  return ctx;
}
