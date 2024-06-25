const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({}).populate("popupText");
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  try {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
      })
      .send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.showCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  } catch (err) {
    next(err);
  }
};

module.exports.updateCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await campground.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
};
