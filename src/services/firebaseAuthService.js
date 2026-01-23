const admin = require('firebase-admin');

class FirebaseAuthService {
    constructor() {
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;

        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!projectId || !clientEmail || !privateKey) {
            console.warn('Firebase credentials not fully configured');
            console.warn('Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
            return;
        }

        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
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
            throw new Error('Firebase Admin SDK not initialized. Check environment variables.');
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
