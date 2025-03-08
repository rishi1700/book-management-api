const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/db");
const logger = require("../utils/logger");

let token;

beforeAll(async () => {
  logger.info("Setting up security tests");
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

afterAll(async () => {
  logger.info("🔌 Closing MySQL connection after security tests...");
  await sequelize.close();
});

describe("🛡️ Security Tests (XSS, CORS, SQL Injection Protection)", () => {
  // 🔐 SQL Injection Tests
  test("🚨 Should prevent SQL injection attack in search", async () => {
    logger.warn("Testing SQL injection via search query");
    const res = await request(app)
      .get("/api/books?title=' OR 1=1; --")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid input detected in query parameters");
  });

  test("🚨 Should prevent SQL injection in ID parameter", async () => {
    logger.warn("Testing SQL injection via book ID");
    const res = await request(app)
      .get("/api/books/1 OR 1=1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid input detected in route parameters");
  });

  // 🚨 XSS Protection Tests
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
  
    console.log("🚨 XSS Test Response:", res.body); // 🔍 Debug API response
    console.log("🚨 XSS Test Status:", res.statusCode);
  
    expect(res.statusCode).toBe(400); // ❌ Fails due to returning 409
    expect(res.body).toHaveProperty("error");
  });
  

  // ✅ CORS Enforcement Tests
  test("✅ CORS Enforcement - Should allow requests from allowed origins", async () => {
    logger.info("Testing CORS allowed origin");
    const res = await request(app)
      .options("/api/books")
      .set("Origin", "http://localhost:3000");

    expect(res.headers).toHaveProperty("access-control-allow-origin", "http://localhost:3000");
  });

  test("🚨 CORS Enforcement - Should block unauthorized origins", async () => {
    logger.warn("Testing CORS restriction with unauthorized origin");
    const res = await request(app)
      .options("/api/books")
      .set("Origin", "http://evil-site.com");

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "CORS not allowed");
  });
});
