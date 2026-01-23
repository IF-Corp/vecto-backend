const admin = require('firebase-admin');

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

class FirebaseAuthService {
    constructor() {
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;

        if (!FIREBASE_PROJECT_ID) {
            console.warn('FIREBASE_PROJECT_ID not configured - Firebase auth will not work');
            return;
        }

        try {
            admin.initializeApp({
                projectId: FIREBASE_PROJECT_ID,
            });
            this.initialized = true;
            console.log('Firebase Admin SDK initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Firebase Admin:', error.message);
        }
    }

    /**
     * Verify a Firebase ID token and extract user information
     * @param {string} idToken - The Firebase ID token to verify
     * @returns {Promise<{email: string, name: string, picture: string, googleId: string}>}
     */
    async verifyToken(idToken) {
        if (!this.initialized) {
            this.initialize();
        }

        if (!this.initialized) {
            throw new Error('Firebase Admin SDK not initialized. Check FIREBASE_PROJECT_ID.');
        }

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);

            if (!decodedToken.email) {
                throw new Error('No email found in token');
            }

            return {
                googleId: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name || null,
                picture: decodedToken.picture || null,
            };
        } catch (error) {
            if (error.code === 'auth/id-token-expired') {
                throw new Error('Token expired');
            }
            if (error.code === 'auth/argument-error') {
                throw new Error('Invalid token format');
            }
            throw new Error(`Firebase token verification failed: ${error.message}`);
        }
    }
}

module.exports = new FirebaseAuthService();
