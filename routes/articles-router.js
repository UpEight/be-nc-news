const articlesRouter = require("express").Router();
const {
  sendArticleById,
  changeVotes
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(sendArticleById)
  .patch(changeVotes);

module.exports = articlesRouter;
