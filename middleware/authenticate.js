const { User } = require("../models");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("no authorization header");
  }

  const [email, password] = authHeader.split(" ");

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(401).send("invalid credentials");
  }

  req.user = user;
  next();
};

module.exports = authenticate;
