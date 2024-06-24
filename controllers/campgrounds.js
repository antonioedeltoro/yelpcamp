const Campground = require("../models/campground"); // Importing the Campground model
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); // Importing Mapbox geocoding service
const mapBoxtoken = process.env.MAPBOX_TOKEN; // Accessing Mapbox token from environment variables
const geocoder = mbxGeocoding({ accessToken: mapBoxtoken }); // Creating a new geocoding client with the token
const { cloudinary } = require("../cloudinary"); // Importing Cloudinary for image upload management

// Index route: Fetch and display all campgrounds
module.exports.index = async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({}).populate("popupText"); // Fetch all campgrounds and populate popupText field
    res.render("campgrounds/index", { campgrounds }); // Render the index template with the campgrounds
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
};

// Render new campground form
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new"); // Render the new campground form template
};

// Create a new campground
module.exports.createCampground = async (req, res, next) => {
  try {
    // Geocode the campground location
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.campground.location, // Use location from the request body
        limit: 1, // Limit the results to 1
      })
      .send();

    const campground = new Campground(req.body.campground); // Create a new Campground instance with the data from the request body
    campground.geometry = geoData.body.features[0].geometry; // Set the geometry field with the geocoded data
    campground.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    })); // Map the uploaded files to image objects
    campground.author = req.user._id; // Set the author to the current user's ID
    await campground.save(); // Save the new campground to the database

    req.flash("success", "Successfully made a new campground!"); // Flash a success message
    res.redirect(`/campgrounds/${campground._id}`); // Redirect to the new campground's show page
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
};

// Show a single campground
module.exports.showCampground = async (req, res, next) => {
  try {
    // Find the campground by ID and populate related fields
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");

    if (!campground) {
      req.flash("error", "Cannot find that campground!"); // Flash an error message if campground is not found
      return res.redirect("/campgrounds"); // Redirect to the index page
    }

    res.render("campgrounds/show", { campground }); // Render the show template with the campground
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
};

// Render edit campground form
module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id); // Find the campground by ID

    if (!campground) {
      req.flash("error", "Cannot find that campground!"); // Flash an error message if campground is not found
      return res.redirect("/campgrounds"); // Redirect to the index page
    }

    res.render("campgrounds/edit", { campground }); // Render the edit template with the campground
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
};

// Update a campground
module.exports.updateCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    }); // Find the campground by ID and update with new data

    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename })); // Map the uploaded files to image objects
    campground.images.push(...imgs); // Add new images to the campground's images array
    await campground.save(); // Save the updated campground

    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename); // Delete images from Cloudinary
      }
      await campground.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      }); // Remove the deleted images from the campground's images array
    }

    req.flash("success", "Successfully updated campground!"); // Flash a success message
    res.redirect(`/campgrounds/${campground._id}`); // Redirect to the updated campground's show page
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
};

// Delete a campground
module.exports.deleteCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id); // Find the campground by ID and delete it

    req.flash("success", "Successfully deleted campground"); // Flash a success message
    res.redirect("/campgrounds"); // Redirect to the index page
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
};
