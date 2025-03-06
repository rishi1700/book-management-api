const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/db");
const redisClient = require("../src/middlewares/redisClient"); // Import Redis client

describe("🔑 Token Validation Tests", () => {
    let expiredToken;
    let tamperedToken;

    beforeAll(() => {
        // Expired token (manually crafted for testing)
        expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQxMjk0MDEyLCJleHAiOjE3NDEyOTc2MTJ9.AOjAPrSI-0MppRXbYZI7aVhLa5Qe8LJu3VrSDsvNk-0";

        // Tampered JWT Token (signature invalid)
        tamperedToken = expiredToken.slice(0, -5) + "xxxxx";
    });

    test("🚨 Should reject expired token", async () => {
        const res = await request(app).get("/api/books").set("Authorization", `Bearer ${expiredToken}`);

        console.log("🔍 Expired Token Test Response:", res.statusCode, res.body);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("error", "Token expired");
    });

    test("🚨 Should reject tampered JWT token", async () => {
        const res = await request(app).get("/api/books").set("Authorization", `Bearer ${tamperedToken}`);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("error", "Invalid token");
    });

    // 🔴 **Close MySQL & Redis connections after all tests**
    afterAll(async () => {
        console.log("🔌 Closing MySQL and Redis connections...");
    
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to let queries finish
            await sequelize.close(); // ✅ Close MySQL connection properly
            await redisClient.quit(); // ✅ Close Redis connection properly
        } catch (err) {
            console.error("🚨 Error closing connections:", err);
        }
    });
    
    
});
