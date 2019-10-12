const articlesRouter = require("express").Router();
const {
  sendArticles,
  sendArticleById,
  changeVotes
} = require("../controllers/articles-controller");

const {
  postComment,
  sendComments
} = require("../controllers/comments-controller");

const { send405Error } = require("../errors");

articlesRouter
  .route("/")
  .get(sendArticles)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(changeVotes)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(sendComments)
  .all(send405Error);

module.exports = articlesRouter;
