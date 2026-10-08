const bcrypt = require("bcrypt");
const { User } = require("../models");
const { generateToken } = require("./authService");

const SALT_ROUNDS = 10;

const createUser = async (body) => {
  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);
  const jwtToken = generateToken(body.email);
  return User.create({ ...body, password: passwordHash, token: jwtToken });
};

const getUsers = () => {
  return User.find().lean();
};

const getUser = (userId) => {
  return User.findById(userId).lean();
};

const updateUser = (userId, updateFields, options) => {
  return User.findByIdAndUpdate(userId, updateFields, options);
};

const updateInfoUser = (userId, body, options) => {
  return User.findByIdAndUpdate(userId, body, options);
};

const deleteUser = (userId) => {
  return User.findByIdAndDelete(userId);
};

const addFavorite = (userId, movieId) => {
  return User.findByIdAndUpdate(
    userId,
    { $addToSet: { favorites: movieId } },
    { new: true },
  );
};

const removeFavorite = (userId, movieId) => {
  return User.findByIdAndUpdate(userId, { $pull: { favorites: movieId } }, { new: true });
};

const getFavoritesCountByTitle = async () => {
  const rows = await User.aggregate([
    { $unwind: "$favorites" },
    {
      $lookup: {
        from: "movies",
        localField: "favorites",
        foreignField: "_id",
        as: "movie",
      },
    },
    { $unwind: "$movie" },
    { $group: { _id: "$movie.title", count: { $sum: 1 } } },
  ]);

  return rows.reduce((acc, { _id, count }) => {
    acc[_id] = count;
    return acc;
  }, {});
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateInfoUser,
  addFavorite,
  removeFavorite,
  getFavoritesCountByTitle,
};
