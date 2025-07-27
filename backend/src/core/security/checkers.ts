import createHttpError from "http-errors";

interface Condition {
  condition: boolean;
  message?: string;
  status?: number;
}

export function check(
  conditions: boolean[],
  details = "Unauthorized : One or more conditions failed",
  status = 400,
): boolean {
  for (const condition of conditions) {
    if (!condition) {
      throw createHttpError(status, details);
    }
  }
  return true;
}

export function checkConditions(
  conditions: Condition[],
  details = "Unauthorized : One or more conditions failed",
  status = 400,
): boolean {
  for (const condition of conditions) {
    if (!condition.condition) {
      const errorMessage = condition.message || details;
      const statusCode = condition.status || status;
      throw createHttpError(statusCode, errorMessage);
    }
  }
  return true;
}
