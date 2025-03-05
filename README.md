# Book Management API

## 📌 Overview
This is a **REST API** for managing a catalog of books with **full CRUD capabilities**. It is built using **Node.js, Express, Sequelize, and MySQL**. The API includes **authentication (JWT), rate limiting, soft deletes, pagination, filtering, sorting**, and **logging**.

## 🚀 Features
- **CRUD operations** for managing books.
- **MySQL Database** with Sequelize ORM.
- **Authentication** using JWT (JSON Web Token).
- **Error handling & validation** with appropriate HTTP status codes.
- **Logging** of API events and errors.
- **Rate Limiting** to prevent abuse.
- **Soft Delete** functionality instead of permanent deletion.
- **Pagination, Sorting, and Filtering** to improve usability.
- **Unit & Integration Testing** using Jest and Supertest.
- **CI/CD Pipeline** using GitHub Actions.

---

## ⚙️ Installation & Setup

### **1️⃣ Clone the repository**
```sh
git clone https://github.com/rishi1700/book-management-api.git
cd book-management-api
```

### **2️⃣ Install dependencies**
```sh
npm install
```

### **3️⃣ Create a `.env` file and configure environment variables**
```sh
cp .env.example .env
```
Edit the `.env` file and update the following:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=book_management
JWT_SECRET=your_jwt_secret
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### **4️⃣ Set up the MySQL Database**
```sh
mysql -u root -p
CREATE DATABASE book_management;
```

### **5️⃣ Run database migrations**
```sh
npm run migrate
```

### **6️⃣ Start the server**
```sh
npm start
```
Server will run on `http://localhost:5000`

---

## 📜 API Documentation

### **Authentication**
| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| POST   | `/api/auth/register`  | Register a new user     |
| POST   | `/api/auth/login`     | Login and get JWT token |

### **Books**
| Method | Endpoint            | Description                       |
|--------|---------------------|-----------------------------------|
| GET    | `/api/books`        | Retrieve all books (paginated)   |
| GET    | `/api/books/:id`    | Retrieve a single book by ID     |
| POST   | `/api/books`        | Create a new book (Auth Required) |
| PUT    | `/api/books/:id`    | Update book details (Auth Required) |
| DELETE | `/api/books/:id`    | Soft delete a book (Auth Required) |
| POST   | `/api/books/:id/restore` | Restore a soft deleted book (Auth Required) |

### **Filtering & Sorting**
- **Filter by genre:** `/api/books?genre=Classic`
- **Sort by title (ascending):** `/api/books?sortBy=title&order=ASC`
- **Search by title:** `/api/books?title=great`
- **Pagination:** `/api/books?page=1&limit=10`

---

## ✅ Running Tests
To run unit and integration tests:
```sh
npm test
```

---

## 🐳 Docker Setup (Optional)
If you want to run the API using Docker, follow these steps:

### **1️⃣ Build the Docker image**
```sh
docker build -t book-management-api .
```

### **2️⃣ Run the container**
```sh
docker run -p 5000:5000 --env-file .env book-management-api
```

### **3️⃣ Run with Docker Compose**
If using Docker Compose, start the API and database together:
```sh
docker-compose up -d
```

---

## 🛠️ Technologies Used
- **Node.js** & **Express.js** (Backend)
- **Sequelize** & **MySQL** (Database & ORM)
- **JWT Authentication** (Security)
- **Jest & Supertest** (Testing)
- **Rate Limiting** (Security & Performance)
- **Logging** with Winston (Debugging & Monitoring)
- **GitHub Actions** (CI/CD)
- **Docker** (Containerization - Optional)

---

## 📜 License
This project is licensed under the **MIT License**.

---

## ✨ Author
**Rishi** - [GitHub Profile](https://github.com/rishi1700)

