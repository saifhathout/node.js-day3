const errorHandler = (err, req, res, next) => {
  console.log('🔥 Error Handler Called');
  console.log('Error:', err);
  console.log('Error Name:', err.name);
  console.log('Error Message:', err.message);
  console.log('Error Stack:', err.stack);
  
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    status = 400;
    const errors = Object.values(err.errors).map((el) => ({
      field: el.path,
      message: el.message,
    }));
    return res.status(status).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    return res.status(status).json({
      success: false,
      message,
    });
  }

  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    return res.status(status).json({
      success: false,
      message,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
    return res.status(status).json({
      success: false,
      message,
    });
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
    return res.status(status).json({
      success: false,
      message,
    });
  }

  return res.status(status).json({
    success: false,
    message,
  });
};

class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  AppError,
};