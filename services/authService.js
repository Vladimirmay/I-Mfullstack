const bcrypt = require("bcrypt");
const { User } = require("../models");

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return null;
  }

  return user;
};

module.exports = {
  loginUser,
};
