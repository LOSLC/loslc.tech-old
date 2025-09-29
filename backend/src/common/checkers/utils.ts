import { HttpException, HttpStatus } from "@nestjs/common";

export function checkConditions({
	conditions,
	statusCode = HttpStatus.BAD_REQUEST,
	message = "An unexpected error occurred",
	either = false,
}: {
	conditions: boolean[];
	statusCode?: HttpStatus;
	message?: string;
	either?: boolean;
}): void {
	const condsMet = either
		? conditions.some((cond) => cond)
		: conditions.every((cond) => cond);
	if (!condsMet) {
		throw new HttpException(message, statusCode);
	}
}

export function checkExistence<T>(
	o: T | null | undefined,
	{
		message = "Resource not found",
		statusCode = HttpStatus.NOT_FOUND,
	}: { message?: string; statusCode?: number },
): T {
	if (o === null || o === undefined) {
		throw new HttpException(message, statusCode);
	}
	return o;
}
