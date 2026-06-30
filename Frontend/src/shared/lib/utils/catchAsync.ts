import { signOut } from "next-auth/react";

type AsyncFn<T> = () => Promise<T>;

/**
 * Wraps an async function and returns a normalised `{ success, data, error }`
 * object so callers never have to handle uncaught promise rejections.
 */
export async function catchAsync<T>(fn: AsyncFn<T>) {
  try {
    const data = await fn();

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
