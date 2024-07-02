// Import the necessary modules
const express = require("express"); // Express framework
const router = express.Router({ mergeParams: true }); // Router to define routes with merged parameters
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware"); // Middleware for validation, authentication, and authorization
const Campground = require("../models/campground"); // Campground model
const Review = require("../models/review"); // Review model
const reviews = require("../controllers/reviews"); // Controller for review-related logic
const ExpressError = require("../utils/ExpressError"); // Utility for handling custom errors
const catchAsync = require("../utils/catchAsync"); // Utility function to catch and handle errors in async functions

// Route to handle creating a new review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview)); // POST request to create a new review

// Route to handle deleting a specific review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
); // DELETE request to delete a specific review

// Export the router to be used in other parts of the application
module.exports = router;
