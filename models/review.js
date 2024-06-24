const mongoose = require("mongoose"); // Import mongoose for database interaction
const Schema = mongoose.Schema; // Create a shortcut for mongoose.Schema

// Define the schema for a review
const reviewSchema = new Schema({
  body: String, // The body of the review (text content)
  rating: Number, // The rating given in the review (e.g., 1-5 stars)
  author: {
    type: Schema.Types.ObjectId, // Reference to the User model
    ref: "User", // Reference the User model by ID
  },
});

// Export the Review model based on the reviewSchema
module.exports = mongoose.model("Review", reviewSchema);
