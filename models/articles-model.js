const connection = require("../db/connection");

exports.selectArticles = ({ sort_by, order = "desc", author, topic }) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({
      status: 400,
      msg: `Unable to order comments by query ?order=${order} - order parameter must be 'asc' or 'desc'`
    });
  }
  const articles = getArticles(sort_by, order, author, topic);
  const authors = findAuthorInDb(author);
  const promises = Promise.all([articles, authors]);
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

const findAuthorInDb = author => {
  if (!author) {
    return true;
  }
  return connection
    .select("username")
    .from("users")
    .where("username", author)
    .then(authors => {
      if (authors.length === 0) {
        return Promise.reject({
          status: 400,
          msg: `Bad request - author: ${author} does not exist`
        });
      } else {
        return true;
      }
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
