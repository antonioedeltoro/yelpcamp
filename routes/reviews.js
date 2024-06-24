const express = require("express");
const router = express.Router({ mergeParams: true }); // Creating an instance of Express router with mergeParams option to merge parameters from the parent router
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware"); // Importing middleware functions for validation, authentication, and authorization
const Campground = require("../models/campground"); // Importing Campground model for interacting with campgrounds in the database
const Review = require("../models/review"); // Importing Review model for interacting with reviews in the database
const reviews = require("../controllers/reviews"); // Importing controller functions for handling review operations
const ExpressError = require("../utils/ExpressError"); // Importing utility function for creating custom error messages
const catchAsync = require("../utils/catchAsync"); // Importing utility function for catching asynchronous errors

// POST request to create a new review for a campground
router.post(
  "/",
  isLoggedIn, // Middleware to ensure user is logged in
  validateReview, // Middleware to validate review data
  catchAsync(reviews.createReview)
); // Middleware to catch asynchronous errors and call the controller function to create a review

// DELETE request to delete a specific review
router.delete(
  "/:reviewId",
  isLoggedIn, // Middleware to ensure user is logged in
  isReviewAuthor, // Middleware to check if the logged-in user is the author of the review
  catchAsync(reviews.deleteReview)
); // Middleware to catch asynchronous errors and call the controller function to delete the review

module.exports = router; // Exporting the router instance with defined routes
