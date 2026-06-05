type ErrorResponseShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as ErrorResponseShape;
    return maybeError.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}
