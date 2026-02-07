/**
 * Hardcoded cuisine type options for restaurant add/edit forms.
 * Used in dropdown/select; value is sent to the server as-is.
 */
export const CUISINE_TYPES = [
  'American',
  'Asian',
  'Barbecue',
  'Brazilian',
  'Chinese',
  'Contemporary',
  'French',
  'Greek',
  'Indian',
  'Italian',
  'Japanese',
  'Korean',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Seafood',
  'Spanish',
  'Thai',
  'Vietnamese',
  'Other',
] as const;

export type CuisineTypeOption = (typeof CUISINE_TYPES)[number];
