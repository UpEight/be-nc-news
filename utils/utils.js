exports.formatPostedComment = (commentData, article_id) => {
  if (Object.keys(commentData).length === 0) {
    return {};
  }
  const formattedCommentData = { ...commentData };
  formattedCommentData.author = commentData.username;
  delete formattedCommentData.username;
  formattedCommentData.article_id = article_id;
  return formattedCommentData;
};
