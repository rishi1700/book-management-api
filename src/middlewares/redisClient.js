const { createClient } = require("@redis/client");

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
    },
    password: process.env.REDIS_PASSWORD || "", // Set if Redis requires a password
});

redisClient.connect().catch((err) => console.error("❌ Redis Connection Error:", err));

module.exports = redisClient;
