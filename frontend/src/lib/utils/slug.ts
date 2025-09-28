/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

/**
 * Create a complete slug with postId in the format: {postSlug}--{postId}
 */
export function createPostSlug(title: string, postId: string): string {
	const slug = generateSlug(title);
	return `${slug}--${postId}`;
}

/**
 * Extract postId from a slug-postId combination
 * Returns the postId if found, null otherwise
 * Format: {postSlug}--{postId}
 */
export function extractPostIdFromSlug(slugWithId: string): string | null {
	// Split on the first occurrence of double hyphens
	const doubleDashIndex = slugWithId.indexOf("--");
	if (doubleDashIndex === -1 || doubleDashIndex === slugWithId.length - 2) {
		return null; // No double dash found or double dash is at the end
	}

	return slugWithId.substring(doubleDashIndex + 2);
}

/**
 * Extract the slug part (without postId) from a slug-postId combination
 */
export function extractSlugFromSlugWithId(slugWithId: string): string | null {
	const doubleDashIndex = slugWithId.indexOf("--");
	if (doubleDashIndex === -1) return null;

	return slugWithId.substring(0, doubleDashIndex);
}

/**
 * Check if a string is in the {postSlug}--{postId} format
 */
export function isSlugWithPostId(value: string): boolean {
	return value.includes("--") && extractPostIdFromSlug(value) !== null;
}

/**
 * Check if a string is likely a standalone slug (contains hyphens and lowercase)
 * vs a UUID (contains hyphens but has specific format)
 */
export function isSlug(value: string): boolean {
	// UUID pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
	const uuidPattern =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

	// If it matches UUID pattern, it's not a slug
	if (uuidPattern.test(value)) {
		return false;
	}

	// If it contains only lowercase letters, numbers, and hyphens, it's likely a slug
	return /^[a-z0-9-]+$/.test(value) && value.includes("-");
}
