const { selectArticleById, updateVotes } = require("../models/articles-model");

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.changeVotes = (req, res, next) => {
  updateVotes(req.params, req.body)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};
