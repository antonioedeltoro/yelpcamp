const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user"); // Assuming this imports your User model
const users = require("../controllers/users"); // Assuming this imports your users controller
const passport = require("passport");
const { storeReturnTo } = require("../middleware"); // Assuming this imports storeReturnTo middleware

// Register route
router
  .route("/register")
  .get(users.renderRegister) // Render registration form
  .post(catchAsync(users.register)); // Handle registration form submission

// Login route
router
  .route("/login")
  .get(users.renderLogin) // Render login form
  .post(
    storeReturnTo, // Save returnTo value from session to res.locals
    passport.authenticate("local", {
      failureFlash: true, // Enable flash messages for authentication failures
      failureRedirect: "/login", // Redirect to /login on authentication failure
    }),
    users.login // Handle successful login
  );

// Logout route
router.get("/logout", users.logout); // Handle user logout

module.exports = router;
