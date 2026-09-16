const express = require("express");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateInfoUser,
} = require("../services/usersService");
const { handleValidationErrors, asyncHandler } = require("../utils/validationError");
const { body, param } = require("express-validator");
const passport = require("passport");
const requireAdmin = require("../middleware/requireAdmin");
const requireSelf = require("../middleware/requireSelf");

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

const updateInfoUserHandler = asyncHandler(async (req, res) => {
  const { email, username } = req.body;
  const updatedInfoUser = await updateInfoUser(
    req.params.userId,
    { email, username },
    {
      new: true,
    },
  );

  if (!updatedInfoUser) {
    return res.status(404).send("user not found");
  }

  return res.status(200).send(updatedInfoUser);
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
  patch: [param("userId").isMongoId(), body(["email", "username"]).optional().notEmpty()],
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
  passport.authenticate("bearer", { session: false }),
  requireAdmin,
  userValidationRules.put,
  handleValidationErrors,
  updateUserHandler,
);

router.patch(
  "/users/:userId/info",
  passport.authenticate("bearer", { session: false }),
  requireSelf,
  userValidationRules.patch,
  handleValidationErrors,
  updateInfoUserHandler,
);

router.delete(
  "/users/:userId",
  passport.authenticate("bearer", { session: false }),
  requireAdmin,
  userValidationRules.delete,
  handleValidationErrors,
  deleteUserHandler,
);

module.exports = router;
