import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { MainLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRestaurants } from '@/contexts/RestaurantContext';
import {
  getRestaurantById,
  updateRestaurant,
  toRestaurantApiError,
} from '@/api/restaurants';
import type { UpdateRestaurantInput } from '@/types/restaurant';

const CARD_SHADOW = '0 8px 24px -8px hsla(30, 10%, 12%, 0.12)';

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
  const [form, setForm] = useState<UpdateRestaurantInput>({
    name: '',
    fullAddress: '',
    phone: '',
    cuisineType: '',
    imageUrl: '',
  });

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
          setForm({
            name: data.name,
            fullAddress: data.fullAddress,
            phone: data.phone,
            cuisineType: data.cuisineType,
            imageUrl: data.imageUrl ?? '',
          });
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
  }, [id, user]);

  const handleChange = (field: keyof UpdateRestaurantInput) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !restaurant) return;
    setFieldErrors({});
    const payload: UpdateRestaurantInput = {
      name: form.name?.trim(),
      fullAddress: form.fullAddress?.trim(),
      phone: form.phone?.trim(),
      cuisineType: form.cuisineType?.trim(),
      imageUrl: form.imageUrl?.trim() || undefined,
    };
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
        <Typography
          variant="h2"
          gutterBottom
          sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
        >
          Edit restaurant
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: { xs: '0.9375rem', md: '1rem' }, mb: 3 }}
        >
          Update your listing details.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            boxShadow: CARD_SHADOW,
            border: '1px solid',
            borderColor: 'divider',
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Restaurant name"
                value={form.name ?? ''}
                onChange={handleChange('name')}
                size="small"
                fullWidth
                required
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
              />
              <TextField
                label="Full address"
                value={form.fullAddress ?? ''}
                onChange={handleChange('fullAddress')}
                size="small"
                fullWidth
                required
                error={!!fieldErrors.fullAddress}
                helperText={fieldErrors.fullAddress}
              />
              <TextField
                label="Phone"
                value={form.phone ?? ''}
                onChange={handleChange('phone')}
                size="small"
                fullWidth
                required
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone}
              />
              <TextField
                label="Cuisine type"
                value={form.cuisineType ?? ''}
                onChange={handleChange('cuisineType')}
                size="small"
                fullWidth
                required
                error={!!fieldErrors.cuisineType}
                helperText={fieldErrors.cuisineType}
              />
              <TextField
                label="Image URL (optional)"
                value={form.imageUrl ?? ''}
                onChange={handleChange('imageUrl')}
                size="small"
                fullWidth
                error={!!fieldErrors.imageUrl}
                helperText={fieldErrors.imageUrl}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving…' : 'Save changes'}
                </Button>
                <Button
                  component={Link}
                  to={`/restaurants/${id}`}
                  variant="outlined"
                  size="large"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
}
