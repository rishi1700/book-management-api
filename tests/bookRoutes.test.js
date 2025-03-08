const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/config/db");
const redisClient = require("../src/middlewares/redisClient"); // ✅ Import Redis client

let token; // Store JWT token
let bookId; // Store book ID for later tests

beforeAll(async () => {
  // Sync the database before running tests
  await sequelize.sync({ force: true });
  console.log("✅ Database synced for testing");

  // Register & login a test user
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

afterAll(async () => {
  console.log("🔌 Closing MySQL and Redis connections...");
  await sequelize.close(); // ✅ Close MySQL
  await redisClient.quit(); // ✅ Close Redis properly
});

describe("📚 Book Management API Tests", () => {
  test("✅ POST /api/books - Should create a new book", async () => {
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
    bookId = res.body.id; // Store book ID for later tests
  });

  test("🚨 POST /api/books - Should reject creating a book with missing fields", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        author: "Unknown", // Missing title
        published_date: "2025-01-01",
        genre: "Fiction",
      });

    console.log("🚨 Missing Fields Test Response:", res.statusCode, res.body);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "\"title\" is required"); // Updated message
});

test("🚨 PUT /api/books/:id - Should reject updating a book with invalid data", async () => {
    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "", // Invalid title
        author: "New Author",
        published_date: "2025-01-01",
        genre: "Sci-Fi",
      });

    console.log("🚨 Invalid Update Test Response:", res.statusCode, res.body);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "\"title\" is not allowed to be empty"); // Updated message
});


  test("🚨 DELETE /api/books/:id - Should return 404 when deleting a non-existent book", async () => {
    const res = await request(app)
      .delete("/api/books/999999") // Non-existent book ID
      .set("Authorization", `Bearer ${token}`);

    console.log("🚨 Delete Non-existent Book Test Response:", res.statusCode, res.body);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Book not found");
  });

  test("✅ DELETE /api/books/:id - Should soft delete a book", async () => {
    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Book soft deleted");
  });

  test("✅ GET /api/books/:id - Should return 404 for soft deleted book", async () => {
    const res = await request(app)
      .get(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test("✅ POST /api/books/:id/restore - Should restore a soft deleted book", async () => {
    const res = await request(app)
      .post(`/api/books/${bookId}/restore`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Book restored successfully");
  });

  test("🔍 GET /api/books - Should search books by title", async () => {
    await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        published_date: "1925-04-10",
        genre: "Classic",
      });

    await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Great Expectations",
        author: "Charles Dickens",
        published_date: "1861-01-01",
        genre: "Classic",
      });

    const res = await request(app)
      .get("/api/books?title=great")
      .set("Authorization", `Bearer ${token}`);

    console.log("🔍 Search Books Test Response:", res.statusCode, res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.books.length).toBeGreaterThan(0);
  });

  test("📌 GET /api/books - Should filter books by genre", async () => {
    const res = await request(app)
      .get("/api/books?genre=Classic")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.books.every((book) => book.genre === "Classic")).toBe(true);
  });

  describe("🔒 Unauthorized Access Tests", () => {
    test("🚨 GET /api/books - Should reject request without token", async () => {
      const res = await request(app).get("/api/books");
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });

    test("🚨 POST /api/books - Should reject request without token", async () => {
      const res = await request(app).post("/api/books").send({
        title: "Unauthorized Book",
        author: "Unknown",
        published_date: "2025-01-01",
        genre: "Fiction",
      });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });

    test("🚨 PUT /api/books/:id - Should reject request without token", async () => {
      const res = await request(app).put(`/api/books/${bookId}`).send({
        title: "Unauthorized Update",
        author: "Unknown",
        published_date: "2025-01-01",
        genre: "Sci-Fi",
      });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });

    test("🚨 DELETE /api/books/:id - Should reject request without token", async () => {
      const res = await request(app).delete(`/api/books/${bookId}`);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error", "Unauthorized");
    });
  });
});
