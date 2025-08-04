import { HTTPError } from "ky";

export interface APIError {
  statusCode: number;
  message: string;
  error: string;
}

export async function resolveRequest<T>(
  promise: Promise<T>,
): Promise<[T, undefined] | [undefined, APIError]> {
  try {
    const value = await promise;
    return [value, undefined];
  } catch (e) {
    console.error("API Request error:", e);

    // Handle abort errors specifically
    if (
      e instanceof HTTPError &&
      (e.name === "AbortError" || e.message.includes("aborted"))
    ) {
      const err = await e.response.json<APIError>();
      return [undefined, err];
    }

    // Handle network errors
    if (
      e instanceof HTTPError &&
      (e.message.includes("fetch") || e.message.includes("network"))
    ) {
      const err = await e.response.json<APIError>();
      return [undefined, err];
    }

    if (e instanceof HTTPError) {
      try {
        const err = await e.response.json<APIError>();
        return [undefined, err];
      } catch (jsonError) {
        console.error(jsonError);
        return [
          undefined,
          {
            statusCode: e.response.status,
            message: "Failed to parse error response",
            error: e.response.statusText,
          },
        ];
      }
    }

    return [
      undefined,
      {
        statusCode: 500,
        message: "An unexpected error occurred",
        error: e instanceof Error ? e.message : "Unknown error",
      },
    ];
  }
}
