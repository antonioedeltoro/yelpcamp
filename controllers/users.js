// Import the User model
const User = require("../models/user");

// Controller for rendering the registration form
module.exports.renderRegister = (req, res) => {
  // Render the register form
  res.render("users/register");
};

// Controller for handling user registration
module.exports.register = async (req, res, next) => {
  try {
    // Destructure email, username, and password from the request body
    const { email, username, password } = req.body;
    // Create a new User instance with the provided email and username
    const user = new User({ email, username });
    // Register the user with the provided password
    const registeredUser = await User.register(user, password);
    // Log the user in after registration
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      // Flash a success message
      req.flash("success", "Welcome to Yelp Camp!");
      // Redirect to the campgrounds page
      res.redirect("/campgrounds");
    });
  } catch (e) {
    // Flash an error message if registration fails
    req.flash("error", e.message);
    // Redirect to the registration form
    res.redirect("register");
  }
};

// Controller for rendering the login form
module.exports.renderLogin = (req, res) => {
  // Render the login form
  res.render("users/login");
};

// Controller for handling user login
module.exports.login = (req, res) => {
  // Flash a success message upon successful login
  req.flash("success", "Welcome back!");
  // Redirect to the URL the user was trying to access before login, or to campgrounds
  const redirectUrl = req.session.returnTo || "/campgrounds";
  // Delete the returnTo URL from the session
  delete req.session.returnTo;
  // Redirect to the determined URL
  res.redirect(redirectUrl);
};

// Controller for handling user logout
module.exports.logout = (req, res, next) => {
  // Log the user out
  req.logout((err) => {
    // Ensure to pass a callback function to req.logout()
    if (err) return next(err);
    // Flash a success message upon logout
    req.flash("success", "Goodbye!");
    // Redirect to the campgrounds page
    res.redirect("/campgrounds");
  });
};
