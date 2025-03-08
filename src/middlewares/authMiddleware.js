const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" }); // ✅ Keep 401 for missing token
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error("🚨 JWT Error:", err.message);

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
    }
    
   if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
   }

   return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
