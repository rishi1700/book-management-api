const request = require("supertest");
const app = require("../src/app");
const logger = require("../utils/logger");

let token;

describe("🚀 Rate Limiting Security Tests", () => {
  beforeAll(async () => {
    logger.info("Setting up rate limit tests");
    await request(app).post("/api/auth/register").send({ username: "testuser", password: "password123" });
    const res = await request(app).post("/api/auth/login").send({ username: "testuser", password: "password123" });
    token = res.body.token;
    logger.info("Test user authenticated successfully");
  });

  test("✅ Should block excessive requests beyond limit", async () => {
    logger.info("Testing rate limit enforcement");
    for (let i = 0; i < 100; i++) {
      await request(app).get("/api/books").set("Authorization", `Bearer ${token}`);
    }
    const res = await request(app).get("/api/books").set("Authorization", `Bearer ${token}`);
    
    logger.warn("Rate limit exceeded", { statusCode: res.statusCode });
    expect(res.statusCode).toBe(429);
    expect(res.body).toHaveProperty("error", "Too many requests from this IP, please try again later.");
  });

  test("🚨 Should prevent rate limit bypass via headers", async () => {
    logger.info("Testing rate limit bypass attempt via headers");
    const res = await request(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .set("X-Forwarded-For", "127.0.0.1"); // Fake IP attempt

    logger.warn("Rate limit bypass attempt detected", { statusCode: res.statusCode });
    expect(res.statusCode).toBe(429);
  });

  afterAll(async () => {
    logger.info("🔌 Cleaning up after rate limiting tests...");
  });
});
