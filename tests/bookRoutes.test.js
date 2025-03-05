const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/db');

beforeAll(async () => {
    await sequelize.sync({ force: true });  // Reset database before tests
});

afterAll(async () => {
    await sequelize.close();  // Close database connection after tests
});

describe('Book Management API', () => {
    
    let bookId;

    test('POST /api/books - Should create a new book', async () => {
        const res = await request(app)
            .post('/api/books')
            .send({
                title: "1984",
                author: "George Orwell",
                published_date: "1949-06-08",
                genre: "Dystopian"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        bookId = res.body.id;  // Store book ID for later tests
    });

    test('GET /api/books - Should retrieve all books', async () => {
        const res = await request(app).get('/api/books');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('totalBooks');
        expect(res.body).toHaveProperty('totalPages');
        expect(res.body).toHaveProperty('currentPage');
        expect(res.body).toHaveProperty('books');
        expect(Array.isArray(res.body.books)).toBe(true);  // ✅ Now we check the books array
        expect(res.body.books.length).toBeGreaterThan(0);
    });
    

    test('GET /api/books/:id - Should retrieve a single book', async () => {
        const res = await request(app).get(`/api/books/${bookId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', bookId);
    });

    test('PUT /api/books/:id - Should update an existing book', async () => {
        const res = await request(app)
            .put(`/api/books/${bookId}`)
            .send({
                title: "Nineteen Eighty-Four",
                author: "George Orwell",
                published_date: "1949-06-08",
                genre: "Political Fiction"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.genre).toBe("Political Fiction");
    });

    test('DELETE /api/books/:id - Should delete a book', async () => {
        const res = await request(app).delete(`/api/books/${bookId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Book deleted');
    });

    test('GET /api/books/:id - Should return 404 for deleted book', async () => {
        const res = await request(app).get(`/api/books/${bookId}`);
        expect(res.statusCode).toBe(404);
    });

});
