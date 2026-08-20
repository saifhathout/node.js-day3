const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const healthRouter = require('./routes/health.routes');
const userRouter = require('./routes/user.routes');
const taskRouter = require('./routes/task.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// ✅ اتصال MongoDB - من غير Options
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

app.use(express.json());
app.use(morgan('dev'));

app.use('/api', healthRouter);
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

app.use(errorHandler);

module.exports = app;