const router = require('express').Router();

const usersRouter = require('./users.js');
const articlesRouter = require('./articles.js');
const NotFoundError = require('../errors/notFoundError.js');

router.use(
  usersRouter,
  articlesRouter,
  () => {
    throw new NotFoundError('Запрашиваемый ресурс не найден');
  },
);

module.exports = router;
