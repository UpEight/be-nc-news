const connection = require("../db/connection");

const { formatPostedComment } = require("../utils/utils");

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
  return connection
    .select("comment_id", "author", "votes", "created_at", "body")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order)
    .then(comments => {
      if (comments.length === 0) {
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
            } else {
              return comments;
            }
          });
      }
      return comments;
    });
};
