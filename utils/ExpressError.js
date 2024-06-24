// Define a custom error class that extends the built-in Error class
class ExpressError extends Error {
  // Constructor to initialize the error with a message and status code
  constructor(message, statusCode) {
    super(); // Call the parent class's constructor
    this.message = message; // Set the error message
    this.statusCode = statusCode; // Set the status code
  }
}

// Export the custom error class to be used in other parts of the application
module.exports = ExpressError;
