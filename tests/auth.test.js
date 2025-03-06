const request = require('supertest');
const app = require('../src/app');

let token; // Store JWT token

describe('🔒 Authentication & Authorization Tests', () => {
    beforeAll(async () => {
        // Register a new test user
        await request(app).post("/api/auth/register").send({
            username: "testuser",
            password: "password123"
        });

        // Login to get a valid token
        const res = await request(app).post("/api/auth/login").send({
            username: "testuser",
            password: "password123"
        });

        token = res.body.token; // Store JWT token for testing
    });

    test('✅ Should allow access to protected route with valid token', async () => {
        const res = await request(app)
            .get('/api/books')
            .set("Authorization", `Bearer ${token}`);

        console.log("✅ Auth Test: Valid Token Response:", res.statusCode, res.body);
        expect(res.statusCode).toBe(200);
    });

    test('🚨 Should deny access to protected route with missing token', async () => {
        const res = await request(app).get('/api/books');

        console.log("🚨 Auth Test: Missing Token Response:", res.statusCode, res.body);
        expect(res.statusCode).toBe(401); // Ensure unauthorized error
        expect(res.body).toHaveProperty("error", "Unauthorized");
    });

    test('🚨 Should deny access with invalid token', async () => {
        const res = await request(app)
            .get('/api/books')
            .set("Authorization", "Bearer invalid_token");

        console.log("🚨 Auth Test: Invalid Token Response:", res.statusCode, res.body);
        expect(res.statusCode).toBe(403); // Ensure forbidden error
        expect(res.body).toHaveProperty("error", "Forbidden: Invalid token");
    });
});
