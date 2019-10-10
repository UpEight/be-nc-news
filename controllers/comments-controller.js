const { insertComment, selectComments } = require("../models/comments-model");

exports.postComment = (req, res, next) => {
  insertComment(req.params, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.sendComments = (req, res, next) => {
  selectComments(req.params)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
