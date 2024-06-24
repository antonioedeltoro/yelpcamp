const express = require("express"); // Importing Express framework
const router = express.Router(); // Creating an instance of Express router
const campgrounds = require("../controllers/campgrounds"); // Importing campground controller functions
const catchAsync = require("../utils/catchAsync"); // Utility function to catch asynchronous errors
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware"); // Middleware functions for authentication and validation
const multer = require("multer"); // Middleware for handling file uploads
const { storage } = require("../cloudinary"); // Cloudinary storage configuration
const upload = multer({ storage }); // Multer middleware configured with Cloudinary storage

const Campground = require("../models/campground"); // Campground model for interacting with database

// Route handling
router
  .route("/")
  .get(catchAsync(campgrounds.index)) // GET request to fetch all campgrounds
  .post(
    isLoggedIn, // Middleware to ensure user is logged in
    upload.array("image"), // Middleware to handle image uploads
    validateCampground, // Middleware to validate campground data
    catchAsync(campgrounds.createCampground) // POST request to create a new campground
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm); // GET request to render form for creating a new campground

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground)) // GET request to show details of a specific campground
  .put(
    isLoggedIn, // Middleware to ensure user is logged in
    isAuthor, // Middleware to check if user is the author of the campground
    upload.array("image"), // Middleware to handle image uploads for updating campground
    validateCampground, // Middleware to validate campground data before update
    catchAsync(campgrounds.updateCampground) // PUT request to update a specific campground
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); // DELETE request to delete a specific campground

router.get(
  "/:id/edit",
  isLoggedIn, // Middleware to ensure user is logged in
  isAuthor, // Middleware to check if user is the author of the campground
  catchAsync(campgrounds.renderEditForm) // GET request to render form for editing a specific campground
);

module.exports = router; // Exporting the router instance with defined routes
