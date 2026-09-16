const requireAdmin = (req, res, next) => {
  if (!req.user.roles.includes("admin")) {
    return res.status(403).send("forbidden: admin access required");
  }
  next();
};

module.exports = requireAdmin;
