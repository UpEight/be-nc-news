const connection = require("../db/connection");

exports.selectArticles = ({ sort_by, order = "desc", author, topic }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .orderBy(sort_by || "created_at", order)
    .modify(queryBuilder => {
      if (author) queryBuilder.where("articles.author", author);
      if (topic) queryBuilder.where("articles.topic", topic);
    })
    .then(articles => {
      articles.forEach(article => {
        article.comment_count = parseInt(article.comment_count);
        return article;
      });
      return articles;
    });
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
