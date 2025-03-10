---

# 📚 **Book Management API**

This API provides a **RESTful interface** for managing books with **CRUD operations**, **authentication**, **validation**, and **security features**.

---

## 🚀 **Features**
✅ **User Authentication (JWT-based)**  
✅ **CRUD operations for books**  
✅ **Input validation and SQL injection protection**  
✅ **Rate limiting to prevent abuse**  
✅ **Secure password hashing**  
✅ **Logging with Winston**  
✅ **API documentation using Swagger**  
✅ **MySQL database support with Sequelize ORM**  
✅ **Unit & Integration Testing with Jest & Supertest**  
✅ **CI/CD setup using GitHub Actions**  

---

## 🔥 **Prerequisites**
Before running the API, ensure you have the following installed:

✅ [Node.js (v18+)](https://nodejs.org/)  
✅ [Git](https://git-scm.com/)  
✅ [MySQL](https://dev.mysql.com/downloads/) (for local setup without Docker)  
✅ [Docker & Docker Compose](https://www.docker.com/) (optional)  
✅ **cross-env** (for running tests on Windows)  

---

## 🛠️ **How to Run the API (Without Docker)**  

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/rishi1700/book-management-api.git
cd book-management-api
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file:
```bash
cp .env.example .env
```
Update `.env` with **correct MySQL credentials**:
```plaintext
NODE_ENV=development
DB_NAME=book_management
DB_USER= db_user
DB_PASS= db_pass
DB_HOST=127.0.0.1  # Use '127.0.0.1' for local MySQL
DB_PORT=3306
JWT_SECRET=your_secret_key
```

### **4️⃣ Start MySQL (If Not Running)**
#### ✅ **For Windows (XAMPP/MySQL Workbench)**  
- Open **XAMPP Control Panel** → **Start MySQL**
- OR open **MySQL Workbench** → Start MySQL Server

#### ✅ **For Linux/macOS**  
Start MySQL manually:
```bash
sudo service mysql start
```
📌 **Ensure MySQL is running on port 3306**.

### **5️⃣ Apply Database Migrations**
```bash
npx sequelize-cli db:migrate
```

### **6️⃣ Start the API**
Run either:
```bash
node src/app.js
```
or:
```bash
npm start
```
✅ If successful, you should see:
```
📄 Swagger documentation available at: http://localhost:5000/api-docs
🚀 Server running on port 5000
✅ MySQL Database Connected Successfully!
```

---

## 🛠️ **How to Run API Using Docker**
> **Ensure you have Docker installed** before proceeding.

### **1️⃣ Build & Start Containers**
```bash
docker-compose up --build
```
📌 This will start **two containers**:
- `mysql` (Database)
- `book-api` (Node.js API)

### **2️⃣ Apply Database Migrations (Inside Docker)**
Run:
```bash
docker exec -it book-api npx sequelize-cli db:migrate
```

### **3️⃣ Access API**
- **Swagger Documentation**: 👉 [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Connect to MySQL (Inside Docker)**:
  ```bash
  docker exec -it book-db mysql -u user -pP@ssw0rd
  ```

### **4️⃣ Stop Docker Containers**
```bash
docker-compose down
```

---

## 📌 **API Endpoints**

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

## 📌 **API Testing**
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

---

🛠️ Individual Tests
Here are the test categories and how to run them:

🔹 Authentication Tests
bash
Copy
Edit
npm test tests/auth.test.js
✅ Register new user
✅ Login with correct credentials
🚨 Fail login with incorrect password
🚨 Block unauthorized access to protected routes
🔹 Book Routes Tests
bash
Copy
Edit
npm test tests/bookRoutes.test.js
✅ Create a new book
🚨 Reject creating a book with missing fields
✅ Get books with pagination and filters
🚨 Fail updating a non-existent book
✅ Soft delete a book
✅ Restore a soft-deleted book
🔹 Rate Limiting Tests
bash
Copy
Edit
npm test tests/rateLimit.test.js
✅ Block excessive requests beyond the limit
🚨 Prevent rate-limit bypass using fake headers
🔹 Security & Validation Tests
bash
Copy
Edit
npm test tests/security.test.js
✅ Prevent SQL Injection
✅ Prevent XSS attacks
✅ Block unauthorized CORS requests

---

## 🛑 Stopping the API

### **If running manually:**
Press **`CTRL + C`** in the terminal.

---

## 🎯 **Final Summary**

| **Setup Type**        | **Command to Run** |
|----------------------|----------------|
| **Install Dependencies**  | `npm install` |
| **Set Up `.env` File**  | `cp .env.example .env` |
| **Apply Migrations** | `npx sequelize-cli db:migrate` |
| **Run API (Manual)** | `node src/app.js` OR `npm start` |
| **Run API (Docker)** | `docker-compose up --build` |
| **Run Tests (Linux/macOS)** | `npm test` |
| **Run Tests (Windows)** | `npm test` (After `cross-env` setup) |

🚀 **Now your API is fully functional!** Let me know if you need further refinements. 🎯

---