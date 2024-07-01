// Import mongoose and the Review model
const mongoose = require("mongoose");
const Review = require("./review");

// Create a Schema constructor
const Schema = mongoose.Schema;

// Define the Image schema for the campground images
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// Add a virtual property to the Image schema to generate a thumbnail URL
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

// Options to include virtuals when converting the schema to JSON
const opts = { toJSON: { virtuals: true } };

// Define the Campground schema
const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema], // Array of image subdocuments
    geometry: {
      type: {
        type: String,
        enum: ["Point"], // Must be a GeoJSON Point
        required: true,
      },
      coordinates: {
        type: [Number], // Array of numbers for longitude and latitude
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review", // Reference to the Review model
      },
    ],
  },
  opts
);

// Add a virtual property to generate the popup markup for map display
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

// Middleware to delete all associated reviews when a campground is deleted
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

// Export the Campground model based on the Campground schema
module.exports = mongoose.model("Campground", CampgroundSchema);
