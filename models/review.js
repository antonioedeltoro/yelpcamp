// Import mongoose
const mongoose = require("mongoose");

// Create a Schema constructor
const Schema = mongoose.Schema;

// Define the Review schema
const reviewSchema = new Schema({
  body: String, // The body of the review
  rating: Number, // The rating given in the review
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
});

// Export the Review model based on the review schema
module.exports = mongoose.model("Review", reviewSchema);
