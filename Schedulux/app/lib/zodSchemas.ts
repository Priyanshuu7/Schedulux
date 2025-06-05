import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

/**
 * Schema for onboarding form validation.
 * - fullName: required, 3-150 characters.
 * - userName: required, 3-150 characters, only letters, numbers, and hyphens.
 */
export const onboardingSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters").max(150, "Full name must be at most 150 characters"),
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(150, "Username must be at most 150 characters")
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Username can only contain letters, numbers, and hyphens",
    }),
});

/**
 * Server-side schema for event type creation with async URL uniqueness check.
 * - url: required, 3-150 characters, must be unique (checked server-side).
 * - title: required, 3-150 characters.
 * - duration: required, number between 1 and 100.
 * - description: required, 3-300 characters.
 * - videoCallSoftware: required, string.
 */
export function EventTypeServerSchema(options?: {
  isUrlUnique: () => Promise<boolean>;
}) {
  return z.object({
    url: z
      .string()
      .min(3, "URL must be at least 3 characters")
      .max(150, "URL must be at most 150 characters")
      .pipe(
        z.string().superRefine((_, ctx) => {
          // If no uniqueness check provided, defer to server validation
          if (typeof options?.isUrlUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }
          // Server-side async uniqueness check
          return options.isUrlUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Url is already used",
              });
            }
          });
        })
      ),
    title: z.string().min(3, "Title must be at least 3 characters").max(150, "Title must be at most 150 characters"),
    duration: z.number().min(1, "Duration must be at least 1").max(100, "Duration must be at most 100"),
    description: z.string().min(3, "Description must be at least 3 characters").max(300, "Description must be at most 300 characters"),
    videoCallSoftware: z.string(),
  });
}

/**
 * Client-side schema for event type creation (no async checks).
 */
export const eventTypeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150, "Title must be at most 150 characters"),
  duration: z.number().min(1, "Duration must be at least 1").max(100, "Duration must be at most 100"),
  url: z.string().min(3, "URL must be at least 3 characters").max(150, "URL must be at most 150 characters"),
  description: z.string().min(3, "Description must be at least 3 characters").max(300, "Description must be at most 300 characters"),
  videoCallSoftware: z.string(),
});

/**
 * Server-side onboarding schema with async username uniqueness check.
 * - userName: required, 3-150 characters, only letters, numbers, and hyphens, must be unique (checked server-side).
 * - fullName: required, 3-150 characters.
 */
export function onboardingSchemaValidation(options?: {
  isUsernameUnique: () => Promise<boolean>;
}) {
  return z.object({
    userName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(150, "Username must be at most 150 characters")
      .regex(/^[a-zA-Z0-9-]+$/, {
        message: "Username must contain only letters, numbers, and hyphens",
      })
      .pipe(
        z.string().superRefine((_, ctx) => {
          // If no uniqueness check provided, defer to server validation
          if (typeof options?.isUsernameUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }
          // Server-side async uniqueness check
          return options.isUsernameUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Username is already used",
              });
            }
          });
        })
      ),
    fullName: z.string().min(3, "Full name must be at least 3 characters").max(150, "Full name must be at most 150 characters"),
  });
}

/**
 * Schema for user settings update.
 * - fullName: required, 3-12 characters.
 * - porfileImage: required, string (URL or base64).
 */
export const SettingSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters").max(12, "Full name must be at most 12 characters"),
  porfileImage: z.string(),
});