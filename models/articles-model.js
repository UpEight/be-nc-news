const connection = require("../db/connection");

exports.selectArticles = ({ sort_by, order = "desc", author, topic }) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({
      status: 400,
      msg: `Unable to order comments by query ?order=${order} - order parameter must be 'asc' or 'desc'`
    });
  }
  const articles = getArticles(sort_by, order, author, topic);
  const authors = findQueryValueInDb("users", "username", author);
  const topics = findQueryValueInDb("topics", "slug", topic);
  const promises = Promise.all([articles, authors, topics]);
  return promises.then(([articles]) => {
    return articles;
  });
};

const getArticles = (sort_by, order, author, topic) => {
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

const findQueryValueInDb = (dbTable, dbColumn, queryValue) => {
  if (!queryValue) {
    return true;
  }
  return connection
    .select(dbColumn)
    .from(dbTable)
    .where(dbColumn, queryValue)
    .then(records => {
      if (records.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No results found - query value: '${queryValue}' does not exist`
        });
      } else {
        return true;
      }
    });
};

exports.selectArticleById = ({ article_id }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found with article_id = ${article_id}`
        });
      }
      article.comment_count = parseInt(article.comment_count);
      return article;
    });
};

exports.updateVotes = ({ article_id }, votesData) => {
  const allowedKey = "inc_votes";
  if (Object.keys(votesData).length > 0) {
    if (
      Object.keys(votesData).length > 1 ||
      !Object.keys(votesData).includes(allowedKey)
    ) {
      return Promise.reject({ status: 400, msg: "Malformed request body" });
    }
  }
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", votesData.inc_votes || 0)
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
