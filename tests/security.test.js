const request = require("supertest");
const app = require("../src/app");

let token; // Store JWT token

beforeAll(async () => {
    // Register & login a test user
    await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "password123",
    });

    token = res.body.token; // Store the token
});

describe("🛡️ Security Tests (XSS Protection & CORS Enforcement)", () => {
    test("🚨 XSS Protection - Should sanitize input fields", async () => {
        const maliciousInput = `<script>alert('XSS');</script>`;
        const res = await request(app)
            .post("/api/books")
            .set("Authorization", `Bearer ${token}`) // ✅ Use valid token
            .send({
                title: maliciousInput,
                author: "Hacker",
                published_date: "2025-01-01",
                genre: "Malware",
            });

        console.log("🔍 XSS Test Response:", res.statusCode, res.body);

        expect(res.statusCode).toBe(400); // Expecting rejection due to input validation
        expect(res.body).toHaveProperty("error"); // Ensure error message exists
    });
    test("✅ CORS Enforcement - Should allow requests from allowed origins", async () => {
        const res = await request(app)
            .options("/api/books") // Use OPTIONS request to test CORS preflight
            .set("Origin", "http://localhost:3000"); // ✅ Allowed origin
    
        console.log("✅ CORS Allowed Response:", res.statusCode, res.headers);
    
        expect(res.headers).toHaveProperty("access-control-allow-origin", "http://localhost:3000");
    });
    
});

