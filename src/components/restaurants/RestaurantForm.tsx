import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Grid,
  Stack,
} from '@mui/material';
import { Restaurant as RestaurantIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import type { CreateRestaurantInput } from '@/types/restaurant';

const CARD_SHADOW = '0 8px 24px -8px hsla(30, 10%, 12%, 0.12)';
const FALLBACK_PREVIEW =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';

/** Initial values for the form (e.g. from Restaurant for edit mode). */
export type RestaurantFormInitialData = Pick<
  CreateRestaurantInput,
  'name' | 'fullAddress' | 'phone' | 'cuisineType' | 'imageUrl'
>;

export interface RestaurantFormProps {
  initialData?: RestaurantFormInitialData;
  onSubmit: (data: CreateRestaurantInput) => void;
  isLoading?: boolean;
  submitLabel?: string;
  /** Server/validation errors keyed by field name */
  fieldErrors?: Record<string, string>;
  /** Called when user changes a field so parent can clear that field's error */
  onFieldChange?: (field: keyof CreateRestaurantInput) => void;
  /** Optional cancel button (e.g. for edit page) */
  onCancel?: () => void;
  cancelLabel?: string;
}

export function RestaurantForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Add restaurant',
  fieldErrors = {},
  onFieldChange,
  onCancel,
  cancelLabel = 'Cancel',
}: RestaurantFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    fullAddress: initialData?.fullAddress ?? '',
    phone: initialData?.phone ?? '',
    cuisineType: initialData?.cuisineType ?? '',
    imageUrl: initialData?.imageUrl ?? '',
  });

  const handleChange = (field: keyof CreateRestaurantInput) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    onFieldChange?.(field);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateRestaurantInput = {
      name: formData.name.trim(),
      fullAddress: formData.fullAddress.trim(),
      phone: formData.phone.trim(),
      cuisineType: formData.cuisineType.trim(),
      imageUrl: formData.imageUrl?.trim() || undefined,
    };
    onSubmit(payload);
  };

  const imageUrlTrimmed = formData.imageUrl?.trim();

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 4,
            background:
              'linear-gradient(135deg, hsl(24, 100%, 50%) 0%, hsl(35, 100%, 55%) 100%)',
            boxShadow: '0 0 40px hsla(24, 100%, 50%, 0.15)',
            mb: 3,
          }}
        >
          <RestaurantIcon sx={{ color: 'white', fontSize: 32 }} />
        </Box>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 1.5 }}
        >
          {initialData ? 'Edit Restaurant' : 'Add New Restaurant'}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {initialData
            ? 'Update your restaurant information below'
            : 'Share your restaurant with food lovers everywhere'}
        </Typography>
      </Box>

      {/* Form */}
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
          <TextField
            fullWidth
            label="Restaurant Name"
            name="name"
            value={formData.name}
            onChange={handleChange('name')}
            placeholder="e.g., The Golden Fork"
            required
            size="small"
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Full Address"
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange('fullAddress')}
            placeholder="123 Main Street, City, State"
            required
            size="small"
            error={!!fieldErrors.fullAddress}
            helperText={fieldErrors.fullAddress}
            sx={{ mb: 3 }}
          />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="+1 (555) 000-0000"
                required
                size="small"
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Cuisine Type"
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleChange('cuisineType')}
                placeholder="Italian, Japanese, Mexican..."
                required
                size="small"
                error={!!fieldErrors.cuisineType}
                helperText={fieldErrors.cuisineType}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Image URL (optional)"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange('imageUrl')}
            placeholder="https://example.com/restaurant-image.jpg"
            size="small"
            error={!!fieldErrors.imageUrl}
            helperText={fieldErrors.imageUrl}
            sx={{ mb: imageUrlTrimmed ? 2 : 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CloudUploadIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Image preview when URL is provided */}
          {imageUrlTrimmed && (
            <Box
              sx={{
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                height: 200,
                backgroundColor: 'action.hover',
                mb: 3,
              }}
            >
              <Box
                component="img"
                src={imageUrlTrimmed}
                alt="Restaurant preview"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_PREVIEW;
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(30, 25, 20, 0.4), transparent)',
                }}
              />
            </Box>
          )}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 1 }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ py: 1.5, flex: onCancel ? 1 : undefined }}
            >
              {isLoading ? 'Saving…' : submitLabel}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outlined"
                size="large"
                disabled={isLoading}
                onClick={onCancel}
                sx={{ flex: 1 }}
              >
                {cancelLabel}
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
