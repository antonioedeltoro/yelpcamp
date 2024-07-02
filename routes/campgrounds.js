// Import the necessary modules
const express = require("express"); // Express framework
const router = express.Router(); // Router to define routes
const campgrounds = require("../controllers/campgrounds"); // Controller for campground-related logic
const catchAsync = require("../utils/catchAsync"); // Utility function to catch and handle errors in async functions
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware"); // Middleware for authentication, authorization, and validation
const multer = require("multer"); // Multer for handling file uploads
const { storage } = require("../cloudinary"); // Cloudinary storage configuration
const upload = multer({ storage }); // Configure multer to use Cloudinary storage

const Campground = require("../models/campground"); // Campground model

// Route to handle displaying all campgrounds and creating a new campground
router
  .route("/")
  .get(catchAsync(campgrounds.index)) // GET request to fetch and display all campgrounds
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  ); // POST request to create a new campground

// Route to display the form to create a new campground
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// Route to handle displaying, updating, and deleting a specific campground
router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground)) // GET request to display a specific campground
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  ) // PUT request to update a specific campground
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); // DELETE request to delete a specific campground

// Route to display the form to edit a specific campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

// Export the router to be used in other parts of the application
module.exports = router;
