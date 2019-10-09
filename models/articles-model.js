const connection = require("../db/connection");

exports.selectArticleById = id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", id)
    .then(articles => {
      return articles[0];
    });
};
