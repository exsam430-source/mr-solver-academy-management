import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes intelligently
 * Resolves conflicts (e.g., "p-2 p-4" → "p-4")
 */
export const cn = (...inputs) => twMerge(clsx(inputs));