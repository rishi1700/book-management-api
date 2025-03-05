const Joi = require('joi');

const bookSchema = Joi.object({
    title: Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
    published_date: Joi.date().iso().required(),
    genre: Joi.string().min(3).required(),
});

exports.validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
