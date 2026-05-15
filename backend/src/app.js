const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const { notFound, errorHandler } = require('./middlewares/error');

const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins
  })
);
app.use(express.json({ limit: '1mb' }));

if (env.ENABLE_REQUEST_LOGGING) {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CAIA backend is running'
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
