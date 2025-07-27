import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

export async function safeQuery<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(error);
    throw createHttpError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
    );
  }
}
