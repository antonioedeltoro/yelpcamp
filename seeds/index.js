const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); // Handle connection error
db.once("open", () => {
  console.log("Database connected"); // Log when connected to the database
});

// Utility function to select a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Seed the database
const seedDB = async () => {
  // Delete all existing campgrounds
  await Campground.deleteMany({});
  // Create 300 new campgrounds
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000); // Random index to pick a city
    const price = Math.floor(Math.random() * 20) + 10; // Random price between 10 and 30

    const camp = new Campground({
      author: "665a5f3d48c1411ce4bd67a8", // Replace with a valid user ID
      location: `${cities[random1000].city}, ${cities[random1000].state}`, // Random city and state
      title: `${sample(descriptors)} ${sample(places)}`, // Random title composed of a descriptor and a place
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur atque aperiam optio excepturi earum numquam aliquam repudiandae saepe, quaerat molestias! Quasi expedita aliquid provident pariatur voluptates eaque eum vitae ea! Lorem ipsum dolor sit amet consectetur adipisicing elit.", // Sample description
      price, // Random price
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude, // Longitude of the random city
          cities[random1000].latitude, // Latitude of the random city
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dru71u48u/image/upload/v1717717093/YelpCamp/gy2z8wk02hatj4dw3th2.jpg", // Sample image URL
          filename: "YelpCamp/gy2z8wk02hatj4dw3th2", // Sample image filename
        },
        {
          url: "https://res.cloudinary.com/dru71u48u/image/upload/v1717717093/YelpCamp/u8n3igvariyej4xoyjiu.jpg", // Sample image URL
          filename: "YelpCamp/u8n3igvariyej4xoyjiu", // Sample image filename
        },
      ],
    });
    await camp.save(); // Save the new campground to the database
  }
};

// Seed the database and then close the connection
seedDB().then(() => {
  mongoose.connection.close(); // Close the database connection
});
