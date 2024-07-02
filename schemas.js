const BaseJoi = require("joi"); // Import Joi for schema validation
const sanitizeHtml = require("sanitize-html"); // Import sanitize-html to clean input

// Define a Joi extension to add HTML escaping functionality
const extension = (joi) => ({
  type: "string", // Define a new type "string"
  base: joi.string(), // Base it on the existing string type
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!", // Custom error message for HTML escape validation
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        // Use sanitizeHtml to clean the value
        const clean = sanitizeHtml(value, {
          allowedTags: [], // No HTML tags allowed
          allowedAttributes: {}, // No HTML attributes allowed
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value }); // If cleaned value differs, return an error
        return clean; // Otherwise, return the cleaned value
      },
    },
  },
});

const Joi = BaseJoi.extend(extension); // Extend Joi with the new HTML escaping functionality

// Define the schema for campgrounds
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(), // Title must be a string, required, and escaped
    price: Joi.number().required().min(0), // Price must be a number, required, and non-negative
    location: Joi.string().required().escapeHTML(), // Location must be a string, required, and escaped
    description: Joi.string().required().escapeHTML(), // Description must be a string, required, and escaped
  }).required(), // Campground object is required
  deleteImages: Joi.array(), // deleteImages can be an array
});

// Define the schema for reviews
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5), // Rating must be a number, required, and between 1 and 5
    body: Joi.string().required().escapeHTML(), // Body must be a string, required, and escaped
  }).required(), // Review object is required
});
