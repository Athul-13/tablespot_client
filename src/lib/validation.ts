import { z } from 'zod';

// ---------------------------------------------------------------------------
// Constants (align with server / UX expectations)
// ---------------------------------------------------------------------------
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 128;
const NAME_MIN_LENGTH = 1;
const NAME_MAX_LENGTH = 200;
const EMAIL_MAX_LENGTH = 255;
const ADDRESS_MAX_LENGTH = 500;
const PHONE_MIN_LENGTH = 10;
const PHONE_MAX_LENGTH = 10;
const COMMENT_MIN_LENGTH = 1;
const COMMENT_MAX_LENGTH = 2000;
const IMAGE_URL_MAX_LENGTH = 2048;

// Phone: optional + at start, then digits, spaces, dashes, dots, parentheses (international)
const PHONE_REGEX = /^\+?[\d\s\-.()]+$/;

// ---------------------------------------------------------------------------
// Reusable field schemas
// ---------------------------------------------------------------------------
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(EMAIL_MAX_LENGTH, `Email must be at most ${EMAIL_MAX_LENGTH} characters`)
  .email('Please enter a valid email address')
  .trim()
  .toLowerCase();

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, `Password must be at most ${PASSWORD_MAX_LENGTH} characters`);

const optionalImageUrlSchema = z
  .string()
  .trim()
  .transform((s) => (s === '' ? undefined : s))
  .refine(
    (v) =>
      v === undefined ||
      (v.length <= IMAGE_URL_MAX_LENGTH && /^https?:\/\/[^\s]+$/i.test(v)),
    { message: 'Please enter a valid HTTP or HTTPS image URL' }
  );

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: z
    .string()
    .min(NAME_MIN_LENGTH, 'Name is required')
    .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters`)
    .trim()
    .refine((s) => s.length > 0, 'Name is required'),
  email: emailSchema,
  password: passwordSchema,
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => {
        if (v === undefined || v === '') return true;
        return (
          v.length >= PHONE_MIN_LENGTH &&
          v.length <= PHONE_MAX_LENGTH &&
          PHONE_REGEX.test(v)
        );
      },
      {
        message: `If provided, phone must be ${PHONE_MIN_LENGTH}–${PHONE_MAX_LENGTH} characters (numbers, +, -, ., spaces, parentheses only)`,
      }
    ),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// ---------------------------------------------------------------------------
// Restaurant
// ---------------------------------------------------------------------------
export const restaurantFormSchema = z.object({
  name: z
    .string()
    .min(NAME_MIN_LENGTH, 'Restaurant name is required')
    .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters`)
    .trim(),
  fullAddress: z
    .string()
    .min(NAME_MIN_LENGTH, 'Full address is required')
    .max(ADDRESS_MAX_LENGTH, `Address must be at most ${ADDRESS_MAX_LENGTH} characters`)
    .trim(),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .trim()
    .refine(
      (v) =>
        v.length >= PHONE_MIN_LENGTH &&
        v.length <= PHONE_MAX_LENGTH &&
        PHONE_REGEX.test(v),
      {
        message: `Enter a valid phone number (${PHONE_MIN_LENGTH}–${PHONE_MAX_LENGTH} characters, numbers and + - . ( ) only)`,
      }
    ),
  cuisineType: z
    .string()
    .min(1, 'Please select a cuisine type')
    .trim(),
  imageUrl: optionalImageUrlSchema,
});

// ---------------------------------------------------------------------------
// Comment
// ---------------------------------------------------------------------------
export const commentFormSchema = z.object({
  body: z
    .string()
    .min(COMMENT_MIN_LENGTH, 'Comment is required')
    .max(COMMENT_MAX_LENGTH, `Comment must be at most ${COMMENT_MAX_LENGTH} characters`)
    .trim(),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;
export type CommentFormValues = z.infer<typeof commentFormSchema>;
