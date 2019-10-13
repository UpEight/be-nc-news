exports.formatDates = list => {
  if (list.length === 0) {
    return [];
  }
  return list.map(article => {
    const formattedArticle = { ...article };
    formattedArticle.created_at = new Date(formattedArticle.created_at);
    return formattedArticle;
  });
};

exports.makeRefObj = list => {
  if (list.length === 0) return {};
  const refObj = {};
  list.forEach(article => {
    refObj[article.title] = article.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  if (comments.length === 0 || Object.keys(articleRef).length === 0) {
    return [];
  }
  const formattedComments = comments.map(comment => {
    const formattedComment = { ...comment };
    if (comment.hasOwnProperty("created_by")) {
      formattedComment.author = formattedComment.created_by;
      delete formattedComment.created_by;
    }
    if (comment.hasOwnProperty("belongs_to")) {
      formattedComment.article_id = articleRef[formattedComment.belongs_to];
      delete formattedComment.belongs_to;
    }
    if (comment.hasOwnProperty("created_at")) {
      formattedComment.created_at = new Date(formattedComment.created_at);
    }
    return formattedComment;
  });

  return formattedComments;
};

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
