import { z } from "zod";

// Search query validation schema
export const searchQuerySchema = z
  .string()
  .trim()
  .min(2, "Search must be at least 2 characters")
  .max(200, "Search must be less than 200 characters")
  .refine(
    (val) => !/%|_/.test(val) || val.length < 50,
    "Search contains too many special characters"
  );

// Sanitize search input for SQL ILIKE patterns
export const sanitizeSearchInput = (input: string): string => {
  // Escape SQL LIKE special characters
  return input
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .trim();
};

type ValidationResult = 
  | { success: true; data: string; error?: never }
  | { success: false; error: string; data?: never };

// Validate and sanitize search query
export const validateSearchQuery = (query: string): ValidationResult => {
  const result = searchQuerySchema.safeParse(query);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }
  return { success: true, data: sanitizeSearchInput(result.data) };
};
