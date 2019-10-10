const articlesRouter = require("express").Router();
const {
  sendArticleById,
  changeVotes
} = require("../controllers/articles-controller");

const { postComment } = require("../controllers/comments-controller");

const { send405Error } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(changeVotes)
  .all(send405Error);

articlesRouter.route("/:article_id/comments").post(postComment);

module.exports = articlesRouter;
