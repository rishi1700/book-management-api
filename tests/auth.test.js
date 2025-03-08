const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/db");

let token; 

describe("🔒 Authentication & Authorization Tests", () => {
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

  test("✅ Should allow access to protected route with valid token", async () => {
    const res = await request(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test("🚨 Should deny access to protected route with missing token", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Unauthorized");
  });

  test("🚨 Should deny access with invalid token", async () => {
    const res = await request(app)
      .get("/api/books")
      .set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Unauthorized: Invalid token");
  });

  afterAll(async () => {
    try {
      await sequelize.close(); 
    } catch (err) {
      console.error("🚨 Error closing database connection:", err);
    }
  });
});
