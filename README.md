Here is the updated **README** file with the **Docker configuration section removed**, as it's already in the repo.

---

# 📚 Book Management API

This API provides a RESTful interface for managing a book catalog, including CRUD operations, authentication, validation, and security features.

## 🚀 Features
- User Authentication (JWT-based)
- CRUD operations for books
- Input validation and SQL injection protection
- Rate limiting to prevent abuse
- Secure password hashing
- Logging with Winston
- API documentation using Swagger
- MySQL database support with Sequelize ORM
- Dockerized environment for easy deployment
- Unit & Integration Testing with Jest & Supertest
- CI/CD setup using GitHub Actions

---

## 🔥 Prerequisites
Before running the API, ensure you have the following installed:

✅ [Node.js (v18+)](https://nodejs.org/)  
✅ [Docker & Docker Compose](https://www.docker.com/)  
✅ [Git](https://git-scm.com/)  
✅ MySQL (for local setup without Docker)  
✅ `cross-env` for Windows users (for running tests)  

---

## 🛠️ How to Run the API

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/book-management-api.git
cd book-management-api
```

### **2️⃣ Set Up Environment Variables**
Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```plaintext
NODE_ENV=production
DB_NAME=book_management
DB_USER=rishi
DB_PASS=P@ssw0rd
DB_HOST=mysql  # ⬅ Use `mysql` for Docker
DB_PORT=3306
JWT_SECRET=your_secret_key
```

---

## 🛠️ Running API with Docker

### **3️⃣ Run MySQL & API in Docker**
```bash
docker-compose up --build
```

### **4️⃣ Apply Database Migrations Inside Docker**
```bash
docker exec -it book-api npx sequelize-cli db:migrate
```

---

## 🛠️ Running Tests (Windows Users Must Install `cross-env`)

### **Linux/macOS**
```bash
npm test
```

### **Windows (Fix 'NODE_ENV is not recognized' Error)**
1️⃣ Install `cross-env` as a dependency:
```powershell
npm install cross-env --save-dev
```

2️⃣ Modify the `package.json` test script:
- Open `package.json` and find the `scripts` section.
- Change the test script **from**:
  ```json
  "test": "NODE_ENV=test jest --detectOpenHandles --forceExit"
  ```
  **To:**
  ```json
  "test": "cross-env NODE_ENV=test jest --detectOpenHandles --forceExit"
  ```

3️⃣ Run the tests again:
```powershell
npm test
```
✅ This will now **work on Windows**.

Alternatively, manually set the environment variable in PowerShell:
```powershell
$env:NODE_ENV="test"; npm test
```
✅ This **sets `NODE_ENV=test` just for this command.**

---

## 🛠️ **Running Without Docker (Manually on Local Machine)**

### **1️⃣ Install Dependencies**
```bash
npm install
```

### **2️⃣ Start MySQL Manually**
Ensure MySQL is running locally on **port `3306`** and update your `.env` file:
```plaintext
DB_HOST=127.0.0.1  # ⬅ Use this for local MySQL
```

### **3️⃣ Apply Migrations**
```bash
npx sequelize-cli db:migrate
```

### **4️⃣ Start the API**
```bash
npm start
```

---

## 📌 API Endpoints

| HTTP Method | Endpoint | Description |
|------------|----------|-------------|
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Login and get a JWT token |
| **GET** | `/api/books` | Get all books (with filtering, sorting, pagination) |
| **GET** | `/api/books/:id` | Get a book by ID |
| **POST** | `/api/books` | Create a new book (Auth required) |
| **PUT** | `/api/books/:id` | Update a book (Auth required) |
| **DELETE** | `/api/books/:id` | Soft delete a book (Auth required) |
| **POST** | `/api/books/:id/restore` | Restore a soft-deleted book (Auth required) |

---

## 📌 API Testing

### ✅ **Swagger API Documentation**
Once the API is running, open **Swagger UI** in your browser:
👉 **http://localhost:5000/api-docs**

### ✅ **Test with cURL or Postman**
#### **Register a New User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "P@ssword123"}'
```

#### **Login and Get a Token**
```bash
curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "P@ssword123"}'
```
🔹 Copy the **JWT token** from the response.

#### **Create a New Book (Authenticated Request)**
```bash
curl -X POST http://localhost:5000/api/books \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"title": "1984", "author": "George Orwell", "published_date": "1949-06-08", "genre": "Dystopian"}'
```

---

## 🛠️ **CI/CD Setup with GitHub Actions**
### **Setting Up GitHub Secrets for Deployment**

1️⃣ **Go to GitHub Repository → Settings → Secrets and Variables → Actions → New Repository Secret**  
2️⃣ Add the following secrets:

| Secret Name | Description |
|------------|-------------|
| `SERVER_HOST` | Your AWS server IP |
| `SERVER_USER` | Your SSH user (e.g., `ubuntu`) |
| `SSH_PRIVATE_KEY` | Your private SSH key for deployment |

---

## 🛑 Stopping the API

### **If running with Docker:**
```bash
docker-compose down
```

### **If running manually:**
Press **`CTRL + C`** in the terminal.

---

## 🎯 Final Summary

| **Setup Type**        | **Command to Run** |
|----------------------|----------------|
| **Run with Docker**  | `docker-compose up --build` |
| **Apply Migrations** (Docker) | `docker exec -it book-api npx sequelize-cli db:migrate` |
| **Run without Docker** | `npm install && npm start` |
| **Stop Docker** | `docker-compose down` |

🚀 **Now your API is fully functional!** Let me know if you need any further refinements. 🎯

---