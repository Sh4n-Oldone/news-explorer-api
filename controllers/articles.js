const Article = require('../models/article');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id }).sort({ createAt: -1 })
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Статьи отсутствуют');
      }
      return res.send(article);
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
    .then((article) => res.send(article))
    .catch(next);
};

module.exports.removeArticles = (req, res, next) => {
  const chosenArticle = req.params.articleId;
  Article.findOne({ _id: chosenArticle }).select('+owner')
    .then((article) => {
      if (article) {
        if (article.owner.toString() !== req.user._id) {
          throw new ForbiddenError('Ошибка авторизации');
        }
        return Article.deleteOne({ _id: chosenArticle }).then(() => res.send({ message: 'Статья удалена' }));
      }
      throw new NotFoundError('Статья не найдена');
    })
    .catch(next);
};
