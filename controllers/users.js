const User = require("../models/user"); // Import the User model

// Controller to render the registration form
module.exports.renderRegister = (req, res) => {
  res.render("users/register"); // Render the register template
};

// Controller to handle user registration
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body; // Destructure email, username, and password from the request body
    const user = new User({ email, username }); // Create a new User instance with the email and username
    const registeredUser = await User.register(user, password); // Register the user with the provided password
    req.login(registeredUser, (err) => {
      // Log the user in after registration
      if (err) return next(err); // Pass any errors to the next middleware
      req.flash("success", "Welcome to Yelp Camp!"); // Flash a success message
      res.redirect("/campgrounds"); // Redirect to the campgrounds page
    });
  } catch (e) {
    req.flash("error", e.message); // Flash an error message if registration fails
    res.redirect("register"); // Redirect back to the registration form
  }
};

// Controller to render the login form
module.exports.renderLogin = (req, res) => {
  res.render("users/login"); // Render the login template
};

// Controller to handle user login
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!"); // Flash a success message
  const redirectUrl = res.locals.returnTo || "/campgrounds"; // Use the returnTo URL from the session or default to /campgrounds
  res.redirect(redirectUrl); // Redirect to the appropriate URL
};

// Controller to handle user logout
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    // Log the user out
    if (err) {
      return next(err); // Pass any errors to the next middleware
    }
    req.flash("success", "Goodbye!"); // Flash a success message
    res.redirect("/campgrounds"); // Redirect to the campgrounds page
  });
};
