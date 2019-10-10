const articlesRouter = require("express").Router();
const {
  sendArticleById,
  changeVotes
} = require("../controllers/articles-controller");

const { send405Error } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(changeVotes)
  .all(send405Error);

module.exports = articlesRouter;
