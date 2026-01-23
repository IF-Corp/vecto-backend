const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

class GoogleAuthService {
    constructor() {
        this.client = new OAuth2Client(GOOGLE_CLIENT_ID);
    }

    /**
     * Verify a Google ID token and extract user information
     * @param {string} idToken - The Google ID token to verify
     * @returns {Promise<{email: string, name: string, picture: string, googleId: string}>}
     */
    async verifyToken(idToken) {
        if (!GOOGLE_CLIENT_ID) {
            throw new Error('GOOGLE_CLIENT_ID environment variable not configured');
        }

        try {
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();

            if (!payload) {
                throw new Error('Invalid token payload');
            }

            if (!payload.email_verified) {
                throw new Error('Email not verified with Google');
            }

            return {
                googleId: payload.sub,
                email: payload.email,
                name: payload.name || null,
                picture: payload.picture || null
            };
        } catch (error) {
            if (error.message.includes('Token used too late') ||
                error.message.includes('Token used too early')) {
                throw new Error('Token expired');
            }
            if (error.message.includes('Wrong recipient')) {
                throw new Error('Invalid token audience');
            }
            throw new Error(`Google token verification failed: ${error.message}`);
        }
    }
}

module.exports = new GoogleAuthService();
