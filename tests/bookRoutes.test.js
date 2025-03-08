const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/db");
const logger = require("../utils/logger");

let token;
let bookId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  logger.info("✅ Database synced for testing");

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
  logger.info("🔌 Cleaning up after book tests...");
  await sequelize.close();
});

describe("📚 Book Management API Tests", () => {
  test("✅ Should create a new book", async () => {
    logger.info("Creating a new book test");
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "1984",
        author: "George Orwell",
        published_date: "1949-06-08",
        genre: "Dystopian",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    bookId = res.body.id;
  });

  test("🚨 Should reject creating a book with missing fields", async () => {
    logger.warn("Attempting to create a book with missing fields");
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        author: "Unknown",
        published_date: "2025-01-01",
        genre: "Fiction",
      });
    expect(res.statusCode).toBe(400);
  });

  test("🚨 Should reject updating a book with invalid data", async () => {
    logger.warn("Attempting to update a book with invalid data");
    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
        author: "New Author",
        published_date: "2025-01-01",
        genre: "Sci-Fi",
      });
    expect(res.statusCode).toBe(400);
  });

  test("🚨 Should return 404 when deleting a non-existent book", async () => {
    logger.warn("Attempting to delete a non-existent book");
    const res = await request(app)
      .delete("/api/books/999999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  test("✅ Should soft delete a book", async () => {
    logger.info("Soft deleting book", { bookId });
    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test("✅ Should return 404 for soft deleted book", async () => {
    logger.info("Fetching soft deleted book", { bookId });
    const res = await request(app)
      .get(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  test("✅ Should restore a soft deleted book", async () => {
    logger.info("Restoring soft deleted book", { bookId });
    const res = await request(app)
      .post(`/api/books/${bookId}/restore`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test("🔍 Should search books by title", async () => {
    logger.info("Searching books by title");
    await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "The Great Gatsby", author: "F. Scott Fitzgerald", published_date: "1925-04-10", genre: "Classic" });
    await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Great Expectations", author: "Charles Dickens", published_date: "1861-01-01", genre: "Classic" });
    const res = await request(app)
      .get("/api/books?title=great")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.books.length).toBeGreaterThan(0);
  });

  test("📌 Should filter books by genre", async () => {
    logger.info("Filtering books by genre");
    const res = await request(app)
      .get("/api/books?genre=Classic")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.books.every((book) => book.genre === "Classic")).toBe(true);
  });

  describe("🔒 Unauthorized Access Tests", () => {
    test("🚨 Should reject GET request without token", async () => {
      logger.warn("Attempting unauthorized GET request to books");
      const res = await request(app).get("/api/books");
      expect(res.statusCode).toBe(401);
    });

    test("🚨 Should reject POST request without token", async () => {
      logger.warn("Attempting unauthorized POST request to books");
      const res = await request(app).post("/api/books").send({
        title: "Unauthorized Book",
        author: "Unknown",
        published_date: "2025-01-01",
        genre: "Fiction",
      });
      expect(res.statusCode).toBe(401);
    });

    test("🚨 Should reject PUT request without token", async () => {
      logger.warn("Attempting unauthorized PUT request to books");
      const res = await request(app).put(`/api/books/${bookId}`).send({
        title: "Unauthorized Update",
        author: "Unknown",
        published_date: "2025-01-01",
        genre: "Sci-Fi",
      });
      expect(res.statusCode).toBe(401);
    });

    test("🚨 Should reject DELETE request without token", async () => {
      logger.warn("Attempting unauthorized DELETE request to books");
      const res = await request(app).delete(`/api/books/${bookId}`);
      expect(res.statusCode).toBe(401);
    });
  });
});
