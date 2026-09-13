const { User } = require("../models");

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  if (user.password !== password) {
    return null;
  }

  return user;
};

module.exports = {
  loginUser,
};
