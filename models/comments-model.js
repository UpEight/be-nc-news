const connection = require("../db/connection");

exports.insertComment = ({ article_id }, commentData) => {
  if (
    Object.keys(commentData).length !== 2 ||
    !commentData.username ||
    !commentData.body
  ) {
    return Promise.reject({ status: 400, msg: "Malformed request body" });
  }
  const formattedCommentData = { ...commentData };
  formattedCommentData.author = commentData.username;
  delete formattedCommentData.username;
  formattedCommentData.article_id = article_id;

  return connection
    .insert(formattedCommentData)
    .into("comments")
    .returning("*")
    .then(([comment]) => {
      return comment;
    });
};

exports.selectComments = ({ article_id }, { sort_by, order }) => {
  return connection
    .select("comment_id", "author", "votes", "created_at", "body")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Unable to get comments - no article found with article_id = ${article_id}`
        });
      }
      return comments;
    });
};
