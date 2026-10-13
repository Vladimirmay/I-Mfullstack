const mongoose = require("mongoose");
const { Movie, Comments } = require("../models");

const addComment = async (movieId, authorId, body) => {
  const existingMovie = await Movie.findById(movieId);

  if (!existingMovie) {
    return null;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [comment] = await Comments.create([{ ...body, author: authorId }], {
      session,
    });
    const movie = await Movie.findByIdAndUpdate(
      movieId,
      { $push: { comments: comment._id } },
      { session },
    );

    await session.commitTransaction();
    return { movie, comment };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedComment = await Comments.findByIdAndDelete(commentId, { session });

    if (deletedComment) {
      await Movie.findByIdAndUpdate(
        movieId,
        { $pull: { comments: commentId } },
        { session },
      );
    }

    await session.commitTransaction();
    return deletedComment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  addComment,
  getMovieComments,
  deleteComment,
  updateComment,
};
