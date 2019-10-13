const commentsRouter = require("express").Router();

const {
  changeVotes,
  removeComment
} = require("../controllers/comments-controller");

commentsRouter
  .route("/:comment_id")
  .patch(changeVotes)
  .delete(removeComment);

module.exports = commentsRouter;
