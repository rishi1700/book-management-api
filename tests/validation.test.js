const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/db");

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database before testing
  console.log("✅ Database reset for validation tests");
});

afterAll(async () => {
  await sequelize.close(); // Close database connection
  console.log("🔌 Database connection closed after tests");
});

describe("🔐 User Validation Tests", () => {
    test("🚨 Should reject username with less than 4 characters", async () => {
        const res = await request(app).post("/api/auth/register").send({
          username: "ab", // Invalid username (too short)
          password: "StrongPass1!",
        });
      
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error.code", 400);
      
        // ✅ Fix: Match the actual error message returned by Sequelize
        expect(res.body.error.details).toContain("Username must be between 4 and 20 characters.");
      });
      
      

  test("🚨 Should reject username without alphabetic characters", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "12345678", // Invalid (No alphabetic characters)
      password: "StrongPass1!",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error.code", 400);
    expect(res.body.error.details).toContain("Username must contain at least one alphabetic character.");
  });

  test("🚨 Should reject password shorter than 8 characters", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "validUser",
      password: "Short1!", // Too short
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error.code", 400);
    expect(res.body.error.details).toContain("Password must be at least 8 characters long.");
  });

  test("🚨 Should reject password without uppercase letter", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "validUser",
      password: "lowercase1!", // No uppercase letter
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error.code", 400);
    expect(res.body.error.details).toContain(
      "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*)."
    );
  });

  test("🚨 Should reject password without a number", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "validUser",
      password: "NoNumbers!", // No numbers
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error.code", 400);
    expect(res.body.error.details).toContain(
      "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*)."
    );
  });

  test("🚨 Should reject password without a special character", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "validUser",
      password: "NoSpecial123", // No special character
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error.code", 400);
    expect(res.body.error.details).toContain(
      "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*)."
    );
  });

  test("✅ Should successfully register with a valid username & password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "ValidUser123",
      password: "ValidPass1!",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("username", "validuser123"); // Username should be converted to lowercase
  });
});
