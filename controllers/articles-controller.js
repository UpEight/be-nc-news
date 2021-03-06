const {
  selectArticles,
  selectArticleById,
  updateVotes
} = require("../models/articles-model");

exports.sendArticles = (req, res, next) => {
  selectArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.sendArticleById = (req, res, next) => {
  selectArticleById(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.changeVotes = (req, res, next) => {
  updateVotes(req.params, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
