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

exports.formatComments = (comments, articleRef) => {};
