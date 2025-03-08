const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/db");
const logger = require("../utils/logger");

describe("🔑 Token Validation Tests", () => {
  let expiredToken;
  let tamperedToken;

  beforeAll(() => {
    logger.info("Setting up token validation tests");
    expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQxMjk0MDEyLCJleHAiOjE3NDEyOTc2MTJ9.AOjAPrSI-0MppRXbYZI7aVhLa5Qe8LJu3VrSDsvNk-0";
    tamperedToken = expiredToken.slice(0, -5) + "xxxxx";
  });

  test("🚨 Should reject expired token", async () => {
    logger.warn("Testing expired token rejection");
    const res = await request(app).get("/api/books").set("Authorization", `Bearer ${expiredToken}`);
    
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Token expired");
  });

  test("🚨 Should reject tampered JWT token", async () => {
    logger.warn("Testing tampered token rejection");
    const res = await request(app).get("/api/books").set("Authorization", `Bearer ${tamperedToken}`);
    
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Unauthorized: Invalid token");
  });

  afterAll(async () => {
    logger.info("🔌 Closing database connection after token validation tests");
    await sequelize.close();
  });
});
