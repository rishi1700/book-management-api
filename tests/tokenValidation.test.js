const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/db");

describe("🔑 Token Validation Tests", () => {
  let expiredToken;
  let tamperedToken;

  beforeAll(() => {
    expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQxMjk0MDEyLCJleHAiOjE3NDEyOTc2MTJ9.AOjAPrSI-0MppRXbYZI7aVhLa5Qe8LJu3VrSDsvNk-0";
    tamperedToken = expiredToken.slice(0, -5) + "xxxxx";
  });

  test("🚨 Should reject expired token", async () => {
    const res = await request(app).get("/api/books").set("Authorization", `Bearer ${expiredToken}`);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Token expired");
  });

  test("🚨 Should reject tampered JWT token", async () => {
    const res = await request(app).get("/api/books").set("Authorization", `Bearer ${tamperedToken}`);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Unauthorized: Invalid token");
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
