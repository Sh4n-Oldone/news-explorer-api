const Article = require('../models/article');
const NotFoundError = require('../errors/notFoundError');
const NotAuthorizeError = require('../errors/notAuthorizeError');

module.exports.getArticles = (req, res, next) => {
  Article.find({}).sort({ createAt: -1 })
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Статьи отсутствуют');
      }
      return res.status(200).send(article);
    })
    .catch(next);
};

module.exports.createArticles = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.status(200).send(article))
    .catch(next);
};

module.exports.removeArticles = (req, res, next) => {
  const chosenArticle = req.params.articleId;
  Article.findOne({ _id: chosenArticle }).select('+owner')
    .then((article) => {
      if (article) {
        // eslint-disable-next-line eqeqeq
        if (article.owner == req.user._id) {
          return Article.deleteOne({ _id: chosenArticle }).then(() => res.status(200).send({ message: 'Статья удалена' }));
        }
        throw new NotAuthorizeError('Ошибка авторизации');
      }
      throw new NotFoundError('Статья не найдена');
    })
    .catch(next);
};
