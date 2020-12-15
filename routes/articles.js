const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticles, removeArticles } = require('../controllers/articles');

const validURL = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

articlesRouter.get('/articles', getArticles);
articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(300),
    text: Joi.string().required().min(2).max(3000),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().regex(validURL).required(),
    image: Joi.string().regex(validURL).required(),
  }),
}), createArticles);
articlesRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().max(24),
  }),
}), removeArticles);

module.exports = articlesRouter;
