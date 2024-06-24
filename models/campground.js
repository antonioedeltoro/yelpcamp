const mongoose = require("mongoose"); // Import mongoose for database interaction
const Review = require("./review"); // Import the Review model
const Schema = mongoose.Schema; // Create a shortcut for mongoose.Schema

// URL to a sample image (can be used for reference or testing)
// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

// Schema for storing image data
const ImageSchema = new Schema({
  url: String, // URL of the image
  filename: String, // Filename of the image in Cloudinary
});

// Virtual property to get a thumbnail version of the image
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200"); // Modify the URL to include the thumbnail size
});

// Options to include virtual properties when converting documents to JSON
const opts = { toJSON: { virtuals: true } };

// Schema for the Campground model
const CampgroundSchema = new Schema(
  {
    title: String, // Title of the campground
    images: [ImageSchema], // Array of image subdocuments
    geometry: {
      type: {
        type: String, // Type of geometry (e.g., Point)
        enum: ["Point"], // Must be of type "Point"
        required: true, // Geometry type is required
      },
      coordinates: {
        type: [Number], // Array of numbers for coordinates
        required: true, // Coordinates are required
      },
    },
    price: Number, // Price of the campground
    description: String, // Description of the campground
    location: String, // Location of the campground
    author: {
      type: Schema.Types.ObjectId, // Reference to the User model
      ref: "User", // Reference to the User model by ID
    },
    reviews: [
      {
        type: Schema.Types.ObjectId, // Reference to the Review model
        ref: "Review", // Reference to the Review model by ID
      },
    ],
  },
  opts // Include options to include virtuals in JSON
);

// Virtual property to generate markup for a popup
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
    <strong><a href=/campgrounds/${this._id}>${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`; // Link to the campground and a short description
});

// Middleware to delete associated reviews when a campground is deleted
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews, // Delete all reviews that are in the deleted campground's reviews array
      },
    });
  }
});

// Export the Campground model based on the CampgroundSchema
module.exports = mongoose.model("Campground", CampgroundSchema);
