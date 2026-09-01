const { Movie, Comments } = require("../models");

const addComment = async (movieId, body) => {
  const existingMovie = await Movie.findById(movieId);

  if (existingMovie) {
    const comment = await Comments.create(body);
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
  const movie = await Movie.findById(movieId).populate("comments");
  return movie ? movie.comments : null;
};
const updateComment = (commentId, body, options) => {
  return Comments.findByIdAndUpdate(commentId, body, options);
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
