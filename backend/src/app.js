const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const env = require('./config/env');
const logger = require('./middlewares/logger');
const rateLimit = require('./middlewares/rateLimit');
const requestContext = require('./middlewares/requestContext');
const { notFound, errorHandler } = require('./middlewares/error');
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const conceptRoutes = require('./routes/conceptRoutes');
const bookmarkNoteRoutes = require('./routes/bookmarkNoteRoutes');
const searchRoutes = require('./routes/searchRoutes');
const filterRoutes = require('./routes/filterRoutes');
const voteRoutes = require('./routes/voteRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const bulkRoutes = require('./routes/bulkRoutes');
const systemRoutes = require('./routes/systemRoutes');
const discoveryRoutes = require('./routes/discoveryRoutes');

const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(requestContext);
app.use(rateLimit);
app.use(logger);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CAIA backend is running'
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/concepts', conceptRoutes);
app.use('/api/v1/me', bookmarkNoteRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/filter', filterRoutes);
app.use('/api/v1/votes', voteRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/bulk', bulkRoutes);
app.use('/api/v1/discovery', discoveryRoutes);
if (env.ENABLE_SYSTEM_ROUTES) {
  app.use('/api/v1/system', systemRoutes);
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
