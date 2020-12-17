const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  max: 50, // 50 запросов
  windowMs: 15 * 60 * 1000, // за 15 минут
  message: 'Слишком много запросов. Попробуйте позже', // сообщение при ошибке
});

module.exports = limiter;
