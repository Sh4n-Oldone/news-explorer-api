const mongoose = require('mongoose');

const validURL = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const articleSchema = new mongoose.Schema({
  keyword: {
    required: true,
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
  text: {
    required: true,
    type: String,
  },
  date: {
    required: true,
    type: String,
  },
  source: {
    required: true,
    type: String,
  },
  link: {
    required: true,
    type: String,
    validate: {
      validator(v) {
        return validURL.test(v);
      },
      message: 'Некорректная ссылка!',
    },
  },
  image: {
    required: true,
    type: String,
    validate: {
      validator(v) {
        return validURL.test(v);
      },
      message: 'Некорректная ссылка!',
    },
  },
  owner: {
    type: String,
    select: false,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('article', articleSchema);
