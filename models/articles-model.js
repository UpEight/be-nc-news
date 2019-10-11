const connection = require("../db/connection");

exports.selectArticles = () => {
  return connection.select("articles.*").from("articles");
};

exports.selectArticleById = id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found with article_id = ${id}`
        });
      }
      article.comment_count = parseInt(article.comment_count);
      return article;
    });
};

exports.updateVotes = ({ article_id }, votesData) => {
  if (Object.keys(votesData).length !== 1) {
    return Promise.reject({ status: 400, msg: "Malformed request body" });
  }
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", votesData.inc_votes)
    .returning("*")
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found with article_id = ${article_id}`
        });
      }
      return article;
    });
};
