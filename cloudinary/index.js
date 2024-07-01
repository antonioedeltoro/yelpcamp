// Import the Cloudinary module
const cloudinary = require("cloudinary").v2;

// Import the Cloudinary storage engine for multer
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_KEY, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_SECRET, // Cloudinary API secret
});

// Create a new Cloudinary storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary, // Cloudinary instance
  params: {
    folder: "YelpCamp", // Folder name in Cloudinary
    allowedFormats: ["jpeg", "png", "jpg"], // Allowed image formats
  },
});

// Export the configured Cloudinary instance and storage engine
module.exports = {
  cloudinary, // Export Cloudinary instance
  storage, // Export Cloudinary storage engine
};
