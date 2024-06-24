const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// Define an extension for Joi to sanitize HTML inputs
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [], // No tags allowed
          allowedAttributes: {}, // No attributes allowed
        });
        if (clean !== value)
          // If clean version is different, it means HTML was removed
          return helpers.error("string.escapeHTML", { value });
        return clean; // Return sanitized value
      },
    },
  },
});

// Extend BaseJoi with the defined extension
const Joi = BaseJoi.extend(extension);

// Export campgroundSchema for validating campground data
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(), // Validate title and sanitize HTML
    price: Joi.number().required().min(0), // Validate price
    location: Joi.string().required().escapeHTML(), // Validate location and sanitize HTML
    description: Joi.string().required().escapeHTML(), // Validate description and sanitize HTML
  }).required(),
  deleteImages: Joi.array(), // Optional array of images to delete
});

// Export reviewSchema for validating review data
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5), // Validate rating
    body: Joi.string().required().escapeHTML(), // Validate review body and sanitize HTML
  }).required(),
});
