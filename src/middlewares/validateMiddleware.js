const Joi = require('joi');

// Define Book Schema for validation
const bookSchema = Joi.object({
    title: Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
    published_date: Joi.date().iso().required(),
    genre: Joi.string().min(3).required(),
});

// Validate book details before saving
exports.validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// SQL Injection Protection Middleware
exports.validateSQLInjection = (req, res, next) => {
    const sqlInjectionPattern = /(\b(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|WHERE|OR|AND|;|--|\/\*|\*\/)\b|\*|=|\(|\))/gi;

    // Check query parameters
    for (const param in req.query) {
        if (typeof req.query[param] === 'string' && sqlInjectionPattern.test(req.query[param])) {
            return res.status(400).json({ error: "Invalid input detected in query parameters" });
        }
    }

    // Check request body
    for (const key in req.body) {
        if (typeof req.body[key] === 'string' && sqlInjectionPattern.test(req.body[key])) {
            return res.status(400).json({ error: "Invalid input detected in request body" });
        }
    }

    // Check route parameters
    for (const param in req.params) {
        if (typeof req.params[param] === 'string' && sqlInjectionPattern.test(req.params[param])) {
            return res.status(400).json({ error: "Invalid input detected in route parameters" });
        }
    }

    next();
};
