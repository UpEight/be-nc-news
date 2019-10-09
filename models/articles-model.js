const connection = require("../db/connection");

exports.selectArticleById = id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .then(([article]) => {
      article.comment_count = parseInt(article.comment_count);
      return article;
    });
};
