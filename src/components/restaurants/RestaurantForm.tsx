import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Restaurant as RestaurantIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import type { CreateRestaurantInput } from '@/types/restaurant';
import { restaurantFormSchema, type RestaurantFormValues } from '@/lib/validation';
import { CUISINE_TYPES } from '@/constants/cuisineTypes';

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
  /** Server/validation errors keyed by field name (merged with form errors) */
  fieldErrors?: Record<string, string>;
  /** Optional cancel button (e.g. for edit page) */
  onCancel?: () => void;
  cancelLabel?: string;
}

const defaultValues: RestaurantFormValues = {
  name: '',
  fullAddress: '',
  phone: '',
  cuisineType: '',
  imageUrl: '',
};

export function RestaurantForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Add restaurant',
  fieldErrors = {},
  onCancel,
  cancelLabel = 'Cancel',
}: RestaurantFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name ?? '',
          fullAddress: initialData.fullAddress ?? '',
          phone: initialData.phone ?? '',
          cuisineType: initialData.cuisineType ?? '',
          imageUrl: initialData.imageUrl ?? '',
        }
      : defaultValues,
  });

  const imageUrl = watch('imageUrl');
  const imageUrlTrimmed = typeof imageUrl === 'string' ? imageUrl.trim() : '';

  const getError = (field: keyof RestaurantFormValues) =>
    errors[field]?.message ?? fieldErrors[field];

  const onValid = (data: RestaurantFormValues) => {
    onSubmit({
      name: data.name,
      fullAddress: data.fullAddress,
      phone: data.phone,
      cuisineType: data.cuisineType,
      imageUrl: data.imageUrl ?? undefined,
    });
  };

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
        <Box component="form" onSubmit={handleSubmit(onValid)} noValidate>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Restaurant Name"
                placeholder="e.g., The Golden Fork"
                required
                size="small"
                error={!!getError('name')}
                helperText={getError('name')}
                sx={{ mb: 3 }}
              />
            )}
          />

          <Controller
            name="fullAddress"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Full Address"
                placeholder="123 Main Street, City, State"
                required
                size="small"
                error={!!getError('fullAddress')}
                helperText={getError('fullAddress')}
                sx={{ mb: 3 }}
              />
            )}
          />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                    size="small"
                    error={!!getError('phone')}
                    helperText={getError('phone')}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="cuisineType"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    required
                    error={!!getError('cuisineType')}
                  >
                    <InputLabel id="cuisine-type-label">Cuisine Type</InputLabel>
                    <Select
                      {...field}
                      labelId="cuisine-type-label"
                      label="Cuisine Type"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                    >
                      <MenuItem value="">
                        <em>Select cuisine</em>
                      </MenuItem>
                      {CUISINE_TYPES.map((cuisine) => (
                        <MenuItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </MenuItem>
                      ))}
                    </Select>
                    {getError('cuisineType') && (
                      <FormHelperText>{getError('cuisineType')}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Image URL (optional)"
                type="url"
                placeholder="https://example.com/restaurant-image.jpg"
                size="small"
                error={!!getError('imageUrl')}
                helperText={getError('imageUrl')}
                sx={{ mb: imageUrlTrimmed ? 2 : 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CloudUploadIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

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
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
