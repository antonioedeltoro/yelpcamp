const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

// Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Store the original URL in session to redirect after login
    req.session.returnTo = req.originalUrl;
    // Flash an error message
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

// Middleware to store the returnTo path from session in res.locals
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// Middleware to validate campground data
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    // Construct error messages from Joi validation
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400); // Throw an ExpressError for bad request
  } else {
    next(); // Proceed to the next middleware
  }
};

// Middleware to check if the current user is the author of a campground
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Middleware to check if the current user is the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Middleware to validate review data
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // Construct error messages from Joi validation
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400); // Throw an ExpressError for bad request
  } else {
    next(); // Proceed to the next middleware
  }
};
