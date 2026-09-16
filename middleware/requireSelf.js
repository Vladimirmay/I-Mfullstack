const requireSelf = (req, res, next) => {
  if (req.user._id.toString() !== req.params.userId) {
    return res.status(403).send("forbidden: you can only edit your own profile");
  }
  next();
};

module.exports = requireSelf;
