const { campgroundSchema, reviewSchema } = require("./schemas.js"); // Import validation schemas
const ExpressError = require("./utils/ExpressError"); // Import custom error class
const Campground = require("./models/campground"); // Import Campground model
const Review = require("./models/review"); // Import Review model

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // If user is not authenticated
    req.session.returnTo = req.originalUrl; // Save the original URL they were trying to access
    req.flash("error", "You must be signed in first!"); // Flash an error message
    return res.redirect("/login"); // Redirect to login page
  }
  next(); // Proceed to next middleware
};

// Middleware to validate campground data
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body); // Validate request body against campground schema
  console.log(req.body);
  if (error) {
    // If there's a validation error
    const msg = error.details.map((el) => el.message).join(","); // Create a message from the error details
    throw new ExpressError(msg, 400); // Throw a custom ExpressError with the message and status code 400
  } else {
    next(); // Proceed to next middleware
  }
};

// Middleware to check if user is the author of the campground
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params; // Get campground ID from request parameters
  const campground = await Campground.findById(id); // Find campground by ID
  if (!campground.author.equals(req.user._id)) {
    // If current user is not the author
    req.flash("error", "You do not have permission to do that!"); // Flash an error message
    return res.redirect(`/campgrounds/${id}`); // Redirect to the campground page
  }
  next(); // Proceed to next middleware
};

// Middleware to check if user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; // Get campground ID and review ID from request parameters
  const review = await Review.findById(reviewId); // Find review by ID
  if (!review.author.equals(req.user._id)) {
    // If current user is not the author
    req.flash("error", "You do not have permission to do that!"); // Flash an error message
    return res.redirect(`/campgrounds/${id}`); // Redirect to the campground page
  }
  next(); // Proceed to next middleware
};

// Middleware to validate review data
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); // Validate request body against review schema
  if (error) {
    // If there's a validation error
    const msg = error.details.map((el) => el.message).join(","); // Create a message from the error details
    throw new ExpressError(msg, 400); // Throw a custom ExpressError with the message and status code 400
  } else {
    next(); // Proceed to next middleware
  }
};
