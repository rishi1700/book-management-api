const request = require("supertest");
const app = require("../src/app");

let token;

beforeAll(async () => {
    await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "password123",
    });

    token = res.body.token;
});

describe("🛡️ Security Tests (XSS Protection & CORS Enforcement)", () => {
    test("🚨 XSS Protection - Should sanitize input fields", async () => {
        const maliciousInput = `<script>alert('XSS');</script>`;
        const res = await request(app)
            .post("/api/books")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: maliciousInput,
                author: "Hacker",
                published_date: "2025-01-01",
                genre: "Malware",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    test("✅ CORS Enforcement - Should allow requests from allowed origins", async () => {
        const res = await request(app)
            .options("/api/books")
            .set("Origin", "http://localhost:3000");

        expect(res.headers).toHaveProperty("access-control-allow-origin", "http://localhost:3000");
    });

    test("🚨 CORS Enforcement - Should block unauthorized origins", async () => {
        const res = await request(app)
            .options("/api/books")
            .set("Origin", "http://evil-site.com");

        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty("error", "CORS not allowed");
    });
});
