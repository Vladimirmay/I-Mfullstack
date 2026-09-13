const express = require("express");
const { loginUser } = require("../services/authService");
const { handleValidationErrors, asyncHandler } = require("../utils/validationError");
const { body } = require("express-validator");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

const profileHandler = asyncHandler(async (req, res) => {
  const { password, ...userWithoutPassword } = req.user.toObject();
  return res.status(200).send(userWithoutPassword);
});

const loginUserHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const login = await loginUser(email, password);

  if (!login) {
    return res.status(401).send("Неверная почта или пароль");
  }

  return res.status(200).send(`${email} ${password}`);
});

const authValidationRules = {
  post: [body(["email", "password"]).notEmpty()],
};

router.post(
  "/auth/login",
  authValidationRules.post,
  handleValidationErrors,
  loginUserHandler,
);

router.get("/auth/profile", authenticate, profileHandler);

module.exports = router;
