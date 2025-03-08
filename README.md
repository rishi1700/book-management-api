### **📌 Updated `README.md` for Your Book Management API**
Here’s an updated version of your `README.md`, incorporating **API Security Testing, Testing Coverage, and Deployment Instructions**.

---

# **📚 Book Management API**
A **secure REST API** for managing books, featuring **authentication, authorization, rate limiting, input validation, and API security best practices**.

## **🚀 Features**
✔ User Authentication (JWT-based)  
✔ CRUD Operations for Books  
✔ SQL Injection, XSS, and CORS Protection  
✔ Rate Limiting & Redis Caching  
✔ Role-Based Access Control (RBAC)  
✔ Secure API with Logging & Error Handling  
✔ Automated API Testing  

---

## **🛠 Tech Stack**
- **Backend:** Node.js, Express.js  
- **Database:** MySQL with Sequelize ORM  
- **Authentication:** JWT  
- **Security:** Helmet, CORS, Joi Validation, OWASP Security Headers  
- **Rate Limiting:** Redis + Express-Rate-Limit  
- **Testing:** Jest, Supertest  

---

## **📦 Installation & Setup**
### **🔹 1. Clone the repository**
```bash
git clone https://github.com/rishi1700/book-management-api.git
cd book-management-api
```

### **🔹 2. Install dependencies**
```bash
npm install
```

### **🔹 3. Set up `.env` file**
Create a `.env` file and add the following:
```env
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=yourpassword
DB_NAME=book_management
DB_PORT=3306
JWT_SECRET=your_secret_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
NODE_ENV=development
```

### **🔹 4. Start the API**
```bash
npm start
```
The API will be running at `http://localhost:5000`.

### **🔹 5. Run Tests**
```bash
npm test
```

---

## **📌 API Endpoints**
### **🔹 Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and get a JWT token |

### **🔹 Book Management**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/books` | Add a new book | ✅ |
| `GET` | `/api/books` | Retrieve all books | ✅ |
| `GET` | `/api/books/:id` | Retrieve a specific book | ✅ |
| `PUT` | `/api/books/:id` | Update a book | ✅ |
| `DELETE` | `/api/books/:id` | Soft delete a book | ✅ |
| `POST` | `/api/books/:id/restore` | Restore a deleted book | ✅ |

---

## **🔍 Testing & Security Checks**
### **🔹 Run Unit & Integration Tests**
```bash
npm test
```

### **🔹 Security Tests**
Run **API penetration tests** using `cURL`:
```bash
# SQL Injection Test
curl -X GET "http://localhost:5000/api/books?title=' OR 1=1 --"

# XSS Injection Test
curl -X POST http://localhost:5000/api/books \
     -H "Content-Type: application/json" \
     -d '{"title": "<script>alert(1)</script>", "author": "Hacker"}'

# CORS Bypass Test
curl -X GET http://localhost:5000/api/books -H "Origin: http://evil.com"
```

### **🔹 Run OWASP ZAP for Automated API Security Scanning**
1. Install **[OWASP ZAP](https://www.zaproxy.org/download/)**
2. Run **Active Scan** on `http://localhost:5000`
3. Analyze vulnerabilities & apply fixes.

---

## **🚀 Deployment**
### **🔹 Deploy on a Cloud Server**
1. **Prepare Production Environment**
   ```bash
   export NODE_ENV=production
   export JWT_SECRET=your_secure_secret
   ```

2. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start server.js --name book-api
   ```

3. **Check Logs**
   ```bash
   pm2 logs book-api
   ```

### **🔹 Docker Deployment**
```bash
docker build -t book-management-api .
docker run -p 5000:5000 --env-file .env book-management-api
```

---

## **📌 Roadmap**
- [ ] Implement OAuth 2.0 authentication  
- [ ] Add WebSocket notifications for book updates  
- [ ] Implement GraphQL API  

---

## **📜 License**
This project is **MIT Licensed**. You can use, modify, and distribute it as per the license terms.

---

## **📩 Contact**
If you have any questions, feel free to reach out via GitHub Issues. 🚀

---

This **updated README** covers **installation, usage, testing, security, and deployment**. Let me know if you'd like any modifications! 🚀