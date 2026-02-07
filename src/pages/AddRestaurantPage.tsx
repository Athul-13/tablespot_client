import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { MainLayout } from '@/components/layout';
import { useToast } from '@/contexts/ToastContext';
import { useRestaurants } from '@/contexts/RestaurantContext';
import { createRestaurant, toRestaurantApiError } from '@/api/restaurants';
import type { CreateRestaurantInput } from '@/types/restaurant';

const CARD_SHADOW = '0 8px 24px -8px hsla(30, 10%, 12%, 0.12)';

export function AddRestaurantPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchRestaurants } = useRestaurants();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<CreateRestaurantInput>({
    name: '',
    fullAddress: '',
    phone: '',
    cuisineType: '',
    imageUrl: '',
  });

  const handleChange = (field: keyof CreateRestaurantInput) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const payload: CreateRestaurantInput = {
      name: form.name.trim(),
      fullAddress: form.fullAddress.trim(),
      phone: form.phone.trim(),
      cuisineType: form.cuisineType.trim(),
      imageUrl: form.imageUrl?.trim() || undefined,
    };
    if (!payload.name || !payload.fullAddress || !payload.phone || !payload.cuisineType) {
      setFieldErrors({
        name: !payload.name ? 'Name is required' : '',
        fullAddress: !payload.fullAddress ? 'Full address is required' : '',
        phone: !payload.phone ? 'Phone is required' : '',
        cuisineType: !payload.cuisineType ? 'Cuisine type is required' : '',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await createRestaurant(payload);
      await fetchRestaurants();
      toast.success('Restaurant added successfully');
      navigate(`/restaurants/${created.id}`);
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
          Add a Listing
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: { xs: '0.9375rem', md: '1rem' }, mb: 3 }}
        >
          Add your restaurant so diners can discover and review it.
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
                value={form.name}
                onChange={handleChange('name')}
                size="small"
                fullWidth
                required
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
                autoComplete="organization"
              />
              <TextField
                label="Full address"
                value={form.fullAddress}
                onChange={handleChange('fullAddress')}
                size="small"
                fullWidth
                required
                error={!!fieldErrors.fullAddress}
                helperText={fieldErrors.fullAddress}
                autoComplete="street-address"
              />
              <TextField
                label="Phone"
                value={form.phone}
                onChange={handleChange('phone')}
                size="small"
                fullWidth
                required
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone}
                autoComplete="tel"
              />
              <TextField
                label="Cuisine type"
                value={form.cuisineType}
                onChange={handleChange('cuisineType')}
                size="small"
                fullWidth
                required
                error={!!fieldErrors.cuisineType}
                helperText={fieldErrors.cuisineType}
                placeholder="e.g. Italian, Indian, Contemporary"
              />
              <TextField
                label="Image URL (optional)"
                value={form.imageUrl ?? ''}
                onChange={handleChange('imageUrl')}
                size="small"
                fullWidth
                error={!!fieldErrors.imageUrl}
                helperText={fieldErrors.imageUrl}
                placeholder="https://..."
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{ mt: 1 }}
              >
                {isSubmitting ? 'Adding…' : 'Add restaurant'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
}
