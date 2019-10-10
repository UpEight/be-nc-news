const connection = require("../db/connection");

exports.insertComment = ({ article_id }, commentData) => {
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
