// Export a higher-order function that wraps asynchronous route handlers
module.exports = (func) => {
  // Return a new function that takes req, res, and next as arguments
  return (req, res, next) => {
    // Call the provided function (func) with req, res, and next, and catch any errors
    func(req, res, next).catch(next);
  };
};
