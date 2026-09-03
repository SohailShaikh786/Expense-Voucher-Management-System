const config = require('../config/env');

/**
 * Centralized Application Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  console.error('[Error caught by errorHandler]:', err);

  // Multer Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 5MB limit. Please upload a smaller signature file.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`
    });
  }

  // Multer file filter custom error
  if (err.message && err.message.includes('Invalid file format')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Prisma Unique Constraint Error (P2002)
  if (err.code === 'P2002') {
    const target = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${target} already exists.`
    });
  }

  // Prisma Record Not Found (P2025)
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Requested record was not found in the database.'
    });
  }

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'Internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
