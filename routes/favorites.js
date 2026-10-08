const express = require("express");
const passport = require("passport");
const { getFavoritesCountByTitle } = require("../services/usersService");
const { asyncHandler } = require("../utils/validationError");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

const getFavoritesStatsHandler = asyncHandler(async (req, res) => {
  const stats = await getFavoritesCountByTitle();
  return res.status(200).send(stats);
});

router.get(
  "/favorites/stats",
  passport.authenticate("bearer", { session: false }),
  requireAdmin,
  getFavoritesStatsHandler,
);

module.exports = router;
