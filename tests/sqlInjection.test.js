const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/db");

let token;

beforeAll(async () => {
  // Register a new test user
  await request(app).post("/api/auth/register").send({
    username: "testuser",
    password: "password123",
  });

  // Login to get a valid token
  const res = await request(app).post("/api/auth/login").send({
    username: "testuser",
    password: "password123",
  });

  token = res.body.token; // Store JWT token for testing
});

afterAll(async () => {
  console.log("🔌 Closing MySQL and Redis connections...");
  await sequelize.close(); // ✅ Close MySQL connection
});
describe("🔐 SQL Injection Protection Tests", () => {
  test("🚨 Should prevent SQL injection attack in search", async () => {
    const res = await request(app)
      .get("/api/books?title=' OR 1=1; --")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400); // Expect bad request due to invalid input
    expect(res.body).toHaveProperty(
      "error",
      "Invalid input detected in query parameters",
    ); // ✅ Match the actual response
  });

  test("🚨 Should prevent SQL injection in ID parameter", async () => {
    const res = await request(app)
      .get("/api/books/1 OR 1=1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Invalid input detected in route parameters",
    ); // ✅ Match the actual response
  });
});