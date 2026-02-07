import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { MainLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext.tsx';
import { useRestaurants } from '@/contexts/RestaurantContext';
import {
  getRestaurantById,
  updateRestaurant,
  toRestaurantApiError,
} from '@/api/restaurants';
import { RestaurantForm } from '@/components/restaurants/RestaurantForm';
import type { CreateRestaurantInput } from '@/types/restaurant';

export function EditRestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { fetchRestaurants } = useRestaurants();
  const [restaurant, setRestaurant] = useState<Awaited<
    ReturnType<typeof getRestaurantById>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    getRestaurantById(id)
      .then((data) => {
        if (cancelled) return;
        if (user && data.createdByUserId !== user.id) {
          setForbidden(true);
          setRestaurant(null);
        } else {
          setRestaurant(data);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (toRestaurantApiError(err).statusCode === 404) setNotFound(true);
        else toast.error(toRestaurantApiError(err).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, user, toast]);

  const handleSubmit = async (payload: CreateRestaurantInput) => {
    if (!id || !restaurant) return;
    const required = ['name', 'fullAddress', 'phone', 'cuisineType'] as const;
    const labels: Record<string, string> = {
      name: 'Name is required',
      fullAddress: 'Full address is required',
      phone: 'Phone is required',
      cuisineType: 'Cuisine type is required',
    };
    const missing = required.filter((k) => !payload[k]);
    if (missing.length > 0) {
      const errors: Record<string, string> = {};
      missing.forEach((k) => {
        errors[k] = labels[k] ?? 'Required';
      });
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await updateRestaurant(id, payload);
      await fetchRestaurants();
      toast.success('Restaurant updated');
      navigate(`/restaurants/${id}`);
    } catch (err) {
      const apiError = toRestaurantApiError(err);
      if (apiError.details) {
        const errors: Record<string, string> = {};
        for (const [key, value] of Object.entries(apiError.details)) {
          if (Array.isArray(value) && value[0]) errors[key] = value[0];
        }
        setFieldErrors(errors);
      }
      toast.error(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (notFound) {
    return (
      <MainLayout>
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom>
            Restaurant not found
          </Typography>
          <Button component={Link} to="/restaurants" variant="contained" sx={{ mt: 2 }}>
            Back to Explore
          </Button>
        </Container>
      </MainLayout>
    );
  }

  if (forbidden || !restaurant) {
    return (
      <MainLayout>
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom>
            You can only edit your own restaurants
          </Typography>
          <Button component={Link} to="/restaurants" variant="contained" sx={{ mt: 2 }}>
            Back to Explore
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container
        maxWidth="md"
        sx={{ py: { xs: 4, sm: 5, md: 6 }, px: { xs: 2, sm: 3 } }}
      >
        <RestaurantForm
          initialData={{
            name: restaurant.name,
            fullAddress: restaurant.fullAddress,
            phone: restaurant.phone,
            cuisineType: restaurant.cuisineType,
            imageUrl: restaurant.imageUrl ?? undefined,
          }}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel="Save changes"
          fieldErrors={fieldErrors}
          onCancel={() => navigate(`/restaurants/${id}`)}
          cancelLabel="Cancel"
        />
      </Container>
    </MainLayout>
  );
}
