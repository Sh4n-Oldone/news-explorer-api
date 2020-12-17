const router = require('express').Router();

const usersRouter = require('./users.js');
const articlesRouter = require('./articles.js');
const NotFoundError = require('../errors/notFoundError.js');
// const limiter = require('../middlewares/limiter.js');

// router.use(limiter);
router.use(
  usersRouter,
  articlesRouter,
  () => {
    throw new NotFoundError('Запрашиваемый ресурс не найден');
  },
);

module.exports = router;
