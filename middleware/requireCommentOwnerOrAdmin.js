const { Comments } = require("../models");

const requireCommentOwnerOrAdmin = async (req, res, next) => {
  const comment = await Comments.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).send("comment not found");
  }

  const isOwner = comment.author && comment.author.toString() === req.user._id.toString();
  const isAdmin = req.user.roles.includes("admin");

  if (!isOwner && !isAdmin) {
    return res.status(403).send("forbidden: you can only edit your own comments");
  }

  next();
};

module.exports = requireCommentOwnerOrAdmin;
