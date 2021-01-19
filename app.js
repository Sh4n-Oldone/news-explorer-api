require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { errorLogger } = require('express-winston');
const cors = require('cors');
const routes = require('./routes/index.js');
const { login, createUser } = require('./controllers/users');
const { requestLogger } = require('./middlewares/logger.js');
const auth = require('./middlewares/auth.js');
const globalErrorsCatch = require('./middlewares/globalErrorsCatch.js');
const limiter = require('./middlewares/limiter.js');

const app = express();
const { PORT = 3000 } = process.env;
const { NODE_ENV, MONGO_LINK } = process.env;

app.use(helmet());

mongoose.connect(`mongodb://${NODE_ENV === 'production' ? MONGO_LINK : 'localhost:27017/newsdb'}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000/',
  methods: 'GET, POST, DELETE',
}));
app.options('*', cors());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).pattern(/^[\S]+$/i),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use(requestLogger);

app.use(limiter);

app.use(auth);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(globalErrorsCatch);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Работаю! Порт: ${PORT}`);
});

module.exports = app;
