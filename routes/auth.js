const express = require("express");
const { body } = require("express-validator");
const { loginUser, generateToken } = require("../services/authService");
const { handleValidationErrors, asyncHandler } = require("../utils/validationError");

const router = express.Router();

const loginUserHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const login = await loginUser(email, password);

  if (!login) {
    return res.status(401).send("Неверная почта или пароль");
  }

  const token = generateToken(email);
  const { password: _password, ...userWithoutPassword } = login.toObject();

  return res.status(200).json({ token, user: userWithoutPassword });
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

module.exports = router;
