const asyncHandler = (cb) => (req, res, next) => {
  Promise.resolve(cb(req, res, next)).catch(next);
};

export default asyncHandler;
