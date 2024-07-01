// Import the Campground model
const Campground = require("../models/campground");

// Import the Mapbox geocoding service
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// Get the Mapbox token from environment variables
const mapBoxToken = process.env.MAPBOX_TOKEN;

// Create a new geocoder instance with the Mapbox token
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// Import the cloudinary configuration
const { cloudinary } = require("../cloudinary");

// Controller for displaying all campgrounds
module.exports.index = async (req, res, next) => {
  try {
    // Find all campgrounds and populate the popupText field
    const campgrounds = await Campground.find({}).populate("popupText");
    // Render the campgrounds index page with the retrieved campgrounds
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    // Pass any errors to the error handling middleware
    next(err);
  }
};

// Controller for rendering the form to create a new campground
module.exports.renderNewForm = (req, res) => {
  // Render the new campground form
  res.render("campgrounds/new");
};

// Controller for creating a new campground
module.exports.createCampground = async (req, res, next) => {
  try {
    // Perform forward geocoding to get the coordinates for the campground location
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
      })
      .send();
    // Create a new campground instance with the request data
    const campground = new Campground(req.body.campground);
    // Set the geometry property with the geocoded coordinates
    campground.geometry = geoData.body.features[0].geometry;
    // Map over the uploaded files to set the images property
    campground.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    // Set the author property to the current user
    campground.author = req.user._id;
    // Save the campground to the database
    await campground.save();
    // Flash a success message
    req.flash("success", "Successfully made a new campground!");
    // Redirect to the newly created campground's show page
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    // Pass any errors to the error handling middleware
    next(err);
  }
};

// Controller for displaying a specific campground
module.exports.showCampground = async (req, res, next) => {
  try {
    // Find the campground by ID and populate the reviews and author fields
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    // If the campground is not found, flash an error message and redirect
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    // Render the show page for the campground
    res.render("campgrounds/show", { campground });
  } catch (err) {
    // Pass any errors to the error handling middleware
    next(err);
  }
};

// Controller for rendering the edit form for a campground
module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find the campground by ID
    const campground = await Campground.findById(id);
    // If the campground is not found, flash an error message and redirect
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    // Render the edit form for the campground
    res.render("campgrounds/edit", { campground });
  } catch (err) {
    // Pass any errors to the error handling middleware
    next(err);
  }
};

// Controller for updating a campground
module.exports.updateCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find and update the campground by ID with the request data
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    // Map over the uploaded files to set the images property
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    // Save the updated campground to the database
    await campground.save();
    // If there are images to delete, remove them from Cloudinary and the campground
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await campground.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    // Flash a success message
    req.flash("success", "Successfully updated campground!");
    // Redirect to the updated campground's show page
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    // Pass any errors to the error handling middleware
    next(err);
  }
};

// Controller for deleting a campground
module.exports.deleteCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find and delete the campground by ID
    await Campground.findByIdAndDelete(id);
    // Flash a success message
    req.flash("success", "Successfully deleted campground");
    // Redirect to the campgrounds index page
    res.redirect("/campgrounds");
  } catch (err) {
    // Pass any errors to the error handling middleware
    next(err);
  }
};
