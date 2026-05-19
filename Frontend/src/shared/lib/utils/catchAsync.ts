import { signOut } from "next-auth/react";

type AsyncFn<T> = () => Promise<T>;

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
