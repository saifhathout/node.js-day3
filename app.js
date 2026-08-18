const express = require('express');
const morgan = require('morgan');

const healthRouter = require('./routes/health.routes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Site System API is running',
  });
});

app.use('/api', healthRouter);

module.exports = app;