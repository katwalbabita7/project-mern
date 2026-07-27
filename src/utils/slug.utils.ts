/**
 * Generate a clean, URL-friendly slug from a string
 * @param text - The text to convert into slug
 * @returns URL-friendly slug string
 */
export const generateSlug = (text: string): string => {
    if (!text || typeof text !== 'string') {
        return '';
    }

    return text
        .trim()                          // Remove leading and trailing spaces
        .toLowerCase()                   // Convert to lowercase
        // Replace special characters with nothing (except letters, numbers, spaces, hyphens)
        .replace(/[^a-z0-9\u00C0-\u017F\s-]/g, '')
        // Replace spaces, underscores, and multiple hyphens with single hyphen
        .replace(/[\s_-]+/g, '-')
        // Remove hyphens from start and end
        .replace(/^-+|-+$/g, '');
};

/**
 * Generate unique slug (checks database for duplicates)
 * @param baseSlug - Initial slug
 * @param model - Mongoose model to check uniqueness
 * @returns Unique slug
 */
export const generateUniqueSlug = async (
    baseSlug: string,
    model: any,
    excludeId?: string
): Promise<string> => {
    let slug = generateSlug(baseSlug);
    let counter = 1;
    const originalSlug = slug;

    while (true) {
        const query: any = { slug };

        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existing = await model.findOne(query);

        if (!existing) {
            return slug;
        }

        slug = `${originalSlug}-${counter}`;
        counter++;
    }
};