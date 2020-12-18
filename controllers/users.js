const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const NotAllowToCreateUser = require('../errors/notAllowToCreateUser');
const NotAuthorizeError = require('../errors/notAuthorizeError');
const BadRequestError = require('../errors/badRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) { throw new NotAllowToCreateUser('Ошибка создания пользователя'); }
      if (!user) {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            email, password: hash, name,
          }))
          .then((newUser) => res.send({ message: `Пользователь ${newUser.email} создан` }))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Ошибка запроса к серверу');
  }

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotAuthorizeError('Неверный логин или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotAuthorizeError('Неверный логин или пароль');
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  const { _id } = req.user;

  User.findOne({ _id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не обнаружен');
      }
      return res.send(user);
    })
    .catch(next);
};
