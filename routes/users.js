const express = require("express");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../services/usersService");
const { handleValidationErrors, asyncHandler } = require("../utils/validationError");
const { body, param } = require("express-validator");

const router = express.Router();

const createUserHandler = asyncHandler(async (req, res) => {
  await createUser(req.body);
  return res.status(201).send("user created");
});

const getUsersHandler = asyncHandler(async (req, res) => {
  const users = await getUsers();
  return res.status(200).send(users);
});

const getUserHandler = asyncHandler(async (req, res) => {
  const user = await getUser(req.params.userId);

  if (!user) {
    return res.status(404).send("user not found");
  }
  return res.status(200).send(user);
});

const updateUserHandler = asyncHandler(async (req, res) => {
  const updatedUser = await updateUser(req.params.userId, req.body, {
    new: true,
  });

  if (!updatedUser) {
    return res.status(404).send("user not found");
  }

  return res.status(200).send(updatedUser);
});

const deleteUserHandler = asyncHandler(async (req, res) => {
  const deletedUser = await deleteUser(req.params.userId);

  if (!deletedUser) {
    return res.status(404).send("user not found");
  }
  return res.status(204).send();
});

const userValidationRules = {
  post: [body(["email", "password"]).notEmpty()],
  put: [param("userId").isMongoId(), body(["email", "password"]).optional().notEmpty()],
  get: param("userId").isMongoId(),
  delete: param("userId").isMongoId(),
};

router.post(
  "/users",
  userValidationRules.post,
  handleValidationErrors,
  createUserHandler,
);

router.get("/users", getUsersHandler);

router.get(
  "/users/:userId",
  userValidationRules.get,
  handleValidationErrors,
  getUserHandler,
);

router.put(
  "/users/:userId",
  userValidationRules.put,
  handleValidationErrors,
  updateUserHandler,
);

router.delete(
  "/users/:userId",
  userValidationRules.delete,
  handleValidationErrors,
  deleteUserHandler,
);

module.exports = router;
