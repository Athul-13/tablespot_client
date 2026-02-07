import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Restaurant, ListRestaurantsParams } from '@/types/restaurant';
import { listRestaurants } from '@/api/restaurants';
import { toRestaurantApiError } from '@/api/restaurants';

interface RestaurantContextValue {
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
  isLoading: boolean;
  error: string | null;
  fetchRestaurants: (params?: ListRestaurantsParams) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurantsState] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setRestaurants = useCallback((list: Restaurant[]) => {
    setRestaurantsState(list);
  }, []);

  const fetchRestaurants = useCallback(
    async (params?: ListRestaurantsParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const list = await listRestaurants(params);
        setRestaurantsState(list);
      } catch (err) {
        const apiError = toRestaurantApiError(err);
        setError(apiError.message);
        setRestaurantsState([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const value: RestaurantContextValue = {
    restaurants,
    setRestaurants,
    isLoading,
    error,
    fetchRestaurants,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurants(): RestaurantContextValue {
  const ctx = useContext(RestaurantContext);
  if (!ctx)
    throw new Error('useRestaurants must be used within RestaurantProvider');
  return ctx;
}
