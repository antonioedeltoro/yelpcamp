// Define a custom error class called ExpressError that extends the built-in Error class
class ExpressError extends Error {
  // Constructor takes a message and a statusCode as parameters
  constructor(message, statusCode) {
    super(); // Call the parent class constructor
    this.message = message; // Set the error message
    this.statusCode = statusCode; // Set the status code for the error
  }
}

// Export the ExpressError class so it can be used in other modules
module.exports = ExpressError;
