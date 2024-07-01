// Import the Campground and Review models
const Campground = require("../models/campground");
const Review = require("../models/review");

// Controller for creating a new review
module.exports.createReview = async (req, res) => {
  // Find the campground by ID
  const campground = await Campground.findById(req.params.id);
  // Create a new review with the data from the request body
  const review = new Review(req.body.review);
  // Set the author of the review to the current user
  review.author = req.user._id;
  // Add the new review to the campground's reviews array
  campground.reviews.push(review);
  // Save the review and the campground to the database
  await review.save();
  await campground.save();
  // Flash a success message
  req.flash("success", "Created new review!");
  // Redirect to the campground's show page
  res.redirect(`/campgrounds/${campground._id}`);
};

// Controller for deleting a review
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  // Find the campground by ID and remove the review from the reviews array
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  // Find the review by ID and delete it
  await Review.findByIdAndDelete(reviewId);
  // Flash a success message
  req.flash("success", "Successfully deleted review");
  // Redirect to the campground's show page
  res.redirect(`/campgrounds/${id}`);
};
