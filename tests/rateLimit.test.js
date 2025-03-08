const request = require("supertest");
const app = require("../src/app");
const { redisClient } = require("../src/middlewares/rateLimitMiddleware"); // Import Redis client

let token;

describe("🚀 Rate Limiting Security Tests", () => {
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

  test("✅ Should block excessive requests beyond limit", async () => {
    for (let i = 0; i < 105; i++) {
      await request(app)
        .get("/api/books")
        .set("Authorization", `Bearer ${token}`);
    }

    const res = await request(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(429);
    expect(res.body).toHaveProperty(
      "error",
      "Too many requests from this IP, please try again later.",
    );
  });

  test("🚨 Should prevent rate limit bypass via headers", async () => {
    const res = await request(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .set("X-Forwarded-For", "127.0.0.1"); // Fake IP to attempt bypass

    expect(res.statusCode).toBe(429);
  });

  afterAll(async () => {
    console.log("🔌 Closing Redis connection...");
    if (redisClient && redisClient.quit) {
        await redisClient.quit(); // Properly close Redis
   }
});
});
