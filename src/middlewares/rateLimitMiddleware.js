const rateLimit = require("express-rate-limit");
const redisClient = require("./redisClient"); // ✅ Import Redis client

// ✅ Custom Redis Store for express-rate-limit
const redisStore = {
    async increment(key) {
        const value = await redisClient.incr(key);
        if (value === 1) {
            await redisClient.expire(key, 900); // 15 minutes
        }
        return { totalHits: value, resetTime: new Date(Date.now() + 900 * 1000) };
    },
    async decrement(key) {
        await redisClient.decr(key);
    },
    async resetKey(key) {
        await redisClient.del(key);
    }
};

// ✅ Ensure redisRateLimiter is a middleware function
const redisRateLimiter = rateLimit({
    store: redisStore,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: "Too many requests from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// ✅ Export a valid middleware function
module.exports = (req, res, next) => redisRateLimiter(req, res, next);
