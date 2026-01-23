// Test environment setup
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only-minimum-32-chars';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
process.env.PORT = '3001';

// Increase timeout for slower tests
jest.setTimeout(10000);

// Clean up after all tests
afterAll(async () => {
    // Give time for any async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));
});
