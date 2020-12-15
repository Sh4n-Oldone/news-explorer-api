const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const NotAllowToCreateUser = require('../errors/notAllowToCreateUser');

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
          .then((newUser) => res.status(200).send({ message: `Пользователь ${newUser.email} создан` }))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
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
      return res.status(200).send(user);
    })
    .catch(next);
};
