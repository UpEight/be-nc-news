const commentsRouter = require("express").Router();

const { changeVotes } = require("../controllers/comments-controller");

commentsRouter.route("/:comment_id").patch(changeVotes);

module.exports = commentsRouter;
