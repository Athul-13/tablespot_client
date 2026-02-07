import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Star as StarIcon, Place as PlaceIcon } from '@mui/icons-material';
import type { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop';

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const imageUrl = restaurant.imageUrl ?? FALLBACK_IMAGE;

  return (
    <Card
      component={Link}
      to={`/restaurants/${restaurant.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 16px 48px -12px rgba(0,0,0,0.16)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={restaurant.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
          {restaurant.name}
        </Typography>
        {restaurant.cuisineType && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {restaurant.cuisineType}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
          {restaurant.averageRating != null && restaurant.averageRating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={600}>
                {restaurant.averageRating.toFixed(1)}
              </Typography>
            </Box>
          )}
          {restaurant.fullAddress && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                ml: 'auto',
                minWidth: 0,
              }}
            >
              <PlaceIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {restaurant.fullAddress}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
