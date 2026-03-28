import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  MyLocation as MyLocationIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/layout';
import { useRestaurants } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import exploreHeroImage from '@/assets/explore-hero.jpg';
import { CUISINE_TYPES } from '@/constants/cuisineTypes';
import type { ListRestaurantsParams } from '@/types/restaurant';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const SEARCH_DEBOUNCE_MS = 350;

interface UserCoordinates {
  lat: number;
  lng: number;
}

export function ExplorePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { restaurants, isLoading, error, fetchRestaurants } = useRestaurants();
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const [userCoordinates, setUserCoordinates] = useState<UserCoordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLocationDenied, setIsLocationDenied] = useState(false);

  const fetchWithFilters = useCallback(
    async (
      cuisineType: string,
      coordinates?: UserCoordinates | null,
      searchQuery = ''
    ) => {
      const params: ListRestaurantsParams = {};
      const c = cuisineType.trim();
      if (c.length > 0) params.cuisineType = c;
      const q = searchQuery.trim();
      if (q.length > 0) params.q = q.slice(0, 200);
      if (coordinates) {
        params.sort = 'nearest';
        params.lat = coordinates.lat;
        params.lng = coordinates.lng;
      }
      await fetchRestaurants(Object.keys(params).length > 0 ? params : undefined);
    },
    [fetchRestaurants]
  );

  const requestLocationAndSort = useCallback(
    (showPermissionMessage: boolean) =>
      new Promise<void>((resolve) => {
        if (!navigator.geolocation) {
          if (showPermissionMessage) {
            toast.info('Location is not supported in this browser');
          }
          resolve();
          return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const nextCoordinates = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserCoordinates(nextCoordinates);
            setIsLocationDenied(false);
            setIsLocating(false);
            resolve();
          },
          () => {
            setIsLocationDenied(true);
            if (showPermissionMessage) {
              toast.info(
                'Location access is required for nearest sorting. Enable it in browser site settings and try again.'
              );
            }
            setIsLocating(false);
            resolve();
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      }),
    [toast]
  );

  const skipFilterSyncOnce = useRef(true);
  useEffect(() => {
    if (skipFilterSyncOnce.current) {
      skipFilterSyncOnce.current = false;
      return;
    }
    void fetchWithFilters(selectedCuisine, userCoordinates, debouncedSearch);
  }, [debouncedSearch, selectedCuisine, userCoordinates, fetchWithFilters]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await fetchWithFilters('', null, '');
      if (cancelled || !user) return;
      await requestLocationAndSort(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [fetchWithFilters, requestLocationAndSort, user]);

  function handleCuisineChange(nextCuisineType: string) {
    setSelectedCuisine(nextCuisineType);
  }

  const hasSearchQuery = debouncedSearch.trim().length > 0;

  return (
    <MainLayout>
      <Box sx={{ minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: '35vh', sm: '40vh', md: '45vh' },
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0 }}>
            <Box
              component="img"
              src={exploreHeroImage}
              alt="Explore restaurants"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, rgba(30, 25, 20, 0.95), rgba(30, 25, 20, 0.7), rgba(30, 25, 20, 0.3))',
              }}
            />
          </Box>

          <Container
            sx={{
              position: 'relative',
              zIndex: 10,
              pt: { xs: 9, lg: 11 },
              px: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: '1.75rem',
                  sm: '2rem',
                  md: '2.75rem',
                  lg: '3.25rem',
                },
                color: 'white',
                fontWeight: 700,
              }}
            >
              Explore Restaurants
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.85)',
                mt: 1,
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              Discover your next favorite spot
            </Typography>
          </Container>
        </Box>

        <Container
          maxWidth="lg"
          sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}
        >
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 1.5,
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <TextField
              size="small"
              placeholder="Search by name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              inputProps={{ 'aria-label': 'Search restaurants by name' }}
              sx={{
                flex: { sm: '1 1 240px' },
                minWidth: { sm: 200 },
                maxWidth: { sm: 420 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" aria-hidden />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="explore-cuisine-filter-label">
                Cuisine
              </InputLabel>
              <Select
                labelId="explore-cuisine-filter-label"
                id="explore-cuisine-filter"
                value={selectedCuisine}
                label="Cuisine"
                onChange={(e) =>
                  handleCuisineChange(String(e.target.value ?? ''))
                }
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {CUISINE_TYPES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant={isLocationDenied ? 'contained' : 'outlined'}
              size="small"
              startIcon={<MyLocationIcon />}
              disabled={isLoading || isLocating}
              onClick={() => requestLocationAndSort(true)}
            >
              {isLocating ? 'Locating...' : 'Find nearest'}
            </Button>
          </Box>

          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 8,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {!isLoading && error && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Button
                variant="outlined"
                onClick={() =>
                  fetchWithFilters(
                    selectedCuisine,
                    userCoordinates,
                    debouncedSearch
                  )
                }
              >
                Try again
              </Button>
            </Box>
          )}

          {!isLoading && !error && restaurants.length === 0 && (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography color="text.secondary">
                {hasSearchQuery
                  ? 'No restaurants match your search. Try a different name or clear the search.'
                  : 'No restaurants yet. Be the first to add one.'}
              </Typography>
              {user && (
                <Button
                  component={Link}
                  to="/add-restaurant"
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Add restaurant
                </Button>
              )}
            </Box>
          )}

          {!isLoading && !error && restaurants.length > 0 && (
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {restaurants.map((restaurant) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </MainLayout>
  );
}
