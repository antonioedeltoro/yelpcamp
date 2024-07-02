if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // Load environment variables from .env file in non-production environments
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); // Template engine
const session = require("express-session");
const flash = require("connect-flash"); // Flash messages for session
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override"); // Allows for HTTP verbs like PUT or DELETE in places where the client doesn't support it
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet"); // Security middleware
const mongoSanitize = require("express-mongo-sanitize"); // Prevents MongoDB Operator Injection
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

const MongoDBStore = require("connect-mongo")(session); // Session store for MongoDB

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp"; // Database URL

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}); // Connect to MongoDB

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); // Error handling for database connection
db.once("open", () => {
  console.log("Database connected"); // Log successful database connection
});

const app = express();

app.engine("ejs", ejsMate); // Set ejsMate as the template engine
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(methodOverride("_method")); // Allows overriding methods in forms
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the public directory
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
); // Sanitize user inputs

const secret = process.env.SECRET || "thisshouldbeabettersecret!"; // Secret for session

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
}); // Session store configuration

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e); // Log session store errors
});

const sessionConfig = {
  store,
  name: "session", // Name of the session ID cookie
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Helps prevent cross-site scripting attacks
    // secure: true, // Uncomment for HTTPS-only
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Session expiration date
    maxAge: 1000 * 60 * 60 * 24 * 7, // Maximum age of the session
  },
};

app.use(session(sessionConfig)); // Use session middleware
app.use(flash()); // Use flash middleware for storing messages
app.use(helmet()); // Use helmet for security

// Configuring Content Security Policy with Helmet
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dru71u48u/", // SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Use Passport for session handling
passport.use(new LocalStrategy(User.authenticate())); // Use LocalStrategy for authentication

passport.serializeUser(User.serializeUser()); // Serialize user instance to session
passport.deserializeUser(User.deserializeUser()); // Deserialize user instance from session

app.use((req, res, next) => {
  res.locals.currentUser = req.user; // Add currentUser to res.locals
  res.locals.success = req.flash("success"); // Add success message to res.locals
  res.locals.error = req.flash("error"); // Add error message to res.locals
  next(); // Proceed to next middleware
});

// Route handlers
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home"); // Render home page
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404)); // Handle all undefined routes
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err }); // Render error page
});

const port = process.env.PORT || 3000; // Set port from environment variable or default to 3000
app.listen(port, () => {
  console.log(`Serving on port ${port}`); // Log the port the server is running on
});
