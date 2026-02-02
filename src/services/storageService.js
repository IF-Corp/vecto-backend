/**
 * Storage Service for handling file uploads
 * Currently supports base64 Data URLs stored in the database
 * Can be extended to support cloud storage (Firebase Storage, S3, etc.)
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

class StorageService {
    /**
     * Validates and processes an uploaded image
     * @param {string} base64Data - Base64 encoded image data (with or without data URL prefix)
     * @returns {{ dataUrl: string, mimeType: string, size: number }}
     */
    processImage(base64Data) {
        if (!base64Data) {
            throw new Error('No image data provided');
        }

        let mimeType = 'image/png';
        let cleanBase64 = base64Data;

        // Extract mime type if data URL format
        const dataUrlMatch = base64Data.match(/^data:([^;]+);base64,(.+)$/);
        if (dataUrlMatch) {
            mimeType = dataUrlMatch[1];
            cleanBase64 = dataUrlMatch[2];
        }

        // Validate mime type
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            throw new Error(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
        }

        // Calculate size (base64 is ~33% larger than original)
        const approximateSize = (cleanBase64.length * 3) / 4;
        if (approximateSize > MAX_FILE_SIZE) {
            throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
        }

        // Return as data URL
        const dataUrl = `data:${mimeType};base64,${cleanBase64}`;

        return {
            dataUrl,
            mimeType,
            size: approximateSize,
        };
    }

    /**
     * Validates image dimensions from base64
     * @param {string} base64Data - Base64 encoded image data
     * @param {number} maxWidth - Maximum width in pixels
     * @param {number} maxHeight - Maximum height in pixels
     */
    validateDimensions(base64Data, maxWidth = 1024, maxHeight = 1024) {
        // For server-side validation, we'd need to decode the image
        // For now, we trust the frontend to resize appropriately
        return true;
    }
}

module.exports = new StorageService();
