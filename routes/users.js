// Import the necessary modules
const express = require("express"); // Express framework
const router = express.Router(); // Router to define routes
const passport = require("passport"); // Passport for authentication
const catchAsync = require("../utils/catchAsync"); // Utility function to catch and handle errors in async functions
const User = require("../models/user"); // User model
const users = require("../controllers/users"); // Controller for user-related logic

// Route to handle user registration
router
  .route("/register")
  .get(users.renderRegister) // GET request to render the registration form
  .post(catchAsync(users.register)); // POST request to handle user registration

// Route to handle user login
router
  .route("/login")
  .get(users.renderLogin) // GET request to render the login form
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  ); // POST request to handle user login

// Route to handle user logout
router.get("/logout", users.logout); // GET request to handle user logout

// Export the router to be used in other parts of the application
module.exports = router;
