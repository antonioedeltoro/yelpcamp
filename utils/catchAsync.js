// Export a function that wraps an asynchronous function for error handling
module.exports = (func) => {
  // Return a new function that takes req, res, and next as parameters
  return (req, res, next) => {
    // Call the passed asynchronous function (func) with req, res, and next
    // and catch any errors, passing them to the next middleware
    func(req, res, next).catch(next);
  };
};
