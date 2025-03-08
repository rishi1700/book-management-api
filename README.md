# 📚 Book Management API

## 🚀 Overview

The **Book Management API** is a RESTful web service for managing a catalog of books. It provides full **CRUD operations**, **authentication**, **pagination**, **rate limiting**, and is **Dockerized** for easy deployment. Designed with **production-readiness**, the API is highly scalable and follows best practices for security and maintainability.

## 🔥 Features

- **CRUD Operations**: Create, Read, Update, and Delete books
- **Authentication & Authorization**: Uses JWT-based authentication
- **Input Validation**: Ensures data integrity with Joi validation
- **Security Features**:
  - SQL Injection protection
  - XSS protection
  - Rate limiting to prevent abuse
- **Soft Deletes & Restore**: Allows soft deletion and restoration of books
- **Swagger API Documentation**: Interactive API docs at `/api-docs`
- **Logging**: Winston logger for production-grade logging
- **Database Support**: Works with MySQL/PostgreSQL
- **Dockerized Deployment**: Runs in containers for easy cloud hosting
- **AWS Lambda Compatible**: Deployable as a serverless function

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL/PostgreSQL (Sequelize ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Logging**: Winston Logger
- **API Documentation**: Swagger
- **Security**: Helmet, Joi validation, Rate limiting, OWASP Security Headers
- **Deployment**: Docker, AWS Lambda (Serverless), CI/CD (GitHub Actions)
- **Testing:** Jest, Supertest

---

## 📌 API Endpoints

### 🔐 Authentication Endpoints

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/register` | Register a new user   |
| POST   | `/api/auth/login`    | Login & get JWT token |

### 📚 Book Management Endpoints

| Method | Endpoint                 | Description                               |
| ------ | ------------------------ | ----------------------------------------- |
| GET    | `/api/books`             | Get all books (with filters & pagination) |
| GET    | `/api/books/:id`         | Get a book by ID                          |
| POST   | `/api/books`             | Create a new book                         |
| PUT    | `/api/books/:id`         | Update a book                             |
| DELETE | `/api/books/:id`         | Soft delete a book                        |
| POST   | `/api/books/:id/restore` | Restore a deleted book                    |

---

## 🔧 Installation & Setup

### 🛠 Prerequisites

- **Node.js** (v18+)
- **MySQL/PostgreSQL** database
- **Docker** (optional for containerized deployment)

### 📦 Install Dependencies

```bash
npm install
```

### 📝 Setup Environment Variables

Create a `.env` file and configure:

```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=booksdb
JWT_SECRET=your_secret_key
```

### 🚀 Run API in Development Mode

```bash
npm start
```

### 🐳 Run with Docker

```bash
docker-compose up --build
```

---

## 🚀 Post-Cloning Setup (For New Users)

After cloning the repository, follow these steps to set up the project:

1️⃣ **Clone the repository:**

```bash
git clone https://github.com/your-username/book-management-api.git
cd book-management-api
```

2️⃣ **Install dependencies:**

```bash
npm install
```

3️⃣ **Create a ****************`.env`**************** file:**

```bash
cp .env.example .env
```

(Or manually create `.env` and paste variables from README.)

4️⃣ **Run database migrations & seeders (if required):**

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

5️⃣ **Start the API:**

```bash
npm start
```

Or, if using Docker:

```bash
docker-compose up --build
```

6️⃣ **Access the API in Swagger UI:**
👉 [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 🚀 Deployment

### 🆓 Free Deployment Options

- **Render**: [https://render.com/](https://render.com/)
- **Railway**: [https://railway.app/](https://railway.app/)
- **Fly.io**: [https://fly.io/](https://fly.io/)

### 🏗️ Deploying to AWS Lambda (Serverless)

```bash
zip -r deploy.zip .
aws lambda update-function-code --function-name book-api --zip-file fileb://deploy.zip
```

---

## 📖 API Documentation

After running the API, access **Swagger UI**:
👉 [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 🔥 Security & Best Practices

- **SQL Injection Prevention** ✅
- **Rate Limiting (100 reqs/15 min)** ✅
- **JWT Authentication** ✅
- **CORS Protection** ✅
- **Helmet Security Headers** ✅
- **Logging with Winston** ✅

---

## 🛠️ CI/CD & Testing

- **Automated Deployment**: GitHub Actions
- **Unit Tests**: Jest + Supertest
- **Security Tests**: SQL Injection, XSS protection

Run tests:

```bash
npm test
```

---

## 📜 License

This project is **open-source** under the MIT License.

---

## 🏆 Contributors

- **Rishi** - Developer & Security Engineer

💬 **Have questions?** Open an issue or contribute via pull requests!

🚀 **Happy Coding!**

