const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { getArticles, createArticles, removeArticles } = require('../controllers/articles');

articlesRouter.get('/articles', getArticles);
articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(300),
    text: Joi.string().required().min(2).max(3000),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Некорректная ссылка на статью');
    }),
    image: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Некорректная ссылка на изображение');
    }),
  }),
}), createArticles);
articlesRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().max(24),
  }),
}), removeArticles);

module.exports = articlesRouter;
