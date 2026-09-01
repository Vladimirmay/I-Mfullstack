const express = require("express");
const {
  addComment,
  getMovieComments,
  deleteComment,
  updateComment,
} = require("../services/commentsService");
const router = express.Router();

router.post("/movies/:movieId/comments/", async (req, res) => {
  try {
    const resultComment = await addComment(req.params.movieId, req.body);

    if (!resultComment) {
      return res.status(404).send("movie not found");
    }

    return res.status(201).send("comment created");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/movies/:movieId/comments/", async (req, res) => {
  try {
    const comments = await getMovieComments(req.params.movieId);
    if (!comments) {
      return res.status(404).send("movie not found");
    }
    return res.status(200).send(comments);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.put("/movies/:movieId/comments/:commentId", async (req, res) => {
  try {
    const updatedComment = await updateComment(req.params.commentId, req.body, {
      new: true,
    });

    if (!updatedComment) {
      return res.status(404).send("comment not found");
    }

    return res.status(200).send(updatedComment);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.delete("/movies/:movieId/comments/:commentId", async (req, res) => {
  try {
    const deletedComment = await deleteComment(req.params.movieId, req.params.commentId);

    if (!deletedComment) {
      return res.status(404).send("Comment not found");
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
