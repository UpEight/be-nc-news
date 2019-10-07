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

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
