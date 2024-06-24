const cloudinary = require("cloudinary").v2; // Import the Cloudinary library and use the v2 API
const { CloudinaryStorage } = require("multer-storage-cloudinary"); // Import the Cloudinary storage engine for multer

// Configure Cloudinary with the credentials stored in environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Set the cloud name
  api_key: process.env.CLOUDINARY_KEY, // Set the API key
  api_secret: process.env.CLOUDINARY_SECRET, // Set the API secret
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary, // Reference the configured Cloudinary instance
  params: {
    folder: "YelpCamp", // Specify the folder name in Cloudinary where images will be stored
    allowedFormats: ["jpeg", "png", "jpg"], // Allow only specific image formats
  },
});

// Export the configured Cloudinary instance and storage to use in other parts of the application
module.exports = {
  cloudinary,
  storage,
};
