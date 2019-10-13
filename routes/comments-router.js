const commentsRouter = require("express").Router();

const {
  changeVotes,
  removeComment
} = require("../controllers/comments-controller");

const { send405Error } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(changeVotes)
  .delete(removeComment)
  .all(send405Error);

module.exports = commentsRouter;
