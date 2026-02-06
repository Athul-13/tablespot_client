import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Star as StarIcon, Place as PlaceIcon } from '@mui/icons-material';
import type { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const imageUrl =
    restaurant.imageUrl ||
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop';

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
        {restaurant.cuisine && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {restaurant.cuisine}
          </Typography>
        )}
        {restaurant.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {restaurant.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
          {restaurant.rating != null && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={600}>
                {restaurant.rating}
              </Typography>
            </Box>
          )}
          {restaurant.reviewCount != null && (
            <Typography variant="body2" color="text.secondary">
              ({restaurant.reviewCount} reviews)
            </Typography>
          )}
          {restaurant.address && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
              <PlaceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {restaurant.address}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
