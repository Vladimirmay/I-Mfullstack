const express = require("express");
const passport = require("passport");
const {
  addComment,
  getMovieComments,
  deleteComment,
  updateComment,
} = require("../services/commentsService");
const { handleValidationErrors, asyncHandler } = require("../utils/validationError");
const { body, param } = require("express-validator");
const requireCommentOwnerOrAdmin = require("../middleware/requireCommentOwnerOrAdmin");

const router = express.Router();

const addCommentHandler = asyncHandler(async (req, res) => {
  const resultComment = await addComment(req.params.movieId, req.user._id, req.body);

  if (!resultComment) {
    return res.status(404).send("movie not found");
  }

  return res.status(201).send("comment created");
});

const getMovieCommentsHandler = asyncHandler(async (req, res) => {
  const comments = await getMovieComments(req.params.movieId);
  if (!comments) {
    return res.status(404).send("movie not found");
  }
  return res.status(200).send(comments);
});

const updateCommentHandler = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const updatedComment = await updateComment(req.params.commentId, text, {
    new: true,
  });

  if (!updatedComment) {
    return res.status(404).send("comment not found");
  }

  return res.status(200).send(updatedComment);
});

const deleteCommentHandler = asyncHandler(async (req, res) => {
  const deletedComment = await deleteComment(req.params.movieId, req.params.commentId);

  if (!deletedComment) {
    return res.status(404).send("Comment not found");
  }
  return res.status(204).send();
});

const commentValidationRules = {
  post: [param("movieId").isMongoId(), body("text").notEmpty()],
  get: param("movieId").isMongoId(),
  put: [
    param("movieId").isMongoId(),
    param("commentId").isMongoId(),
    body("text").notEmpty(),
  ],
  delete: [param("movieId").isMongoId(), param("commentId").isMongoId()],
};

router.post(
  "/movies/:movieId/comments/",
  passport.authenticate("bearer", { session: false }),
  commentValidationRules.post,
  handleValidationErrors,
  addCommentHandler,
);

router.get(
  "/movies/:movieId/comments/",
  commentValidationRules.get,
  handleValidationErrors,
  getMovieCommentsHandler,
);

router.put(
  "/movies/:movieId/comments/:commentId",
  passport.authenticate("bearer", { session: false }),
  requireCommentOwnerOrAdmin,
  commentValidationRules.put,
  handleValidationErrors,
  updateCommentHandler,
);

router.delete(
  "/movies/:movieId/comments/:commentId",
  passport.authenticate("bearer", { session: false }),
  requireCommentOwnerOrAdmin,
  commentValidationRules.delete,
  handleValidationErrors,
  deleteCommentHandler,
);

module.exports = router;
