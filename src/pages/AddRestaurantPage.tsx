import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { MainLayout } from '@/components/layout';
import { useToast } from '@/contexts/ToastContext.tsx';
import { useRestaurants } from '@/contexts/RestaurantContext';
import { createRestaurant, toRestaurantApiError } from '@/api/restaurants';
import { RestaurantForm } from '@/components/restaurants/RestaurantForm';
import type { CreateRestaurantInput } from '@/types/restaurant';

export function AddRestaurantPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchRestaurants } = useRestaurants();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (payload: CreateRestaurantInput) => {
    if (!payload.name || !payload.fullAddress || !payload.phone || !payload.cuisineType) {
      setFieldErrors({
        name: !payload.name ? 'Name is required' : '',
        fullAddress: !payload.fullAddress ? 'Full address is required' : '',
        phone: !payload.phone ? 'Phone is required' : '',
        cuisineType: !payload.cuisineType ? 'Cuisine type is required' : '',
      });
      return;
    }
    setFieldErrors({});
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
        <RestaurantForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel="Add restaurant"
          fieldErrors={fieldErrors}
          onFieldChange={(field) =>
            setFieldErrors((prev) => ({ ...prev, [field]: '' }))
          }
        />
      </Container>
    </MainLayout>
  );
}
