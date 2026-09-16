const { Movie, Comments } = require("../models");

const addComment = async (movieId, authorId, body) => {
  const existingMovie = await Movie.findById(movieId);

  if (existingMovie) {
    const comment = await Comments.create({ ...body, author: authorId });
    const movie = await Movie.findByIdAndUpdate(movieId, {
      $push: { comments: comment._id },
    });
    return {
      movie,
      comment,
    };
  } else return null;
};

const getMovieComments = async (movieId) => {
  const movie = await Movie.findById(movieId).populate({
    path: "comments",
    populate: { path: "author" },
  });
  return movie ? movie.comments : null;
};

const updateComment = (commentId, text, options) => {
  return Comments.findByIdAndUpdate(commentId, { text }, options);
};

const deleteComment = async (movieId, commentId) => {
  const deletedComment = await Comments.findByIdAndDelete(commentId);

  if (deletedComment) {
    await Movie.findByIdAndUpdate(movieId, { $pull: { comments: commentId } });
  }

  return deletedComment;
};

module.exports = {
  addComment,
  getMovieComments,
  deleteComment,
  updateComment,
};
