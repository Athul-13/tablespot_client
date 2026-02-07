import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  Rating as MuiRating,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Star as StarIcon,
  Place as PlaceIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getRestaurantById, deleteRestaurant, toRestaurantApiError } from '@/api/restaurants';
import { getRating, setRating, toRatingApiError } from '@/api/ratings';
import {
  listCommentsByRestaurant,
  addComment,
  deleteComment,
  toCommentApiError,
} from '@/api/comments';
import type { Restaurant } from '@/types/restaurant';
import type { RestaurantRatingResult } from '@/types/restaurant';
import type { Comment } from '@/types/restaurant';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop';
const CARD_SHADOW = '0 8px 24px -8px hsla(30, 10%, 12%, 0.12)';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: 'medium',
    });
  } catch {
    return iso;
  }
}

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [ratingResult, setRatingResult] = useState<RestaurantRatingResult | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [userStars, setUserStars] = useState<number>(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletingRestaurant, setDeletingRestaurant] = useState(false);

  const isOwner = user && restaurant && restaurant.createdByUserId === user.id;
  const canRateOrComment = user && !isOwner;

  const loadData = async (restaurantId: string) => {
    setLoading(true);
    setNotFound(false);
    try {
      const [restaurantRes, ratingRes, commentsRes] = await Promise.all([
        getRestaurantById(restaurantId),
        getRating(restaurantId),
        listCommentsByRestaurant(restaurantId),
      ]);
      setRestaurant(restaurantRes);
      setRatingResult(ratingRes);
      setComments(commentsRes);
      setUserStars(ratingRes.userRating ?? 0);
    } catch (err) {
      const apiError = toRestaurantApiError(err);
      if (apiError.statusCode === 404) setNotFound(true);
      else toast.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    loadData(id);
  }, [id]);

  const handleSetRating = async (stars: number) => {
    if (!id || !user || submittingRating) return;
    setSubmittingRating(true);
    try {
      await setRating(id, stars);
      const next = await getRating(id);
      setRatingResult(next);
      setUserStars(next.userRating ?? 0);
      if (restaurant) {
        setRestaurant((prev) =>
          prev ? { ...prev, averageRating: next.averageRating } : null
        );
      }
      toast.success('Rating saved');
    } catch (err) {
      toast.error(toRatingApiError(err).message);
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentBody.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const created = await addComment(id, commentBody.trim());
      setComments((prev) => [created, ...prev]);
      setCommentBody('');
      toast.success('Comment added');
    } catch (err) {
      toast.error(toCommentApiError(err).message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id || deletingId) return;
    setDeletingId(commentId);
    try {
      await deleteComment(id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('Comment removed');
    } catch (err) {
      toast.error(toCommentApiError(err).message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!id || !deleteConfirm || deletingRestaurant) return;
    setDeletingRestaurant(true);
    try {
      await deleteRestaurant(id);
      toast.success('Restaurant removed');
      navigate('/profile');
    } catch (err) {
      toast.error(toRestaurantApiError(err).message);
    } finally {
      setDeletingRestaurant(false);
      setDeleteConfirm(false);
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

  if (notFound || !restaurant) {
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

  const imageUrl = restaurant.imageUrl ?? FALLBACK_IMAGE;

  return (
    <MainLayout>
      <Box sx={{ minHeight: '100vh' }}>
        <Box
          sx={{
            position: 'relative',
            height: { xs: 220, sm: 280, md: 320 },
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={restaurant.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(30,25,20,0.9) 0%, transparent 50%)',
            }}
          />
          <Container
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              pb: 2,
              px: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              }}
            >
              {restaurant.name}
            </Typography>
            {restaurant.cuisineType && (
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
                {restaurant.cuisineType}
              </Typography>
            )}
          </Container>
        </Box>

        <Container
          maxWidth="md"
          sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}
        >
          <Stack spacing={3}>
            {/* Info block */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '16px',
                boxShadow: CARD_SHADOW,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack spacing={1.5}>
                {restaurant.fullAddress && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PlaceIcon color="action" sx={{ fontSize: 20 }} />
                    <Typography>{restaurant.fullAddress}</Typography>
                  </Box>
                )}
                {restaurant.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" sx={{ fontSize: 20 }} />
                    <Typography>{restaurant.phone}</Typography>
                  </Box>
                )}
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <StarIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                <Typography fontWeight={600}>
                  {ratingResult
                    ? ratingResult.averageRating > 0
                      ? ratingResult.averageRating.toFixed(1)
                      : '—'
                    : '—'}
                </Typography>
                {ratingResult && ratingResult.totalRatings > 0 && (
                  <Typography color="text.secondary" variant="body2">
                    ({ratingResult.totalRatings} review
                    {ratingResult.totalRatings !== 1 ? 's' : ''})
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Owner actions */}
            {isOwner && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to={`/restaurants/${id}/edit`}
                  variant="contained"
                  startIcon={<EditIcon />}
                >
                  Edit restaurant
                </Button>
                {!deleteConfirm ? (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteConfirm(true)}
                  >
                    Delete restaurant
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Sure?
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      disabled={deletingRestaurant}
                      onClick={handleDeleteRestaurant}
                    >
                      {deletingRestaurant ? 'Deleting…' : 'Yes, delete'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Stack>
            )}

            {/* Rate (non-owner, logged in) */}
            {canRateOrComment && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  boxShadow: CARD_SHADOW,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Your rating
                </Typography>
                <MuiRating
                  value={userStars}
                  max={5}
                  size="large"
                  onChange={(_, value) => {
                    const stars = value ?? 0;
                    if (stars >= 1 && stars <= 5) handleSetRating(stars);
                  }}
                  disabled={submittingRating}
                />
              </Paper>
            )}

            {/* Comments */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '16px',
                boxShadow: CARD_SHADOW,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Comments
              </Typography>
              {canRateOrComment && (
                <Box
                  component="form"
                  onSubmit={handleAddComment}
                  sx={{ mb: 2 }}
                >
                  <TextField
                    label="Add a comment"
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    multiline
                    rows={3}
                    size="small"
                    fullWidth
                    disabled={submittingComment}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!commentBody.trim() || submittingComment}
                  >
                    {submittingComment ? 'Posting…' : 'Post comment'}
                  </Button>
                </Box>
              )}
              {comments.length === 0 ? (
                <Typography color="text.secondary" variant="body2">
                  No comments yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {comments.map((c) => (
                    <Box
                      key={c.id}
                      sx={{
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {c.user?.name ?? 'Anonymous'}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block' }}
                          >
                            {formatDate(c.createdAt)}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {c.body}
                          </Typography>
                        </Box>
                        {user && c.userId === user.id && (
                          <IconButton
                            size="small"
                            color="error"
                            aria-label="Delete comment"
                            disabled={deletingId === c.id}
                            onClick={() => handleDeleteComment(c.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Stack>
        </Container>
      </Box>
    </MainLayout>
  );
}
