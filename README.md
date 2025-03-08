### **📘 Book Management API**

This is a **RESTful API** for managing books with features like **CRUD operations, authentication, SQL injection protection, rate limiting, and token validation**.

---

## **🚀 Features**

- 🔐 **User Authentication** (JWT-based)
- 📚 **Book Management** (Create, Read, Update, Delete)
- 🔄 **Soft Delete & Restore**
- 🛡️ **SQL Injection Protection**
- 🚀 **Rate Limiting with Redis**
- ✅ **Unit & Integration Testing (Jest & Supertest)**

---

## **🛠️ Tech Stack**

- **Backend**: Node.js, Express.js
- **Database**: MySQL + Sequelize ORM
- **Authentication**: JWT
- **Caching & Rate Limit**: Redis
- **Testing**: Jest, Supertest
- **Security**: SQL Injection Prevention, Rate Limiting

---

## **📦 Installation**

### **1️⃣ Clone the repository**

```sh
git clone https://github.com/rishi1700/book-management-api.git
cd book-management-api
```

### **2️⃣ Install dependencies**

```sh
npm install
```

### **3️⃣ Set up environment variables**

Create a `.env` file in the root directory:

```
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=yourpassword
DB_NAME=book_management

# JWT
JWT_SECRET=your_jwt_secret

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### **4️⃣ Start MySQL & Redis**

Ensure **MySQL** and **Redis** are running locally:

```sh
# Start MySQL
sudo service mysql start

# Start Redis
redis-server
```

### **5️⃣ Run the server**

```sh
npm start
```

---

## **📌 API Endpoints**

### **🔑 Authentication**

| Method | Endpoint             | Description           | Auth Required |
| ------ | -------------------- | --------------------- | ------------- |
| POST   | `/api/auth/register` | Register new user     | ❌ No         |
| POST   | `/api/auth/login`    | Login & get JWT token | ❌ No         |

### **📚 Book Management**

| Method | Endpoint                 | Description                 | Auth Required |
| ------ | ------------------------ | --------------------------- | ------------- |
| POST   | `/api/books`             | Add a new book              | ✅ Yes        |
| GET    | `/api/books`             | Get all books               | ✅ Yes        |
| GET    | `/api/books/:id`         | Get book by ID              | ✅ Yes        |
| PUT    | `/api/books/:id`         | Update book details         | ✅ Yes        |
| DELETE | `/api/books/:id`         | Soft delete a book          | ✅ Yes        |
| POST   | `/api/books/:id/restore` | Restore a soft deleted book | ✅ Yes        |

### **🛡️ Security**

| Feature                      | Description                 |
| ---------------------------- | --------------------------- |
| **SQL Injection Protection** | Blocks malicious queries    |
| **Rate Limiting (Redis)**    | Prevents excessive requests |
| **JWT Authentication**       | Secures endpoints           |

---

## **🧪 Running Tests**

We have **comprehensive tests** for all critical features.

### **1️⃣ Run all tests**

```sh
npm test
```

### **2️⃣ Run specific test files**

```sh
npm test -- tests/auth.test.js            # Authentication tests
npm test -- tests/sqlInjection.test.js    # SQL Injection protection tests
npm test -- tests/rateLimit.test.js       # Rate Limiting tests
npm test -- tests/tokenValidation.test.js # Token validation tests
npm test -- tests/bookRoutes.test.js      # Book API tests
```

---

## **📌 Additional Notes**

- If you're **using Docker**, make sure **MySQL & Redis** are configured inside the container.
- For **production**, consider using **secure JWT secrets** and **stronger rate-limiting policies**.
- Contributions & suggestions are welcome! 🚀

---

## **👨‍💻 Author**

📌 **Rishi**  
💼 **GitHub**: [your-profile](https://github.com/rishi1700)  
📩 **Email**: prasadrishi170@gmail.com

---

🔥 **Happy Coding!** 🚀
