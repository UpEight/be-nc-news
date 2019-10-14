const connection = require("../db/connection");

const { formatPostedComment } = require("../db/utils/utils");

exports.insertComment = ({ article_id }, commentData) => {
  if (
    Object.keys(commentData).length !== 2 ||
    !commentData.username ||
    !commentData.body
  ) {
    return Promise.reject({ status: 400, msg: "Malformed request body" });
  }

  const formattedCommentData = formatPostedComment(commentData, article_id);

  return connection
    .insert(formattedCommentData)
    .into("comments")
    .returning("*")
    .then(([comment]) => {
      return comment;
    });
};

exports.selectComments = ({ article_id }, { sort_by, order = "desc" }) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({
      status: 400,
      msg: `Unable to order comments by query ?order=${order} - order parameter must be 'asc' or 'desc'`
    });
  }

  const comments = getComments(article_id, sort_by, order);
  const checkIfArticleExists = getArticles(article_id);

  const promises = Promise.all([comments, checkIfArticleExists]);
  return promises.then(([comments]) => {
    return comments;
  });
};

const getArticles = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Unable to get comments - no article found with article_id = ${article_id}`
        });
      }
    });
};

const getComments = (article_id, sort_by, order) => {
  return connection
    .select("comment_id", "author", "votes", "created_at", "body")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order);
};

exports.updateVotes = ({ comment_id }, votesData) => {
  const allowedKey = "inc_votes";
  if (Object.keys(votesData).length > 0) {
    if (
      Object.keys(votesData).length > 1 ||
      !Object.keys(votesData).includes(allowedKey)
    ) {
      return Promise.reject({ status: 400, msg: "Malformed request body" });
    }
  }
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", votesData.inc_votes || 0)
    .returning("*")
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: `No comment found with comment_id = ${comment_id}`
        });
      }
      return comment;
    });
};

exports.deleteComment = ({ comment_id }) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(recordsDeleted => {
      if (!recordsDeleted) {
        return Promise.reject({
          status: 404,
          msg: `Comment with comment_id = ${comment_id} not found`
        });
      }
    });
};
