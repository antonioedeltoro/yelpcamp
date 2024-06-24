const mongoose = require("mongoose"); // Import mongoose for database interaction
const Schema = mongoose.Schema; // Create a shortcut for mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose"); // Import passport-local-mongoose for authentication

// Define the schema for a user
const UserSchema = new Schema({
  email: {
    type: String, // The user's email address
    required: true, // Email is required
    unique: true, // Email must be unique
  },
});

// Plugin to add username, hash, and salt fields to the UserSchema for authentication
UserSchema.plugin(passportLocalMongoose);

// Export the User model based on the UserSchema
module.exports = mongoose.model("User", UserSchema);
