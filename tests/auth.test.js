const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/db");
const logger = require("../utils/logger");

let token;

describe("🔒 Authentication & Authorization Tests", () => {
  beforeAll(async () => {
    logger.info("Starting authentication tests");
    
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });

    token = res.body.token;
    logger.info("Test user authenticated successfully");
  });

  test("✅ Should allow access to protected route with valid token", async () => {
    logger.info("Testing access with valid token");
    const res = await request(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test("🚨 Should deny access to protected route with missing token", async () => {
    logger.warn("Testing access without token");
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Unauthorized");
  });

  test("🚨 Should deny access with invalid token", async () => {
    logger.warn("Testing access with invalid token");
    const res = await request(app)
      .get("/api/books")
      .set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Unauthorized: Invalid token");
  });

  afterAll(async () => {
    try {
      logger.info("Closing database connection after tests");
      await sequelize.close();
    } catch (err) {
      logger.error("🚨 Error closing database connection", { error: err.message });
    }
  });
});