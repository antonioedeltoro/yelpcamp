// Import mongoose
const mongoose = require("mongoose");

// Create a Schema constructor
const Schema = mongoose.Schema;

// Import passport-local-mongoose for handling username and password
const passportLocalMongoose = require("passport-local-mongoose");

// Define the User schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Email must be unique
  },
});

// Add passport-local-mongoose plugin to the User schema to handle password hashing and authentication
UserSchema.plugin(passportLocalMongoose);

// Export the User model based on the User schema
module.exports = mongoose.model("User", UserSchema);
