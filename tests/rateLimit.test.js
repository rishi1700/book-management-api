const request = require("supertest");
const app = require("../src/app");

let token;

describe("🚀 Rate Limiting Security Tests", () => {
  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({ username: "testuser", password: "password123" });
    const res = await request(app).post("/api/auth/login").send({ username: "testuser", password: "password123" });
    token = res.body.token;
  });

  test("✅ Should block excessive requests beyond limit", async () => {
    for (let i = 0; i < 100; i++) {
      await request(app).get("/api/books").set("Authorization", `Bearer ${token}`);
    }
    const res = await request(app).get("/api/books").set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(429);
    expect(res.body).toHaveProperty("error", "Too many requests from this IP, please try again later.");
  });

  test("🚨 Should prevent rate limit bypass via headers", async () => {
    const res = await request(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .set("X-Forwarded-For", "127.0.0.1"); // Fake IP attempt

    expect(res.statusCode).toBe(429);
  });

  afterAll(async () => {
    console.log("🔌 Cleaning up after rate limiting tests...");
  });
});
